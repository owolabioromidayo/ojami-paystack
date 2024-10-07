import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";
import { BankTransferResponse } from "../types";

@Entity()
export class Transaction {

  @PrimaryKey()
  id!: number;

  @Property()
  _type!: 'bank_transfer' | 'virtual_transaction';

  @Property()
  currency!: string;

  @Property()
  amount!: number;

  @Property()
  amountPaid?: number;

  @Property()
  amountExpected!: number;

  @Property()
  fee!: number;

  @Property()
  vat!: number;

  @Property()
  reference!: string;

  @Property()
  paymentReference!: string;

  @Property()
  status!: 'pending' | 'processing' | 'completed' | 'failed';

  @Property()
  narration!: string;

  @Property()
  merchantBearsCost!: boolean;

  @Property()
  accountName!: string;

  @Property()
  accountNumber!: string;

  @Property()
  bankName!: string;

  @Property()
  bankCode!: string;

  @Property()
  expiryDateInUtc!: Date;

  @Property()
  customerName!: string;

  @Property()
  customerEmail!: string;

  @ManyToOne(() => User)
  sendingUser!: User;

  @ManyToOne(() => User)
  receivingUser?: User;

  constructor(response: BankTransferResponse, user: User) {
    const { data } = response;
    this.currency = data.currency;
    this.amount = data.amount;
    this.amountExpected = data.amount_expected;
    this.fee = data.fee;
    this.vat = data.vat;
    this.reference = data.reference;
    this.paymentReference = data.payment_reference;
    this.status = data.status as 'pending' | 'processing' | 'completed' | 'failed';
    this._type = 'bank_transfer';
    this.narration = data.narration;
    this.merchantBearsCost = data.merchant_bears_cost;

    this.accountName = data.bank_account.account_name;
    this.accountNumber = data.bank_account.account_number;
    this.bankName = data.bank_account.bank_name;
    this.bankCode = data.bank_account.bank_code;
    this.expiryDateInUtc = new Date(data.bank_account.expiry_date_in_utc);

    this.customerName = data.customer.name;
    this.customerEmail = data.customer.email;

    this.sendingUser = user;
  }
}
