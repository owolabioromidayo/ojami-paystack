import { v4 } from "uuid"
export const __prod__ = process.env.NODE_ENV === 'production' ;
export const COOKIE_NAME = "redis_cookie";
export const FORGET_PASSWORD_PREFIX = 'forget-password: '
const token = v4();
export const HTML_LINK = `<a href="http://localhost:3000/change-password/${token}">reset password</a>`

export const ACCOUNT_NAME: string = process.env.ACCOUNT_NAME || "XXXXX";
export const ACCOUNT_REF: string = process.env.ACCOUNT_REF || "XXXXX";
export const KORAPAY_TOKEN: string = process.env.KORAPAY_API_TOKEN || "XXXXX";
export const BANK_TRANSFER_NOTIFICATION_URL: string = `${process.env.DOMAIN_URL}/api/webhooks/bank_transfer`;
export const CHECKOUT_NOTIFICATION_URL: string = `${process.env.DOMAIN_URL}/api/webhooks/checkout`;