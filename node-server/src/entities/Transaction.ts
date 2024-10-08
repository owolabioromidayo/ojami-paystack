import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";
import { VirtualWallet } from "./VirtualWallet";

@Entity()
export class Transaction {
  @PrimaryKey()
  id!: number;

  @Property()
  type!: "payin" | "payout";

  @Property()
  status!: "pending" | "success" | "failed";

  @Property()
  reference?: string;

  //TODO: store in decimals?
  @Property()
  amount!: number;

  @Property()
  paidAt?: Date;

  @Property()
  createdAt!: Date;

  @Property()
  channel?: string;

  @Property()
  currency!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => VirtualWallet)
  virtualWallet!: VirtualWallet;


  constructor(user: User, virtualWallet: VirtualWallet, data: any, type: "payin" | "payout") {
    this.status = data.status;
    if (data.reference){
      this.reference = data.reference;
    }
    this.amount = data.amount;
    if (data.paid_at){
      this.paidAt = new Date(data.paid_at);
    }
    this.createdAt = new Date(data.created_at);
    if (data.channel){
      this.channel = data.channel;
    }
    this.currency = data.currency;
    this.user = user;
    this.virtualWallet = virtualWallet;
    this.type = type; 
  }
}
