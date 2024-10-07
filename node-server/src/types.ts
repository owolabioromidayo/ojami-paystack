import { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { EntityManager } from '@mikro-orm/core';

export interface RequestWithContext extends Request {
    redis: Redis;
    em: EntityManager;
}

export interface CreateVirtualAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_name: string;
    account_number: string;
    bank_code: string;
    bank_name: string;
    account_reference: string;
    unique_id: string;
    account_status: string;
    created_at: string;
    currency: string;
    customer: {
      name: string;
    };
  };
}


export interface BankTransferResponse {
  status: boolean;
  message: string;
  data: {
    currency: string;
    amount: number;
    amount_expected: number;
    fee: number;
    vat: number;
    reference: string;
    payment_reference: string;
    status: string;
    narration: string;
    merchant_bears_cost: boolean;
    bank_account: {
      account_name: string;
      account_number: string;
      bank_name: string;
      bank_code: string;
      expiry_date_in_utc: string;
    };
    customer: {
      name: string;
      email: string;
    };
  };
}

//TODO: find out transaction status types
export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
//TODO: alter this
export enum VirtualTransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PendingBalanceStatus{
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum VoucherStatus{
  REDEEMED = 'redeemed',
  VALID = 'valid',
}

export enum TransactionType{
  BANK_TRANSFER = 'bank_transfer',
  VIRTUAL_TRANSACTION = 'virtual_transaction',
 //virtual bank account to virtual bank account
}


export interface GetQueryChargeResponse {
    status: boolean;
    message: string;
    data: {
        reference: string;
        status: string;
        amount: number;
        amount_paid: string;
        fee: string;
        currency: string;
        description: string;
        // TODO: I dont think we need to store this
        payer_bank_account: {
            account_number: string;
            account_name: string;
            bank_name: string;
        };
    };
}    


export interface PayoutDestination {
    type: 'bank_account' | 'mobile_money';
    amount: number;
    currency: string;
    narration?: string;
    bank_account?: {
        bank: string;
        account: string;
        account_name?: string;
    };
    mobile_money?: {
        operator: string;
        mobile_number: string;
    };
    customer: {
        name?: string;
        email: string;
    };
}

export interface PayoutRequest {
    reference: string;
    destination: PayoutDestination;
    metadata?: Record<string, any>;
}

export interface PayoutResponse {
    status: boolean;
    message: string;
    data: {
        reference: string;
        status: string;
        amount: number;
        fee: number;
        currency: string;
        narration: string;
        customer: {
            name: string;
            email: string;
        };
        destination: {
            type: string;
            bank_account?: {
                bank: string;
                account: string;
            };
            mobile_money?: {
                operator: string;
                mobile_number: string;
            };
        };
        transaction_date: string;
        transaction_reference: string;
    };
}