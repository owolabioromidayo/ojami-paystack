import express, { Request, Response } from "express";

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from "@langchain/core/output_parsers";

import { XMLParser } from 'fast-xml-parser';


import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import fs from 'fs';
import path from 'path';

import * as readline from 'readline';
import { EntityManager } from "@mikro-orm/core";
import { Product } from "../entities/Product";
import { ProductLink } from "../entities/ProductLink";
import { RequestWithContext } from "../types";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "../mikro-orm.config";
import { generate } from "@langchain/core/dist/utils/fast-json-patch";
// import { kMaxLength } from "buffer";

require("dotenv").config();

const URL_PREFIX = `${process.env.DOMAIN_URL}/p/`;

const router = express.Router();

const openaiKey = process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.6 });

let vectorstore: FaissStore;

// fs.readFileS(path.join(__dirname, 'catalogue.json'), 'utf-8', (err, data) => {
//     if (err) throw err;
//     const jsonData = JSON.parse(data);
//     FaissStore.fromTexts(
//         jsonData.map((d: any) => JSON.stringify(d)),
//         jsonData.map((_: any, i: number) => ({ id: i })),
//         new OpenAIEmbeddings({ apiKey: openaiKey })
//     ).then((store) => {
//         vectorstore = store;
//     }).catch((error) => {
//         console.error('Error creating vectorstore:', error);
//         throw error;
//     });
// });


export async function generateEmbeddingsSync() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'catalogue.json'), 'utf-8');
        const jsonData = JSON.parse(data);
        vectorstore = await FaissStore.fromTexts(
            jsonData.map((d: any) => JSON.stringify(d)),
            jsonData.map((_: any, i: number) => ({ id: i })),
            new OpenAIEmbeddings({ apiKey: openaiKey })
        );
        console.log('Vectorstore initialized successfully');
    } catch (error) {
        console.error('Error creating vectorstore:', error);
        throw error;
    }
};






const SYSTEM_TEMPLATE = new PromptTemplate({
    template: `STRONGLY ENSURE TO NOT STATE ANY PRICING OR AVAILABLE ITEM INFORMATION NOT PROVIDED TO YOU. 
    
    

    You are a shopping assistant chatbot for Oja mi, a digital shopping platform for selling a range of items from several stores in Nigeria.
    You are currently acting as a personalized chatbot for an online storefront. You have been configured with the following parameters {merchant_settings}. Do your utmost to
    conform to them, especially the language style chosen.

    PLEASE ENSURE TO MAINTAIN THIS TONE OF CONVERSATION THROUGH OUT

    Think logically. Reason step by step. Understand numbers and their relations. 
    Always keep things from your the context in memory and reason accordingly. 
    You work in a professional manner and work on sales and upselling and matching users with potential products they 
    are likely to buy using ground truth and step by step reasoning.

    Please do not make empty vapid statements like
    <example> Hello! I'm here to assist you with a wide range of topics, whether you have questions, need information, or just want to chat. How can I help you today? </example>
    Instead,  ensure to provide actually actionable information.
    
    Use as many tokens as required to think through your current state and what would be maximally desirable of you. You can thank as much as you want in <thinking> XML tags,
    then use <text> tags as the end to idenfity your final response. 


    PLEASE ANSWER IN THE FOLLOWING FORMAT

    <example>
    
    <thinking> Your reasoning step by step </thinking>
    <text> your final arrived at solution </text>

    <thinking>

    You do not have to worry about refining your thoughts, I will ensure to parse them out. please do comply. thanks. BUT PLEASE ENSURE TO USE THE XML TAGS, DO NOT FORGET TO CLOSE THEM.
    

    `,
    inputVariables: ['merchant_settings']
});

const START_PROMPT = "Introduce yourself, your name,  who you work for, what you have for sale, and how you plan to help.";
// const FILTER_PROMPT = `Based on our previous conversation, the user is interested in our product catalog. Please provide relevant information about the products they're asking about. If they haven't specified a product, ask for more details about what they're looking for. Don't make assumptions about their selection unless they clearly state it.`;

const FILTER_PROMPT = `
Respond to the user's question based on the provided context and product information. 
DO NOT say items are unavailable when they are.
Do not waste the customers time, do what they want, dont suggest things they dont care about, urgency and pertinence are paramount.
Your core objective is to speedily get the customer to choose an item, then move to the purchasing step. 
Do your utmost to get them to confirm that they are interested in purchasing an item. Prompt them, YOU are leading the conversation.

`;




