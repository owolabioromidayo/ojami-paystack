import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from "@mikro-orm/core";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart)
    items = new Collection<CartItem>(this);

    @Property({ default: 0 })
    totalPrice: number = 0;

    constructor(user: User) {
        this.user = user;
    }

}