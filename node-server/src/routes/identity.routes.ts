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
    const { NIN, BVN } = req.body;

    const phoneNumber = Number(req.body.phoneNumber);

    if (isNaN(phoneNumber)) {
        return res.status(400).json({ errors: [{ field: 'phoneNumber', message: 'phoneNumber is not a number' }] });
    }

    if (!NIN && !BVN) {
        return res.status(400).json({ errors: [{ message: 'BVN or NIN required' }] });
    }

    if (NIN && isNaN(Number(NIN))) {
        return res.status(400).json({ errors: [{ field: 'NIN', message: 'NIN is not a number' }] });
    }

    if (BVN && isNaN(Number(BVN))) {
        return res.status(400).json({ errors: [{ field: 'BVN', message: 'BNN is not a number' }] });
    }


    const em = (req as RequestWithContext).em;

    try {
        const user = await em.fork({}).findOneOrFail(User, { id: req.session.userid });

        const kyc = new KYC(user, phoneNumber.toString());
        if (NIN) {
            kyc.NIN = NIN;
        }
        if (BVN) {
            kyc.BVN = BVN;
        }
        await em.fork({}).persistAndFlush(kyc);
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