const SUMMARIZATION_TEMPLATE = new PromptTemplate({
    template: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language. Chat History: {chat_history} Follow Up Input: {question} Standalone question:`,
    inputVariables: ['chat_history', 'question']
});

function formatChatHistory(chatHistory: Array<{ text: string }>): string {
    return chatHistory.map(dialogueTurn => `Human: ${dialogueTurn.text}`).join('\n');
}

async function summarizeConversation(conversation: Array<{ text: string }>, user_q: string) {

    // const summarizationTemplate = PromptTemplate.fromTemplate(
    //     "Summarize the following conversation:\n{chat_history}\n\nUser's question: {question}"
    // );

    const chain = RunnableSequence.from([
        {
            chat_history: (input: any) => input.chat_history,
            question: (input: any) => input.question,
        },
        SUMMARIZATION_TEMPLATE,
        new ChatOpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY }),
        new StringOutputParser(),
    ]);

    const result = await chain.invoke({
        chat_history: formatChatHistory(conversation),
        question: user_q,
    });

    return result;
}

async function queryCgpt(prompt: string, userQ: string, metadata: any) {

    let system_prompt: string = await SYSTEM_TEMPLATE.format({ merchant_settings: JSON.stringify(metadata.merchantSettings) });
    const chatTemplate = {
        messages: [
            { role: "system", content: `${system_prompt}\n${prompt}` },
            { role: "user", content: userQ }
        ]
    };
    console.log(chatTemplate.messages);
    const response = await llm.invoke(chatTemplate.messages);
    console.log(response.content)
    return response.content;
}

async function queryCgptClean(prompt: string, userQ: string, metadata: any) {

    // let system_prompt: string = await SYSTEM_TEMPLATE.format({ merchant_settings: JSON.stringify(metadata.merchantSettings) });
    const chatTemplate = {
        messages: [
            { role: "system", content: `${prompt}` },
            { role: "user", content: userQ }
        ]
    };
    console.log(chatTemplate.messages);
    const response = await llm.invoke(chatTemplate.messages);
    console.log(response.content)
    return response.content;
}

async function generateStartResponse(conversation: any[], metadata: any) {


    const professionalMerchantSettings = {
        name: "gateway Technologies",
        description: "GATEWAY TECHNOLOGIES\nSALES OF BRAND NEW IPHONES \nUK USED IPHONES.\nSAMSUNG PHONES\nLOCATE US AT KNUST \n#ghana\n#kumasi\n#knust \n#iphones\n#knust",
        prePrompt: "You are a very helpful sales-rep for gatewaydevice, a growing instagram store for selling technology hardware and accessories.",
        conversationTone: "professional",
        languageStyle: "Standard English",
        talkativeness: "concise",
        professionalism: "highly professional",
        humorLevel: "no humor",
        technicalLanguage: "industry-specific jargon, but explain in brackets",
        emojiUsage: "none",
        personalization: "highly personalized",
        culturalReferences: "use only as needed",
        negotiatePrices: "no",
        upsell: "yes",
        assistantName: "Steven"

    }

    const casualMerchantSettings = {
        name: "gateway Technologies",
        description: "GATEWAY TECHNOLOGIES\nSALES OF BRAND NEW IPHONES \nUK USED IPHONES.\nSAMSUNG PHONES\nLOCATE US AT KNUST \n#ghana\n#kumasi\n#knust \n#iphones\n#knust",
        conversationTone: "casual",
        prePrompt: "You are a very helpful sales-rep for gatewaydevice, a growing instagram store for selling technology hardware and accessories.",
        languageStyle: "Pidgin English",
        talkativeness: "chatty",
        professionalism: "light",
        humorLevel: "light humor, but not detracting",
        technicalLanguage: "layman terms",
        emojiUsage: "frequent",
        culturalReferences: "extensive local cultural references to Nigeria",
        personalization: "highly personalized",
        negotiatePrices: "yes",
        upsell: "yes",
        assistantName: "Ada"

    }


    metadata.merchantSettings = metadata.mode === "casual" ? casualMerchantSettings : professionalMerchantSettings;
    const searchResults = await vectorstore.similaritySearch("the most important items", 10);
    metadata.recommendations = searchResults.map(doc => doc.pageContent);

    const context = `
    Recommendations:
    ${metadata.recommendations.join('\n')}
    `;

    const resp = await queryCgpt(START_PROMPT, context, metadata);


    // const resp = await queryCgpt(START_PROMPT, "", metadata);
    metadata.state = "filtering_loop";
    return { resp, metadata };
}

async function generateFilterResponse(conversation: any[], metadata: any) {
    try {
        // const summarization = await summarizeConversation(conversation.slice(0, -1), conversation.slice(-1)[0].text);
        // let resp = await queryCgpt(FILTER_PROMPT, summarization.toString());

        // // Further logic for handling choices and updating metadata...

        // const embeddings = new OpenAIEmbeddings();

        // // Create choices for embedding
        // const choices = [
        //     "The user is still in the process of selecting an item.",
        //     "The user has narrowed down on one item and you have decided to move forward in the sales chain."
        // ];

        // const choiceEmbeddings = await embeddings.embedDocuments(choices);
        // const respEmbedding = await embeddings.embedQuery(resp.toString());

        // // Calculate cosine similarity
        // const similarities = choiceEmbeddings.map(choiceEmb =>
        //     similarity.cosine(respEmbedding, choiceEmb)
        // );

        // // Find the most similar choice
        // const mostSimilarIndex = similarities.indexOf(Math.max(...similarities));
        // const mostSimilar = choices[mostSimilarIndex];

        // metadata.state = mostSimilar === choices[0] ? "filtering_loop" : "item_chosen";

        // if (metadata.state === "item_chosen") {
        //     const selectedItem = await queryCgpt(`Please answer shortly and succinctly. What item did this user select ${conversation[conversation.length - 1].text}`, "");
        //     resp = `Glad you have settled on the ${selectedItem}. Let us begin processing the transaction`;
        // } else {


        //     const searchResults = await vectorstore.similaritySearch(summarization, 3);

        //     metadata.recommendations = searchResults.map(doc => doc.pageContent);

        //     resp = `Do you find these recommendations to your liking? Please tell me more about what you're looking for.
        //     If you have finalized on a decision, please ensure to indicate that you have settled on one item and 
        //     copy its description into the chat.

        //     Recommendations:
        //     ${metadata.recommendations.join('\n')}`;
        // }

        const summarization = await summarizeConversation(conversation.slice(0, -1), conversation[conversation.length - 1].text);
        const searchResults = await vectorstore.similaritySearch(summarization, 10);
        metadata.recommendations = searchResults.map(doc => doc.pageContent);

        const context = `
             Conversation: ${JSON.stringify(conversation)},
            ${conversation[conversation.length - 1].text}
            Relevant product information:
            ${metadata.recommendations.join('\n')}
        `;

        let resp = await queryCgpt(FILTER_PROMPT, context, metadata);

        console.log(context, resp);

        // Check if the response indicates a clear selection
        const hasUserSettled = await queryCgptClean(`
            We are just trying to figure out if the user is interested in buying an item. You dont need to be too strict on this, if they show interest in purchasing an item, move on, we can always come back.
            Please answer with 'yes' or 'no' ONLY for this question, based on the following conversation context.
            Context:
${context}`, "", metadata);

        console.log(`hasUserSettled: ${hasUserSettled}`);

        if (hasUserSettled.toString().toLowerCase().trim().includes('yes') || conversation[conversation.length - 1].text.toLowerCase().includes('skip')) {
            metadata.state = "item_chosen";
        } else {
            metadata.state = "filtering_loop";
        }



        return { resp, metadata };
    } catch (error) {
        console.error("Error in generateFilterResponse:", error);
        throw error;
    }


}


