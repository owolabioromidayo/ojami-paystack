import { Entity, PrimaryKey, Property, OneToOne, Collection, ManyToOne, ManyToMany, EntityManager } from "@mikro-orm/core";
import { User } from "./User";
import { CreateVirtualAccountResponse } from "../types";


//TODO, not really doing this, just keep track of virtual trnasactions and balance

@Entity()
export class VirtualAccount {

  @PrimaryKey()
  id!: number;

  @Property()
  accountName!: string;

  @Property()
  accountNumber!: string;

  @Property()
  bankCode!: string;

  @Property()
  bankName!: string;

  @Property()
  accountReference!: string;

  @Property()
  uniqueId!: string;

  @Property()
  accountStatus!: string;

  @Property()
  createdAt!: Date;

  @Property()
  currency!: string;

  @Property()
  customerName!: string;

  // @OneToOne(() => User, user => user.virtualAccount)
  // user!: User;



  constructor(response: CreateVirtualAccountResponse, user: User) {
  const { data } = response;
  this.accountName = data.account_name;
  this.accountNumber = data.account_number;
  this.bankCode = data.bank_code;
  this.bankName = data.bank_name;
  this.accountReference = data.account_reference;
  this.uniqueId = data.unique_id;
  this.accountStatus = data.account_status;
  this.createdAt = new Date(data.created_at);
  this.currency = data.currency;
  this.customerName = data.customer.name;

  // this.user = user;

}
}