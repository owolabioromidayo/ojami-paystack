
import { Entity, PrimaryKey, Property, OneToMany, Collection, ManyToOne, ManyToMany, OneToOne, EntityManager } from "@mikro-orm/core";

import { Storefront } from './Storefront';
import { InstantOrderItem } from "./InstantOrderItem";
import { InstantOrderLink } from "./InstantOrderLink";


@Entity()
export class InstantOrder {

    @PrimaryKey()
    id!: number;

    @OneToMany(() => InstantOrderItem, item => item.order)
    items = new Collection<InstantOrderItem>(this);

    @ManyToOne(() => Storefront)
    storefront!: Storefront;

    @OneToOne(() => InstantOrderLink, link => link.order)
    link?: InstantOrderLink 

    constructor(storefront: Storefront) {
        this.storefront = storefront;

    }
}