async function handleItemChosen(conversation: any[], metadata: any, em: EntityManager) {
    const productName = JSON.parse(metadata.recommendations?.[0])?.name;
    console.log(productName);
    metadata.chosenItem = productName;

    const product = await em.findOne(Product, { name: { $like: `%${productName}%` } });
    console.log(product)

    if (!product) {
        throw new Error('Product not found in database');
    }

    try {
        if (product.link) {
            await em.populate(product, ['link.shortLink', 'link.qrCode']);
            metadata.links = {
                shortLink: product.link?.shortLink,
                qrCode: product.link?.qrCode,
            };
            console.log(product.link);

            const resp = `Thank you for deciding to purchase ${metadata.chosenItem} from us! Here is your payment link: ${metadata.links.shortLink}`;
            metadata.state = "await_confirmation";
            return { resp, metadata };
        } else {
            throw new Error('Product link not found');
        }
    }
    catch (error) {
        const linkId: string = uuidv4();
        const shortLink: string = `${URL_PREFIX}${linkId}`;
        let qrCode: string = '';

        QRCode.toDataURL(shortLink, async (err, url) => {
            if (err) {
                console.log("Could not generate QR code");
            } else {
                qrCode = url;
            }
        })
        await new Promise(resolve => setTimeout(resolve, 500));

        const productLink = new ProductLink(linkId, shortLink, qrCode, product);
        await em.fork({}).persistAndFlush(productLink);

        metadata.links = {
            shortLink: shortLink,
            qrCode: qrCode,
        };


        const resp = `<text>Thank you for deciding to purchase ${metadata.chosenItem} from us! Here is your payment link: ${metadata.links.shortLink} </text>`;
        metadata.state = "await_confirmation";
        return { resp, metadata };
    }

}

