import { Entity, PrimaryKey, Property, OneToOne, Cascade } from '@mikro-orm/core';
import { InstantOrder } from './InstantOrder';

@Entity()
export class InstantOrderLink{
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  linkId!: string;

  @Property({ type: 'text' })
  shortLink!: string;

  @Property({ type: 'text' })
  qrCode!: string;

  @OneToOne(() => InstantOrder, order => order.link, { cascade: [Cascade.PERSIST], owner: true })
  order!: InstantOrder;

  constructor(linkId:string, shortLink: string, qrCode: string, order: InstantOrder) {
    this.linkId = linkId;
    this.shortLink = shortLink;
    this.qrCode = qrCode;
    this.order = order;
  }
}