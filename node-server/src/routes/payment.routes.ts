import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import QRCode from "qrcode";

import {
  CreateVirtualAccountResponse,
  RequestWithContext,
  BankTransferResponse,
  PendingBalanceStatus,
  VirtualTransactionStatus,
  PayoutRequest,
  PayoutResponse,
  TransactionStatus,
} from "../types";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { isAuth } from "../middleware/isAuth";

// Use dynamic import
// (async () => {
//     const fetch = await import('node-fetch');
//     // Now you can use fetch as needed
// })();
// import { VirtualAccount } from "../entities/VirtualAccount";
import { Transaction } from "../entities/Transaction";
import {
  ACCOUNT_NAME,
  ACCOUNT_REF,
  BANK_TRANSFER_NOTIFICATION_URL,
  CHECKOUT_NOTIFICATION_URL,
  KORAPAY_TOKEN,
} from "../constants";
import { ProductLink } from "../entities/ProductLink";
import { VirtualTransaction } from "../entities/VirtualTransaction";
import { VirtualWallet } from "../entities/VirtualWallet";
import { PendingBalance } from "../entities/PendingBalance";
import { InstantOrder } from "../entities/InstantOrder";
import { InstantOrderItem } from "../entities/InstantOrderItem";
import { InstantOrderLink } from "../entities/InstantOrderLink";

import crypto from "crypto";
import { Voucher } from "../entities/Voucher";
import { VoucherStatus } from "../types";
import { PayInTransaction } from "../entities/PayInTransaction";
import { Order } from "../entities/Order";
import { VirtualAccount } from "../entities/VirtualAccount";

const router = express.Router();

const URL_PREFIX = `${process.env.DOMAIN_URL}/p/`;

const kora_token = process.env.KORAPAY_API_TOKEN
const paystack_token = process.env.PAYSTACK_API_TOKEN

// router.post("/virtual_accounts/new", isAuth, createNewVirtualBankAccount);

// router.post("/pay_in/bank_transfer", isAuth, receiveBankTransferFromCustomer);

// router.post("/pay_in/checkout_standard", isAuth, initializeCheckout);
// router.post("/pay_in/success", isAuth, completeCheckout);


router.post("/make_virtual_payment", isAuth, makeVirtualPayment);

router.post(
  "/generate_payment_link_from_product",
  isAuth,
  generatePaymentLinkFromProduct
);
router.post(
  "/generate_payment_link_from_instant_order",
  isAuth,
  generatePaymentLinkFromInstantOrder
);

router.get("/pending_balances/calculate", isAuth, calculatePendingBalance);
router.get("/pending_balances", isAuth, getPendingBalances);
router.post("/pending_balances/update", updatePendingBalances);

router.post("/vouchers/generate", isAuth, generateVoucher);
router.get("/vouchers/me", isAuth, fetchMyVouchers);
router.post("/vouchers/redeem", isAuth, redeemVoucher);



// router.post("/transaction/initialize", isAuth, initializeTransaction);
router.get("/transaction/verify/:reference", verifyTransaction);


//payout to bank account
router.post("/payout/initialize", isAuth, initializePayout);
router.post("/payout/finalize", isAuth, finalizePayout);

