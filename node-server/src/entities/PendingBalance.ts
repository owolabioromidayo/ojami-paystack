import { Entity, PrimaryKey, Property, OneToOne, Collection, ManyToOne, OneToMany, ManyToMany, EntityManager, DecimalType } from "@mikro-orm/core";
import { User } from "./User";
import { VirtualTransaction } from "./VirtualTransaction";
import { VirtualWallet } from "./VirtualWallet";
import { PendingBalanceStatus } from "../types";
import { Order } from "./Order";

const RESOLUTION_WAIT_TIME_MILLIS = 14 * 24 * 60 * 60 * 1000;

@Entity()
export class PendingBalance {


    @PrimaryKey()
    id!: number;

    @Property()
    createdAt!: Date;

    @Property()
    resolvesAt!: Date;

    @Property({ type: DecimalType })
    amount: number = 0;

    @Property()
    status!: 'pending' | 'completed' | 'failed';

    @Property()
    currency!: string;

    @ManyToOne(() => VirtualWallet)
    sendingWallet!: VirtualWallet;

    @ManyToOne(() => VirtualWallet)
    receivingWallet!: VirtualWallet;

    @ManyToOne(() => Order)
    order!: Order;

    constructor(sendingWallet: VirtualWallet, receivingWallet: VirtualWallet, amount: number, order: Order) {
        this.amount = amount;
        this.sendingWallet = sendingWallet;
        this.receivingWallet = receivingWallet;
        this.status = 'pending';
        this.createdAt = new Date();
        this.resolvesAt = new Date(this.createdAt.getTime() + RESOLUTION_WAIT_TIME_MILLIS);
        this.order = order;
    }


}