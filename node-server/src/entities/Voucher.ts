import { Entity, PrimaryKey, Property, ManyToOne, DecimalType, OneToOne } from "@mikro-orm/core";
import { User } from "./User";
import { VoucherStatus } from "../types";


@Entity()
export class Voucher {

  @PrimaryKey()
  id!: number;

  @Property()
  voucherId!: string;

  @Property()
  currency!: string;

  @Property({ type: DecimalType })
  amount!: number;

  @Property()
  status!: 'valid' | 'redeemed';

  @Property()
  createdAt = new Date();

  @ManyToOne(() => User)
  owner!: User;

  @ManyToOne(() => User, { nullable: true })
  redeemer?: User;

  @Property({ length: 10485760 })
  publicKey!: string;

  @Property({ length: 10485760 })
  signature!: string;

  constructor(owner: User, amount: number, currency: string, voucherId: string, publicKey: string, signature: string) {
    this.status = 'valid';
    this.amount = amount;
    this.currency = currency;
    this.owner = owner;
    this.voucherId = voucherId;
    this.publicKey = publicKey;
    this.signature = signature;
  }
}
