import { Entity, PrimaryKey, Property, OneToOne } from "@mikro-orm/core";

import { User } from "./User";

@Entity()
export class KYC {
    @PrimaryKey()
    id!: number;

    @OneToOne(() => User, user => user.KYC)
    user!: User;

    @Property({ unique: true })
    phoneNumber: string;

    @Property()
    NIN?: string; 

    @Property()
    BVN?: string; 

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    constructor(user: User, phoneNumber: string) {
        this.user = user;
        this.phoneNumber = phoneNumber;
    }
  
}