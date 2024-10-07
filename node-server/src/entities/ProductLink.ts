import { Entity, PrimaryKey, Property, OneToOne, Cascade } from '@mikro-orm/core';
import { Product } from './Product'; 

@Entity()
export class ProductLink {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  linkId!: string;

  @Property({ type: 'text' })
  shortLink!: string;

  @Property({ type: 'text' })
  qrCode!: string;

  @OneToOne(() => Product, product => product.link, { cascade: [Cascade.PERSIST] })
  product!: Product;

  constructor(linkId:string, shortLink: string, qrCode: string, product: Product) {
    this.linkId = linkId;
    this.shortLink = shortLink;
    this.qrCode = qrCode;
    this.product = product;
  }
}