import { Entity, PrimaryKey, Property, OneToMany, Collection, ManyToOne, ManyToMany, EntityManager } from "@mikro-orm/core";
import { User } from "./User";
import { Product } from "./Product";
import { Tag } from "./Tag";

@Entity()
export class Storefront {
  @PrimaryKey()
  id!: number;

  @Property()
  storename!: string;

  @Property()
  profileImageUrl?: string;

  @Property()
  bannerImageUrl?: string;

  @Property()
  description!: string;

  @Property()
  ratings = []

  @ManyToOne(() => User)
  user!: User;

  @OneToMany(() => Product, product => product.storefront)
  products = new Collection<Product>(this);

  @Property()
  //TODO: need better bookkeeping than this
  salesCount: number = 0; // Track total sales

  @ManyToMany(() => Tag, tag => tag.storefronts)
  tags = new Collection<Tag>(this);


  constructor(user: User, storename: string, description: string, bannerImageUrl: string, profileImageUrl: string, tagNames: string[], em: EntityManager) {
    this.user = user;
    this.storename = storename;
    this.description = description;
    this.bannerImageUrl = bannerImageUrl;
    this.profileImageUrl = profileImageUrl;

    tagNames.forEach(async (tagName) => {
      let tag = await em.findOne(Tag, { name: tagName });

      if (!tag) {
        tag = new Tag(tagName);
        tag.name = tagName;
        await em.persistAndFlush(tag);
      }

      this.tags.add(tag);
    });
  }
}