import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";
import { TransactionStatus } from "../types";

@Entity()
export class PayInTransaction {
  @PrimaryKey()
  id!: number;

  @Property()
  reference!: string;

  @Property()
  amount!: number;

  @Property()
  currency!: string;

  @Property()
  status!: 'pending' | 'processing' | 'completed' | 'failed';

  @Property()
  paymentMethod!: string;

  @Property()
  paymentProvider!: string;

  @Property()
  paymentProviderReference?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => User)
  user!: User;

  constructor(user: User, reference: string, amount: number, currency: string, status: TransactionStatus) {
    this.user = user;
    this.reference = reference;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
  }
}
