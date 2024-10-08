import { Entity, PrimaryKey, Property, OneToMany, Collection, OneToOne, ManyToOne, ManyToMany, EntityManager } from "@mikro-orm/core";
import { Storefront } from "./Storefront";
import { VirtualAccount } from "./VirtualAccount";
import { Transaction } from "./Transaction";
import { KYC } from "./KYC";
import { KYB } from "./KYB";
import { VirtualWallet } from "./VirtualWallet";
import { Cart } from "./Cart";


@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ length: 60 })
  firstname: string;

  @Property({ length: 60 })
  lastname: string;

  @Property()
  birthDate?: string;

  @Property()
  customer_id?: string;

  @Property()
  customer_code?: string;

  @Property({ unique: true })
  phoneNumber: string;

  @Property({ unique: true, length: 120 })
  email!: string;

  @Property({ hidden: true })
  passwordHash!: string;

  @Property()
  isDisabled = false;

  @Property()
  isValidated = false;
  @Property()
  profileImgUrl = "https://i.imgur.com/OQENGf1.jpeg";

  @OneToMany(() => Storefront, storefront => storefront.user)
  storefronts = new Collection<Storefront>(this);

  //TODO
  //   @Property({ type: 'json' })
  // customer!: {
  //   id: number;
  //   firstName?: string;
  //   lastName?: string;
  //   email: string;
  //   customerCode: string;
  //   phone?: string;
  //   metadata?: any;
  //   riskAction: string;
  //   internationalFormatPhone?: string;
  // };

  // @OneToMany(() => Cart, cart => cart.user)
  // cart = new Collection<Cart>(this);

  // @OneToOne(() => VirtualAccount, virtualAccount => virtualAccount.user, { owner: true })
  // virtualAccount?: VirtualAccount;

  @OneToOne(() => VirtualWallet, virtualWallet => virtualWallet.user, { owner: true })
  virtualWallet = new VirtualWallet(this);

  @OneToOne(() => KYC, kyc => kyc.user, { owner: true })
  KYC?: KYC;

  @OneToOne(() => KYB, kyb => kyb.user, { owner: true })
  KYB?: KYB;

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions = new Collection<Transaction>(this);


  constructor(firstname: string, lastname: string, phoneNumber: string, email: string, passwordHash: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.passwordHash = passwordHash;

    this.isValidated = false;
  }

}