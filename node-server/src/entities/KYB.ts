import { User } from "./User";

import { Entity, PrimaryKey, Property, OneToOne } from "@mikro-orm/core";

@Entity()
export class KYB {
    @PrimaryKey()
    id!: number;

    @OneToOne(() => User, user => user.KYB)
    user!: User;


    @Property()
    businessName: string;

    @Property()
    address: string;

    @Property()
    state: string;

    @Property()
    country: string;

    @Property()
    hasPhysicalStore: boolean;

    @Property()
    hasDeliveryMethod: boolean;

    @Property()
    usagePlan: string;

    @Property()
    businessCategory: string;

    @Property()
    RCNumber: string;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    constructor(
        user: User,
        businessName: string,
        address: string,
        state: string,
        country: string,
        hasPhysicalStore: boolean,
        hasDeliveryMethod: boolean,
        usagePlan: string,
        businessCategory: string,
        RCNumber: string
    ) {
        this.user = user;
        this.businessName = businessName;
        this.address = address;
        this.state = state;
        this.country = country;
        this.hasPhysicalStore = hasPhysicalStore;
        this.hasDeliveryMethod = hasDeliveryMethod;
        this.usagePlan = usagePlan;
        this.businessCategory = businessCategory;
        this.RCNumber = RCNumber;
    }
}