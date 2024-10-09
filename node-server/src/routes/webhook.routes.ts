
import express, { Request, Response } from "express";
import {  RequestWithContext } from "../types";
import { Transaction } from "../entities/Transaction";


import { User } from "../entities/User";

const router = express.Router();
const crypto = require('crypto');


router.post("/", paystackWebhookHandler);



async function paystackWebhookHandler(req: Request, res: Response) {

    const hash = crypto.createHmac('sha256', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body.data)).digest('hex');
    if (hash === req.headers['x-paystack-signature']) {

        const em = (req as RequestWithContext).em;
        const event = req.body.event;
        const data = req.body.data;

        try {
            switch (event) {
                case 'customeridentification.failed':
                    console.log('Customer identification failed:', data);
                    const failedUser = await em.fork({}).findOne(User, { email: data.email });
                    if (failedUser) {
                        failedUser.isValidated = false;
                        failedUser.identificationReason = data.reason;
                        await em.fork({}).persistAndFlush(failedUser);
                    }
                    break;

                case 'customeridentification.success':
                    const successUser = await em.fork({}).findOne(User, { email: data.email });
                    if (successUser) {
                        successUser.isValidated = true;
                        await em.fork({}).persistAndFlush(successUser);
                    }
                    break;


                // transfer == payout 
                case 'transfer.success':
                    const successTransaction = await em.fork({}).findOne(Transaction, { reference: data.reference }, { populate: ['user.virtualWallet'] });
                    if (successTransaction) {
                        successTransaction.status = 'success';
                        successTransaction.paidAt = new Date();
                        successTransaction.user.virtualWallet.balance -= (successTransaction.amount / 100);
                        await em.fork({}).persistAndFlush([successTransaction, successTransaction.user.virtualWallet]);
                    }
                    break;

                case 'transfer.failed':
                    const failedTransaction = await em.fork({}).findOne(Transaction, { reference: data.reference });
                    if (failedTransaction) {
                        failedTransaction.status = 'failed';
                        failedTransaction.failureReason = data.status;
                        await em.fork({}).persistAndFlush(failedTransaction);
                    }
                    break;


                // charge == payin
                case 'charge.success':
                    const { reference, amount, currency, customer, paid_at, channel } = data;
                    const chargeTransaction = await em.fork({}).findOne(Transaction, { id: reference }, { populate: ['user.virtualWallet'] });

                    if (chargeTransaction) {
                        chargeTransaction.amount = Number(amount) / 100; // Convert from kobo to Naira
                        chargeTransaction.status = 'success';
                        chargeTransaction.paidAt = new Date(paid_at);
                        chargeTransaction.channel = channel;
                        // Update user's virtual wallet
                        chargeTransaction.user.virtualWallet.balance += chargeTransaction.amount;

                        await em.fork({}).persistAndFlush([chargeTransaction, chargeTransaction.user.virtualWallet]);
                    }
                    break;

                default:
                    console.log('Unhandled event type:', event);
            }

            res.status(200).send('Webhook processed successfully');
        } catch (error) {
            console.error('Error processing webhook:', error);
            res.status(500).send('Error processing webhook');
        }
    }
}

router.post('/paystack', paystackWebhookHandler);




export default router;