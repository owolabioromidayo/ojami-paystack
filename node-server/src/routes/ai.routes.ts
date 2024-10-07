import express, { Request, Response } from "express";

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from "@langchain/core/output_parsers";

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
import { kMaxLength } from "buffer";

require("dotenv").config();

const URL_PREFIX = `${process.env.DOMAIN_URL}/p/`;

const router = express.Router();
const openaiKey = process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({ model: "gpt-3.5-turbo" });

let vectorstore: FaissStore;

fs.readFile(path.join(__dirname, 'catalogue.json'), 'utf-8', (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    FaissStore.fromTexts(
        jsonData.map((d: any) => JSON.stringify(d)),
        jsonData.map((_: any, i: number) => ({ id: i })),
        new OpenAIEmbeddings({ apiKey: openaiKey })
    ).then((store) => {
        vectorstore = store;
    }).catch((error) => {
        console.error('Error creating vectorstore:', error);
    });
});




const businessPrepPrompt = `You are a very helpful sales-rep and a shopping assistant on oja mi, a digital shopping platform for selling a range of items from several stores in Nigeria.`;

const SYSTEM_TEMPLATE = `STRONGLY ENSURE TO NOT STATE ANY PRICING OR AVAILABLE ITEM INFORMATION NOT PROVIDED TO YOU. Think logically. Reason step by step. Understand numbers and their relations. Always keep things from your the context in memory and reason accordingly. You work in a professional manner and work on sales and upselling and matching users with potential products they are likely to buy using ground truth and step by step reasoning. Follow this role as defined : ${businessPrepPrompt}`;

const START_PROMPT = "Introduce yourself";
// const FILTER_PROMPT = `Based on our previous conversation, the user is interested in our product catalog. Please provide relevant information about the products they're asking about. If they haven't specified a product, ask for more details about what they're looking for. Don't make assumptions about their selection unless they clearly state it.`;

const FILTER_PROMPT = `
You are a shopping assistant for Oja mi, a digital shopping platform for selling a range of items from several stores in Nigeria.
Respond to the user's question based on the provided context and product information. 
Do not mention prices unless specifically asked.  
DO NOT say items are unavailable when they are.
Do not waste the customers time, do what they want, dont suggest things they dont care about, urgency and pertinence are paramount.
Your coe objective is to speedily get the customer to choose an item, then move to the purchasing step.

`;




const SUMMARIZATION_TEMPLATE = new PromptTemplate({
    template: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language. Chat History: {chat_history} Follow Up Input: {question} Standalone question:`,
    inputVariables: ['chat_history', 'question']
});

function formatChatHistory(chatHistory: Array<{ text: string }>): string {
    return chatHistory.map(dialogueTurn => `Human: ${dialogueTurn.text}`).join('\n');
}

async function summarizeConversation(conversation: Array<{ text: string }>, user_q: string) {

    const summarizationTemplate = PromptTemplate.fromTemplate(
        "Summarize the following conversation:\n{chat_history}\n\nUser's question: {question}"
    );

    const chain = RunnableSequence.from([
        {
            chat_history: (input: any) => input.chat_history,
            question: (input: any) => input.question,
        },
        summarizationTemplate,
        new ChatOpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY }),
        new StringOutputParser(),
    ]);

    const result = await chain.invoke({
        chat_history: formatChatHistory(conversation),
        question: user_q,
    });

    return result;
}

async function queryCgpt(prompt: string, userQ: string) {
    const chatTemplate = {
        messages: [
            { role: "system", content: `${SYSTEM_TEMPLATE}\n${prompt}` },
            { role: "user", content: userQ }
        ]
    };
    const response = await llm.invoke(chatTemplate.messages);
    return response.content;
}

async function generateStartResponse(conversation: any[], metadata: any) {
    const resp = await queryCgpt(START_PROMPT, "");
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
             Conversation: ${conversation},
            ${conversation[conversation.length - 1].text}
            Relevant product information:
            ${metadata.recommendations.join('\n')}
        `;

        let resp = await queryCgpt(FILTER_PROMPT, context);

        console.log(context, resp);

        // Check if the response indicates a clear selection
        const hasUserSettled = await queryCgpt(`
            Based on the following context, has the user settled on an item they want to buy, have they asked to pay, or the AI is wasting time? We dont want to waste the user's time.
            Please answer with only 'yes' or 'no' for the question asked.
            Context:
${context}`, "");

        console.log(hasUserSettled);

        if (hasUserSettled.toString().toLowerCase().trim().startsWith('yes') || conversation[conversation.length - 1].text.toLowerCase().includes('skip')) {
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


        const resp = `Thank you for deciding to purchase ${metadata.chosenItem} from us! Here is your payment link: ${metadata.links.shortLink}`;
        metadata.state = "await_confirmation";
        return { resp, metadata };
    }

}

async function awaitConfirmation(conversation: any[], metadata: any) {
    const resp = "Please we are awaiting confirmation of your payment. Provide evidence when done.";
    metadata.state = "check_confirmation";
    return { resp, metadata };
}

async function checkConfirmation(conversation: any[], metadata: any, em: EntityManager) {

    const resp = `Your payment has been confirmed on our backend servers. We will now proceed to order fulfillment.
    The tracking link will be generated by the merchant in a period of 7 days if it is in stock. If not, you will be refunded.`;
    metadata.state = "waiting_for_tracking";
    return { resp, metadata };
}

async function waitingForTracking(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `The merchant has verified that he has your items in stock and has generated a tracking link for your order.
    Here it is: `;
    metadata.state = "awaiting_receive_order";
    return { resp, metadata };
}

async function awaitingReceiveOrder(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `The item is on its way. Please notify us when it arrives. `;
    metadata.state = "exit_survey";
    return { resp, metadata };
}

async function exitSurvey(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `Thank you for shopping with oja mi. Please take this exit survey to rate your experience. Link: `;
    metadata.state = "EXIT";
    return { resp, metadata };
}

async function handleFailure(conversation: any[], metadata: any, em: EntityManager) {
    const resp = `We sincerely apologize for the failure in payments. Please contact 08016182046 to get things sorted.`;
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
    const stateFunc = stateGraph[metadata.state].func;
    return await stateFunc(conversation, metadata, em);
}

router.post('/chat', async (req, res) => {
    const em = (req as RequestWithContext).em;
    const { conversation, metadata } = req.body;

    const resp = await processCgpt(conversation, metadata, em);

    res.json({ text: resp.resp, metadata: resp.metadata });
});



async function runCLI() {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const em = orm.em.fork();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let conversation: any[] = [];
    let metadata = { state: "start" };

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

