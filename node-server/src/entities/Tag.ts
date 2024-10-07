
import { Entity, PrimaryKey, Property, OneToMany, Collection, ManyToOne, ManyToMany } from "@mikro-orm/core";
import { Storefront } from "./Storefront";
import { Product } from "./Product";


@Entity()
export class Tag {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @ManyToMany(() => Product, product => product.tags, { owner: true })
  products = new Collection<Product>(this);


  @ManyToMany(() => Storefront, storefront => storefront.tags, { owner: true })
  storefronts = new Collection<Storefront>(this);

  constructor(name: string) {
    this.name = name;
  }
}

