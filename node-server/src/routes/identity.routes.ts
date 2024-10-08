import express, { Request, Response } from "express";

import { RequestWithContext } from "../types";
import { User } from "../entities/User";
import { KYC } from "../entities/KYC";
import { KYB } from "../entities/KYB";
import { isAuth } from "../middleware/isAuth";


const router = express.Router();

router.post("/kyc", isAuth, submitKYC);
router.post("/kyb", isAuth, submitKYB);

async function submitKYC(req: Request, res: Response) {
    const { accountNumber, bankCode, BVN } = req.body;


    if (!accountNumber) {
        return res.status(400).json({ errors: [{ field: 'accountNumber', message: 'Account number is required' }] });
    }

    if (!bankCode ) {
        return res.status(400).json({ errors: [{ field: 'bankCode', message: 'Bank code is required' }] });
    }

    if (BVN && isNaN(Number(BVN))) {
        return res.status(400).json({ errors: [{ field: 'BVN', message: 'BNN is not a number' }] });
    }


    const em = (req as RequestWithContext).em;

    try {
        const user = await em.fork({}).findOneOrFail(User, { id: req.session.userid });

        if (!user.customer_code) {
            return res.status(400).json({ errors: [{ message: 'Customer code not found' }] });
        }


        const validationPayload = {
            country: "NG",
            type: "bank_account",
            account_number: accountNumber,
            bvn: BVN,
            bank_code: bankCode,
            first_name: user.firstname,
            last_name: user.lastname
        };

        try {
            const resp = await fetch(`https://api.paystack.co/customer/${user.customer_code}/identification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                },
                body: JSON.stringify(validationPayload)
            });

            if (!resp.ok) {
                throw new Error("Failed to validate customer with Paystack");
            }

            const data = await resp.json();

            if (!data.status) {
                throw new Error("Paystack customer validation failed");
            }

            console.log("Customer validation initiated successfully");
        } catch (error) {
            console.error("Error validating customer with Paystack:", error);
            return res.status(500).json({ errors: [{ message: "Could not validate customer with payment provider." }] });
        }



        // const kyc = new KYC(user, phoneNumber.toString());
        // if (NIN) {
        //     kyc.NIN = NIN;
        // }
        // if (BVN) {
        //     kyc.BVN = BVN;
        // }
        // await em.fork({}).persistAndFlush(kyc);
        return res.status(201).json({ message: "KYC submitted successfully." });

    } catch (err) {
        return res.status(500).json({ errors: [{ message: "Could not submit KYC." }] });
    }
}

async function submitKYB(req: Request, res: Response) {
    const { businessName, address, state, country, hasPhysicalStore, hasDeliveryMethod, usagePlan, businessCategory, RCNumber } = req.body;

    if (!businessName || !address || !state || !country || !usagePlan || !businessCategory || !RCNumber) {
        return res.status(400).json({ errors: [{ message: "All fields except physical store and delivery method are required." }] });
    }

    const em = (req as RequestWithContext).em;

    try {
        const user = await em.fork({}).findOneOrFail(User, { id: req.session.userid });
        const kyb = new KYB(user, businessName, address, state, country, hasPhysicalStore || false, hasDeliveryMethod || false, usagePlan, businessCategory, RCNumber);
        await em.fork({}).persistAndFlush(kyb);
        return res.status(201).json({ message: "KYB submitted successfully." });
    } catch (err) {
        return res.status(500).json({ errors: [{ message: "Could not submit KYB." }] });
    }
}


export default router;