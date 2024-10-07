
import express, { Request, Response } from "express";
import { GetQueryChargeResponse, RequestWithContext, TransactionStatus } from "../types";
import { Transaction } from "../entities/Transaction";

import { KORAPAY_TOKEN } from "../constants";
import { PayInTransaction } from "../entities/PayInTransaction";
import { User } from "../entities/User";

const router = express.Router();
const crypto = require('crypto');

const secretKey = process.env.KORAPAY_TOKEN;

router.post("/bank_transfer", paymentWebhookHandler);
router.post("/checkout", checkoutWebhookHandler);



async function paymentWebhookHandler(req: Request, res: Response) {

    const hash = crypto.createHmac('sha256', secretKey).update(JSON.stringify(req.body.data)).digest('hex');
    if (hash === req.headers['x-korapay-signature']) {

        const { event, data } = req.body;

        const em = (req as RequestWithContext).em;


        try {

            if (event === 'charge.success') {
                const { reference, currency, amount, fee, status } = data;


                if (status === "success") {
                    let transaction = await em.fork({}).findOneOrFail(Transaction, { id: reference });

                    //REQUERY TRANSACTION

                    const resp = await fetch(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${KORAPAY_TOKEN}`
                        },
                    });

                    if (!resp.ok) {
                        return res.status(500).json({ errors: [{ message: 'Could not verify transaction' }] });
                    }

                    const data = await resp.json() as GetQueryChargeResponse;


                    if (data.status !== true) {
                        return res.status(500).json({ errors: [{ message: 'Could not verify transaction' }] });
                    }

                    const amount_paid = Number(data.data.amount_paid);
                    const fee = Number(data.data.fee);
                    if (isNaN(amount_paid)) {
                        return res.status(500).json({ errors: [{ message: 'Could not verify transaction. Error in payload verification from payment provider. ' }] });
                    }

                    if (isNaN(fee)) {
                        return res.status(500).json({ errors: [{ message: 'Could not verify transaction. Error in payload verification from payment provider.' }] });
                    }


                    transaction.status = data.data.status as TransactionStatus;
                    transaction.amountPaid = amount_paid;
                    transaction.fee = fee;


                    //TODO: get user virtual account and update their balance with amount

                    await em.fork({}).persistAndFlush(transaction);
                    res.status(200).send('Webhook received successfully');


                } else {

                    //documentation does not explain this case
                    res.status(200).send('Webhook received successfully');

                }


            } else if (event === 'charge.failed') {

                const { reference, currency, amount, fee, status } = data;

                // if (status === "success") {
                let transaction = await em.fork({}).findOneOrFail(Transaction, { id: reference });

                transaction.status = TransactionStatus.FAILED;
                await em.fork({}).persistAndFlush(transaction);
                res.status(200).send('Webhook received successfully');


                // } else {
                //     //documentation does not explain this case
                //     res.status(200).send('Webhook received successfully');
                // }

            }
            else {
                res.status(200).send('Event type not handled');
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
            res.status(500).send('Error processing webhook');

        }
    }
}

async function checkoutWebhookHandler(req: Request, res: Response) {

    const hash = crypto.createHmac('sha256', secretKey).update(JSON.stringify(req.body.data)).digest('hex');
    if (hash === req.headers['x-korapay-signature']) {

        const { event, data } = req.body;

        const em = (req as RequestWithContext).em;


        try {

            if (event === 'charge.success') {
                const { reference, currency, amount, fee, status } = data;


                if (isNaN(Number(amount))) {
                    return res.status(400).json({ errors: [{ field: 'amount', message: 'Invalid amount' }] });
                }

                if (status === "success") {
                    let transaction = await em.fork({}).findOneOrFail(PayInTransaction, { id: reference }, { populate: ['user.virtualWallet.balance'] });
                    transaction.amount = Number(amount);  //already configured in earlier route
                    transaction.status = TransactionStatus.COMPLETED;

                    // get the uservs virtualWallet and update accordingly
                    transaction.user.virtualWallet.balance += Number(amount);


                    await em.fork({}).persistAndFlush([transaction, transaction.user.virtualWallet]);
                    res.status(200).send('Webhook received successfully');


                } else {
                    //documentation does not explain this case
                    res.status(200).send('Webhook received successfully');

                }


            } else if (event === 'charge.failed') {

                const { reference, currency, amount, fee, status } = data;
                let transaction = await em.fork({}).findOneOrFail(PayInTransaction, { id: reference });
                transaction.amount = amount;  //already configured in earlier route
                transaction.status = TransactionStatus.FAILED;


                res.status(200).send('Webhooked processed.');
            }
            else {
                res.status(200).send('Event type not handled');
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
            res.status(500).send('Error processing webhook');

        }
    }
}

export default router;