async function createNewVirtualBankAccount(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;

  try {
    const user = await em
      .fork({})
      .findOneOrFail(User, { id: req.session.userid });

    const payload = {
      permanent: true,
      bank_code: "044", //test
      account_name: ACCOUNT_NAME,
      account_reference: ACCOUNT_REF,
      customer: {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
      },
    };

    const resp = await fetch(
      "https://api.korapay.com/merchant/api/v1/virtual-bank-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KORAPAY_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      return res
        .status(500)
        .json({ errors: [{ message: "Could not create virtual card" }] });
    }

    const data = (await resp.json()) as CreateVirtualAccountResponse;
    if (data.status === true) {
      const newVirtualAccount = new VirtualAccount(data, user);
      await em.fork({}).persistAndFlush(newVirtualAccount);
      return res.status(201).json({ newVirtualAccount });
    } else {
      return res
        .status(500)
        .json({
          errors: [
            {
              status: "Virtual account create request failed",
              message: data.message,
            },
          ],
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({
        errors: [
          {
            status: "Virtual account create request failed",
            message: "None",
            error: err,
          },
        ],
      });
  }
}

async function makeVirtualPayment(req: Request, res: Response) {
  const { receivingUserId, orderId, isInstantPurchase, amount } = req.body;

  if (!(typeof isInstantPurchase === "boolean")) {
    return res
      .status(400)
      .json({
        errors: [
          {
            field: "isInstantPurchase",
            message: "isInstantPurchase is not boolean",
          },
        ],
      });
  }

  if (!amount || isNaN(Number(amount))) {
    return res
      .status(400)
      .json({
        errors: [{ field: "amount", message: "amount is not a number" }],
      });
  }

  if (!receivingUserId || isNaN(Number(receivingUserId))) {
    return res
      .status(401)
      .json({
        errors: [
          {
            field: "receivingUserId",
            message: "sendingUserId is not a number",
          },
        ],
      });
  }

  if (!orderId || isNaN(Number(orderId))) {
    return res
      .status(401)
      .json({
        errors: [{ field: "orderId", message: "orderId is not a number" }],
      });
  }

  const em = (req as RequestWithContext).em;

  try {
    //calculate amount from order
    // You were using InstantOrder even if isInstantPurchase is false so I've moved it inside the condition.
    // I added the amount back into the body and added a new order status: processing so that new orders won't mix with old or initiated orders

    const sendingUser = await em
      .fork({})
      .findOneOrFail(
        User,
        { id: req.session.userid },
        { populate: ["virtualWallet", "virtualWallet.balance"] }
      );
    const receivingUser = await em
      .fork({})
      .findOneOrFail(
        User,
        { id: Number(receivingUserId) },
        { populate: ["virtualWallet", "virtualWallet.balance"] }
      );

    if (sendingUser.virtualWallet.balance < amount) {
      return res
        .status(400)
        .json({
          errors: [{ message: "Insufficient balance for transaction" }],
        });
    }

    const virtualTransaction = new VirtualTransaction(
      sendingUser.virtualWallet,
      receivingUser.virtualWallet,
      amount,
      isInstantPurchase,
      "NGN"
    );

    //transfer money between wallets?
    let sendingUser_wallet = await em
      .fork({})
      .findOneOrFail(
        VirtualWallet,
        { id: sendingUser.virtualWallet.id },
        { populate: ["balance"] }
      );
    let receivingUser_wallet = await em
      .fork({})
      .findOneOrFail(
        VirtualWallet,
        { id: receivingUser.virtualWallet.id },
        { populate: ["balance"] }
      );

    if (isInstantPurchase) {
      //transfer the money immediately
      const amount = (
        await em
          .fork({})
          .findOneOrFail(
            InstantOrder,
            { id: req.session.userid },
            { populate: ["items", "items.product.price"] }
          )
      ).items
        .getItems()
        .reduce(
          (x: number, curr: InstantOrderItem) =>
            x + curr.product.price * curr.quantity,
          0
        );
      sendingUser_wallet.balance -= amount;
      virtualTransaction.status = VirtualTransactionStatus.COMPLETED;

      receivingUser_wallet.balance += amount;

      await em
        .fork({})
        .persistAndFlush([
          virtualTransaction,
          sendingUser_wallet,
          receivingUser_wallet,
        ]);
      return res.status(200).json({ virtualTransaction });
    }
    // delayed purchases
    // create a new pending balance (default time is 7 days)
    sendingUser_wallet.balance -= amount;
    const pendingBalance = new PendingBalance(
      sendingUser_wallet,
      receivingUser_wallet,
      amount
    );
    pendingBalance.currency = "NGN";
    virtualTransaction.status = VirtualTransactionStatus.PENDING;

    // set order to processing
    const order = await em
      .fork({})
      .findOne(Order, { id: orderId, fromUser: req.session.userid });
    if (order) {
      order.status = "processing";
      await em.fork({}).persistAndFlush(order);
    }

    await em
      .fork({})
      .persistAndFlush([
        pendingBalance,
        virtualTransaction,
        sendingUser_wallet,
        receivingUser_wallet,
      ]);
    return res.status(200).json({ sendingUser_wallet });
  } catch (err: any) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }
}

async function calculatePendingBalance(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;

  try {
    const user = await em
      .fork({})
      .findOneOrFail(
        User,
        { id: req.session.userid },
        { populate: ["virtualWallet.pendingBalances", "virtualWallet.balance"] }
      );
    const pendingBalances = user.virtualWallet.pendingBalances
      .getItems()
      .filter((x) => x.status === PendingBalanceStatus.PENDING);

    let _pendingBalance: number = pendingBalances.reduce(
      (x: number, curr: PendingBalance) => x + curr.amount,
      0
    );

    return res.status(200).json({ pendingBalance: _pendingBalance });
  } catch (err) {
    return res
      .status(500)
      .json({ errors: [{ message: `Could not retrieve pending balance.` }] });
  }
}

async function updatePendingBalances(req: Request, res: Response) {
  //go through all pending balances, if theyre past the resolution period, resolve them and update status

  const em = (req as RequestWithContext).em;

  try {
    let currDate = new Date();

    const pendingBalances = await em.fork({}).find(
      PendingBalance,
      {
        status: PendingBalanceStatus.PENDING,
        resolvesAt: { $lte: currDate },
      },
      { populate: ["receivingWallet"] }
    );

    for (let pendingBalance of pendingBalances) {
      pendingBalance.status = PendingBalanceStatus.COMPLETED;
      const receivingUser_wallet = await em
        .fork({})
        .findOneOrFail(VirtualWallet, {
          id: pendingBalance.receivingWallet.id,
        });
      receivingUser_wallet.balance += pendingBalance.amount;

      await em.fork({}).persistAndFlush([pendingBalance, receivingUser_wallet]);
    }

    return res
      .status(200)
      .json({ message: "Äll pending balances updated successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ errors: [{ message: `Could not update pending balances.` }] });
  }
}

async function getPendingBalances(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;

  try {
    const user = await em
      .fork({})
      .findOneOrFail(
        User,
        { id: req.session.userid },
        { populate: ["virtualWallet.pendingBalances"] }
      );
    const pendingBalances = user.virtualWallet.pendingBalances.getItems();
    return res.status(200).json({ pendingBalances: pendingBalances });
  } catch (err) {
    return res
      .status(500)
      .json({ errors: [{ message: `Could not retrieve pending balances.` }] });
  }
}

async function generatePaymentLinkFromProduct(req: Request, res: Response) {
  //right now its just product link

  const { productId } = req.body;

  if (!productId || isNaN(Number(productId))) {
    return res
      .status(400)
      .json({
        errors: [{ field: "productId", message: "productId is not a number" }],
      });
  }

  const em = (req as RequestWithContext).em;

  try {
    const product = await em
      .fork({})
      .findOneOrFail(
        Product,
        { id: Number(productId) },
        { populate: ["link.shortLink", "link.qrCode"] }
      );

    if (product.link) {
      //already exists, return
      return res
        .status(201)
        .json({
          shortLink: product.link.shortLink,
          qrCode: product.link.qrCode,
        });
    }

    //generate new link and QR code

    const linkId: string = uuidv4();
    const shortLink: string = `${URL_PREFIX}${linkId}`;

    QRCode.toDataURL(shortLink, async (err, url) => {
      if (err) {
        return res
          .status(500)
          .json({ errors: [{ message: "Could not generate QR code." }] });
      } else {
        const qrCode = url;
        const productLink = new ProductLink(linkId, shortLink, qrCode, product);
        await em.fork({}).persistAndFlush(productLink);
        return res.status(201).json({ shortLink, qrCode });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        errors: [{ message: `Could not fetch product with ID ${productId}.` }],
      });
  }
}

async function generatePaymentLinkFromInstantOrder(
  req: Request,
  res: Response
) {
  //right now its just product link

  const { instantOrderId } = req.body;

  if (!instantOrderId || isNaN(Number(instantOrderId))) {
    return res
      .status(400)
      .json({
        errors: [
          { field: "instantOrderid", message: "instantOrderId is not valid" },
        ],
      });
  }

  const em = (req as RequestWithContext).em;

  try {
    const order = await em
      .fork({})
      .findOneOrFail(
        InstantOrder,
        { id: Number(instantOrderId) },
        { populate: ["link.shortLink", "link.qrCode"] }
      );

    if (order.link) {
      //already exists, return
      return res
        .status(201)
        .json({ shortLink: order.link.shortLink, qrCode: order.link.qrCode });
    }

    //generate new link and QR code

    const linkId: string = uuidv4();
    const shortLink: string = `${URL_PREFIX}${linkId}`;

    QRCode.toDataURL(shortLink, async (err, url) => {
      if (err) {
        return res
          .status(500)
          .json({ errors: [{ message: "Could not generate QR code." }] });
      } else {
        const qrCode = url;
        const orderLink = new InstantOrderLink(
          linkId,
          shortLink,
          qrCode,
          order
        );
        await em.fork({}).persistAndFlush(orderLink);
        return res.status(201).json({ shortLink, qrCode });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        errors: [
          { message: `Could not fetch product with ID ${instantOrderId}.` },
        ],
      });
  }
}

async function generateVoucher(req: Request, res: Response) {
  const { amount, currency } = req.body;

  if (!amount || isNaN(Number(amount))) {
    return res
      .status(400)
      .json({ errors: [{ field: "amount", message: "Amount is not valid" }] });
  }

  if (!currency || typeof currency !== "string") {
    return res
      .status(400)
      .json({
        errors: [{ field: "currency", message: "Currency is not valid" }],
      });
  }

  const em = (req as RequestWithContext).em;

  try {
    const user = await em
      .fork({})
      .findOneOrFail(
        User,
        { id: req.session.userid },
        { populate: ["virtualWallet"] }
      );

    if(Number(amount) > 10000){
        return res.status(400).json({
            errors: [{ message: "Amount is too large, maximum is 10,000"}]
        })
    }else if(Number(amount) < 100){
        return res.status(400).json({
            errors: [{ message: "Amount is too small, minimum is 100"}]
        })
    }

    if (user.virtualWallet.balance < Number(amount)) {
      return res
        .status(400)
        .json({
          errors: [{ message: "Insufficient balance to create voucher" }],
        });
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const voucherId = crypto.randomBytes(16).toString("hex");

    const data = `${voucherId}:${amount}:${currency}`;
    const signature = crypto.sign("sha256", Buffer.from(data), privateKey);

    const voucher = new Voucher(
      user,
      Number(amount),
      currency,
      voucherId,
      publicKey,
      signature.toString("hex")
    );

    user.virtualWallet.balance -= Number(amount);

    await em.fork({}).persistAndFlush([voucher, user.virtualWallet]);

    return res.status(201).json({
      message: "Voucher generated successfully",
      voucherId: voucherId,
      amount: amount,
      currency: currency,
      publicKey: voucher.publicKey,
      signature: voucher.signature,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({
        errors: [{ message: "Failed to generate voucher", error: err.message }],
      });
  }
}

async function fetchMyVouchers(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;

  try {
    const vouchers = await em
      .fork({})
      .find(Voucher, { owner: Number(req.session.userid), status: VoucherStatus.VALID });

    return res.status(200).json({ vouchers });
  } catch (err: any) {
    return res
      .status(500)
      .json({
        errors: [
          {
            field: "vouchers",
            message: "Could not fetch vouchers for this user",
            error: err.message,
          },
        ],
      });
  }
}

async function redeemVoucher(req: Request, res: Response) {
  const { voucherId } = req.body;

  if (!voucherId || typeof voucherId !== "string") {
    return res
      .status(400)
      .json({
        errors: [{ field: "voucherId", message: "Voucher ID is not valid" }],
      });
  }

  const em = (req as RequestWithContext).em;

  try {
    const voucher = await em
      .fork({})
      .findOneOrFail(Voucher, { voucherId: voucherId });

    if (voucher.status !== VoucherStatus.VALID) {
      return res
        .status(400)
        .json({ errors: [{ message: "Voucher is not valid" }] });
    }

    const redeemer = await em
      .fork({})
      .findOneOrFail(
        User,
        { id: req.session.userid },
        { populate: ["virtualWallet"] }
      );

    const data = `${voucherId}:${voucher.amount}:${voucher.currency}`;
    const isValid = crypto.verify(
      "sha256",
      Buffer.from(data),
      voucher.publicKey,
      Buffer.from(voucher.signature, "base64")
    );

    if (!isValid) {
      return res
        .status(400)
        .json({ errors: [{ message: "Voucher verification failed" }] });
    }

    voucher.status = VoucherStatus.REDEEMED;
    voucher.redeemer = redeemer;

    redeemer.virtualWallet.balance += voucher.amount;

    await em.fork({}).persistAndFlush([voucher, redeemer.virtualWallet]);

    return res.status(200).json({
      message: "Voucher redeemed successfully",
      amount: voucher.amount,
      currency: voucher.currency,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ errors: [{ message: "Failed to redeem voucher" }] });
  }
}

async function initializePayout(req: Request, res: Response) {
  const { amount } = req.body;

  if (!amount || isNaN(Number(amount))) {
    return res
      .status(400)
      .json({ errors: [{ field: "amount", message: "Amount is not valid" }] });
  }

  const em = (req as RequestWithContext).em;

  try {
    const user = await em.fork({}).findOneOrFail(
      User,
      { id: req.session.userid },
      { populate: ["virtualWallet"] }
    );

    if (user.virtualWallet.balance < amount) {
      return res.status(400).json({ errors: [{ message: "Insufficient balance" }] });
    }

    const payload: PayoutRequest = {
      source: "balance",
      currency: "NGN",
      amount: amount,
      recipient: "TODO",
    };

    const resp = await fetch(
      "https://api.paystack.co/transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paystack_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      return res.status(500).json({ errors: [{ message: "Payout request failed", details: errorData }] });
    }

    const data = (await resp.json()) as PayoutResponse;

    if (data.status === true) {
      const transaction = new Transaction(user, user.virtualWallet, {
        status: "pending",
        amount: amount,
        created_at: data.data.createdAt, 
        currency: "NGN",
        reference: data.data.transfer_code,
        
      }, "payout");

      await em.fork({}).persistAndFlush(transaction);

      return res.status(200).json({
        message: "Payout initiated",
        data: data.data,
      });
    } else {
      return res.status(500).json({ errors: [{ message: data.message }] });
    }
  } catch (err: any) {
    console.error("Error processing payout:", err);
    return res.status(500).json({ errors: [{ message: "Failed to process payout", error: err.message }] });
  }
}

async function finalizePayout(req: Request, res: Response) {
  const { transfer_code, otp } = req.body;

  if (!transfer_code || !otp) {
    return res.status(400).json({ 
      errors: [{ message: "Transfer code and OTP are required" }] 
    });
  }

  const em = (req as RequestWithContext).em;

  try {
    const payload = {
      transfer_code,
      otp
    };

    const resp = await fetch(
      "https://api.paystack.co/transfer/finalize_transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paystack_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      return res.status(500).json({ 
        errors: [{ message: "Failed to finalize transfer", details: errorData }] 
      });
    }

    const data = await resp.json();

    if (data.status === true && data.data.status === "success") {
      // const user = await em.fork({}).findOneOrFail(
      //   User,
      //   { id: req.session.userid },
      //   { populate: ["virtualWallet"] }
      // );

      const transaction = await em.fork({}).findOneOrFail(
        Transaction,
        { reference: transfer_code }, {populate: ['user', 'virtualWallet']}

      );
      if (transaction.status === "pending"){
        transaction.status = "success";
        transaction.paidAt = new Date();

        transaction.virtualWallet.balance -= data.data.amount / 100; // Convert from kobo to Naira
        await em.fork({}).persistAndFlush([transaction.virtualWallet, transaction]);
      }

      return res.status(200).json({
        message: "Transfer has been queued",
        data: data.data,
      });
    } else {
      const transaction = await em.fork({}).findOneOrFail(
        Transaction,
        { reference: data.data.reference }
      );

      transaction.status = "failed";
      await em.fork({}).persistAndFlush(transaction);

      return res.status(500).json({ errors: [{ message: data.message }] });
    }
  } catch (err: any) {
    console.error("Error finalizing transfer:", err);
    return res.status(500).json({ 
      errors: [{ message: "Failed to finalize transfer", error: err.message }] 
    });
  }
}

// async function initializeTransaction(req: Request, res: Response) {
//   const em = (req as RequestWithContext).em;
//   const { amount, orderId } = req.body;

//   if (!amount || isNaN(Number(amount))) {
//     return res.status(400).json({ errors: [{ field: "amount", message: "Invalid amount" }] });
//   }



//   try {
//     const user = await em.fork({}).findOneOrFail(User, { id: req.session.userid });
//     const order = await em.fork({}).findOneOrFail(Order, { id: Number(orderId) });

//     const payload = {
//       amount: Math.round(Number(amount) * 100), // Convert to kobo
//       email: user.email,
//       reference: uuidv4(),
//       callback_url: `${process.env.DOMAIN_URL}/payment/verify/${orderId}`,
//     };

//     const resp = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${paystack_token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     if (!resp.ok) {
//       const errorData = await resp.json().catch(() => ({}));
//       return res.status(500).json({ 
//         errors: [{ message: "Failed to initialize transaction", details: errorData }] 
//       });
//     }

//     const data = await resp.json();

//     if (data.status) {
//       order.paymentReference = payload.reference;
//       await em.fork({}).persistAndFlush(order);

//       return res.status(200).json({
//         message: "Transaction initialized",
//         data: data.data,
//       });
//     } else {
//       return res.status(500).json({ errors: [{ message: data.message }] });
//     }
//   } catch (err: any) {
//     console.error("Error initializing transaction:", err);
//     return res.status(500).json({ 
//       errors: [{ message: "Failed to initialize transaction", error: err.message }] 
//     });
//   }
// }

async function verifyTransaction(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;
  const { reference } = req.params;

  try {
    const resp = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystack_token}`,
        },
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      return res.status(500).json({ 
        errors: [{ message: "Failed to verify transaction", details: errorData }] 
      });
    }

    const data = await resp.json();

    if (data.status && data.message === "Verification successful") {
      const transaction = await em.fork({}).findOneOrFail(Transaction, { reference }, { populate: ["user", "virtualWallet"] });
      if (transaction.status === "pending") { 
        transaction.status = "success";
        transaction.virtualWallet.balance += transaction.amount;
        await em.fork({}).persistAndFlush([transaction, transaction.virtualWallet] );
      }
      

      return res.status(200).json({
        message: "Transaction verified successfully",
        data: data.data,
      });
    } else {
      return res.status(400).json({ errors: [{ message: "Transaction verification failed" }] });
    }
  } catch (err: any) {
    console.error("Error verifying transaction:", err);
    return res.status(500).json({ 
      errors: [{ message: "Failed to verify transaction", error: err.message }] 
    });
  }
}





async function completeCheckout(req: Request, res: Response) {

    const id  = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ errors: [{ field: 'id', message: 'Invalid ID' }] });
    }
    

    const em = (req as RequestWithContext).em;

    try {
        const order = await em.fork({}).findOneOrFail(Order, { id: Number(id) }, { populate: ["product", "storefront"]});


        if (order.fromUser.id !== id || order.toUser.id !== id ) {
            return res.status(401).json({ errors: [{ field: 'auth', message: 'Not authorized' }] });
        }

        order.status = "processing"
        await em.fork({}).persistAndFlush(order)

        return res.status(200).json({ order });
    } catch (err) {
        return res.status(404).json({ errors: [{ field: 'order', message: 'Order not found' }] });
    }
}

async function initializeCheckout(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;
  const { amount, currency, orderId } = req.body;

  if (isNaN(Number(amount))) {
    return res
      .status(400)
      .json({ errors: [{ field: "amount", message: "Invalid amount" }] });
  }

  try {
    const user = await em
      .fork({})
      .findOneOrFail(User, { id: req.session.userid });
    const reference = uuidv4();

    // Create a new PayInTransaction
    const transaction = new PayInTransaction(
      user,
      reference,
      Number(amount),
      currency,
      TransactionStatus.PENDING
    );
    transaction.paymentMethod = "pay with kora";
    transaction.paymentProvider = "korapay";
    await em.fork({}).persistAndFlush(transaction);

    // set order to processing
    const order = await em
      .fork({})
      .findOne(Order, { id: orderId, fromUser: req.session.userid });
    if (order) {
      order.status = "processing";
      await em.fork({}).persistAndFlush(order);
    }

    // Prepare the checkout information for the frontend
    const checkoutInfo = {
      key: process.env.KORAPAY_PUBLIC_KEY,
      reference,
      amount: Number(amount),
      currency,
      customer: {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
      },
      notification_url: CHECKOUT_NOTIFICATION_URL,
    };

    return res.status(200).json({
      message: "Checkout initialized successfully",
      data: checkoutInfo,
    });
  } catch (err: any) {
    console.error("Error initializing checkout:", err);
    return res
      .status(500)
      .json({
        errors: [
          { message: "Failed to initialize checkout", error: err.message },
        ],
      });
  }
}

export default router;
