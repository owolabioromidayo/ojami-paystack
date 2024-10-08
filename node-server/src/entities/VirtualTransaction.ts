import { Entity, PrimaryKey, Property, ManyToOne, DecimalType } from "@mikro-orm/core";
import { VirtualWallet } from "./VirtualWallet";

//TODO: transaction type, from and to


@Entity()
export class VirtualTransaction {

  @PrimaryKey()
  id!: number;

  @Property()
  _type!: 'bank_transfer' | 'virtual_transaction';

  @Property()
  currency!: string;

  @Property({ type: DecimalType })
  amount!: number;

  @Property()
  status!: 'pending' | 'processing' | 'completed' | 'failed';

  @Property()
  createdAt = new Date();

  @Property()
  isInstantPurchase!: boolean;

  //  @Property()
  // narration!: string;

  @ManyToOne(() => VirtualWallet)
  sendingWallet!: VirtualWallet;

  @ManyToOne(() => VirtualWallet)
  receivingWallet?: VirtualWallet;

  constructor(sendingWallet: VirtualWallet, receivingWallet: VirtualWallet, amount: number, isInstantPurchase: boolean, currency: string) {
    this._type = 'virtual_transaction';
    this.amount = amount;
    this.sendingWallet = sendingWallet;
    this.receivingWallet = receivingWallet;
    this.isInstantPurchase = isInstantPurchase;
    this.currency = currency;
  }
}