async function awaitConfirmation(conversation: any[], metadata: any) {
    const resp = `<text> Please we are awaiting confirmation of your payment. Provide evidence when done. </text>`;
    metadata.state = "check_confirmation";
    return { resp, metadata };
}

async function checkConfirmation(conversation: any[], metadata: any, em: EntityManager) {

    const resp = `<text>Your payment has been confirmed on our backend servers. We will now proceed to order fulfillment.
    The tracking link will be generated by the merchant in a period of 7 days if it is in stock. If not, you will be refunded. </text>`;
    metadata.state = "waiting_for_tracking";
    return { resp, metadata };
}

async function waitingForTracking(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `<text>The merchant has verified that he has your items in stock and has generated a tracking link for your order.</text>`;
    metadata.state = "awaiting_receive_order";
    return { resp, metadata };
}

async function awaitingReceiveOrder(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `<text>The item is on its way. Please notify us when it arrives. </text>`;
    metadata.state = "exit_survey";
    return { resp, metadata };
}

async function exitSurvey(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `<text>Thank you for shopping with oja mi. Please take this exit survey to rate your experience. Link: </text>`;
    metadata.state = "EXIT";
    return { resp, metadata };
}

async function handleFailure(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `<text>We sincerely apologize for the failure in payments. Please contact 08016182046 to get things sorted. </text>`;
    metadata.state = "EXIT";
    return { resp, metadata };
}


type StateFunction = (conversation: any[], metadata: any, em: EntityManager) => Promise<{ resp: any; metadata: any }>;

interface StateGraph {
    [key: string]: { func: StateFunction };
}

const stateGraph: StateGraph = {
    start: { func: generateStartResponse },
    filtering_loop: { func: generateFilterResponse },
    item_chosen: { func: handleItemChosen },
    await_confirmation: { func: awaitConfirmation },
    check_confirmation: { func: checkConfirmation },
    waiting_for_tracking: { func: waitingForTracking },
    awaiting_receive_order: { func: awaitingReceiveOrder },
    exit_survey: { func: exitSurvey },
    handle_failure: { func: handleFailure },
};

async function processCgpt(conversation: any[], metadata: { state: keyof StateGraph }, em: EntityManager) {

    //TODO: check undo or go back
    const stateFunc = stateGraph[metadata.state].func;
    let { resp, metadata: updatedMetadata } = await stateFunc(conversation, metadata, em);

    const parser = new XMLParser();
    const parsedResp = await parser.parse(resp);

    return { resp: `${parsedResp.text}.\n `, metadata: updatedMetadata };
}

router.post('/chat', async (req, res) => {
    const em = (req as RequestWithContext).em;
    const { conversation, metadata } = req.body;

    const resp = await processCgpt(conversation, metadata, em);

    res.json({ text: resp.resp, metadata: resp.metadata });
});

router.post('/init_chat', async (req, res) => {

    await generateEmbeddingsSync();

    return res.status(200).json({ message: 'Chat initialized successfully' });
});



async function runCLI() {

    await generateEmbeddingsSync();

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const em = orm.em.fork();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let conversation: any[] = [];
    let metadata = { state: "start", mode: "casual" };
    // let metadata = { state: "start", mode:"professional" };

    console.log("Welcome to the AI Chat CLI. Type 'exit' to quit.");

    while (true) {
        const { resp, metadata: updatedMetadata } = await processCgpt(conversation, metadata, em);
        conversation.push({ text: `AI: ${resp}` });
        console.log(resp, metadata);
        console.log("AI:", resp);

        const userInput = await new Promise<string>((resolve) => {
            rl.question("You: ", resolve);
        });

        if (userInput.toLowerCase() === 'exit') {
            break;
        }

        conversation.push({ text: `Customer: ${userInput}` });
        metadata = updatedMetadata;
    }

    rl.close();
    console.log("Thank you for using AI Chat CLI. Goodbye!");
}

// runCLI();


export default router;

