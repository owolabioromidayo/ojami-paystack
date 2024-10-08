import { Entity, PrimaryKey, Property, OneToOne, Collection, ManyToOne, OneToMany, ManyToMany, EntityManager, DecimalType } from "@mikro-orm/core";
import { User } from "./User";
import { VirtualTransaction } from "./VirtualTransaction";
import { PendingBalance } from "./PendingBalance";
import { Transaction } from "./Transaction";


@Entity()
export class VirtualWallet {

    @PrimaryKey()
    id!: number;

    @Property()
    createdAt = new Date();

    @Property({ type: DecimalType })
    balance: number = 0;


    @Property()
    currency!: string;

  @OneToMany(() => PendingBalance, pendingBalance => pendingBalance.receivingWallet)
  pendingBalances = new Collection<PendingBalance>(this);


    @OneToOne(() => User, user => user.virtualWallet)
    user!: User;

    @OneToMany(() => Transaction, transaction => transaction.virtualWallet)
    transactions = new Collection<Transaction>(this);

    @OneToMany(() => VirtualTransaction, transaction => transaction.sendingWallet)
    virtualTransactions = new Collection<VirtualTransaction>(this);


    constructor(user: User) {
        this.user = user;
        this.currency= "NGN";
    }
}