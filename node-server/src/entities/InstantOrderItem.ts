import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { Product } from "./Product";
import { InstantOrder } from "./InstantOrder";

@Entity()
export class InstantOrderItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => InstantOrder)
  order!: InstantOrder; 

  @ManyToOne(() => Product)
  product!: Product; 

  @Property()
  quantity: number; 

  constructor(order: InstantOrder, product: Product, quantity: number) {
    this.order = order;
    this.product = product;
    this.quantity = quantity;
  }
}