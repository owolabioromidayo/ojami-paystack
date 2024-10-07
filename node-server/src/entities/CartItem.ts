import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { Product } from "./Product";
import { Cart } from "./Cart"; 

@Entity()
export class CartItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Cart)
  cart!: Cart; 

  @ManyToOne(() => Product)
  product!: Product; 

  @Property()
  quantity: number; 

  constructor(cart: Cart, product: Product, quantity: number) {
    this.cart = cart;
    this.product = product;
    this.quantity = quantity;
  }
}