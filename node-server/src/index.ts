import express, { Request, Response } from "express";
import session from 'express-session';
import helmet from 'helmet';
import RedisStore from "connect-redis";
import Redis from "ioredis";

import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";


import contextMiddleware from './middleware/contextMiddleware';
import { __prod__ } from "./constants";

require("dotenv").config();

import authRoutes from './routes/auth.routes';
import identityRoutes from './routes/identity.routes';
import paymentRoutes from './routes/payment.routes';
import ecommerceRoutes from './routes/ecommerce.routes';
import aiRoutes from './routes/ai.routes';
import webhookRoutes from './routes/webhook.routes';
import { isAuth } from './middleware/isAuth';
import { ProductLink } from "./entities/ProductLink";
import { RequestWithContext } from "./types";

import fs from 'fs';
import path from 'path';
import { User } from './entities/User';
import { Storefront } from './entities/Storefront';
import { Product } from './entities/Product';
import { EntityManager } from '@mikro-orm/core';
import { Tag } from "./entities/Tag";

console.log(process.env.NODE_ENV);

var cors = require('cors');



declare module 'express-session' {
  export interface SessionData {
    loadedCount: number;
    userid: number;
  }
} ``

async function resolvePaymentLink(req: Request, res: Response) {
  const em = (req as RequestWithContext).em;

  const productLink = await em.fork({}).findOneOrFail(ProductLink, { linkId: req.params.id }, { populate: ["product.id"] });

  res.redirect(`/api/ecommerce/products/${productLink.product.id}`);
}


// async function initAppData(em: EntityManager) {
//   const cataloguePath = path.join(__dirname, 'routes', 'catalogue.json');
//   const catalogueData = JSON.parse(fs.readFileSync(cataloguePath, 'utf-8'));

//   const user = new User('Gateway', 'Technologies', '09100000000', 'info@gateway.tech', 'password');

//   // Check if the tag already exists
//   let techTag = await em.findOne(Tag, { name: "tech" });
//   if (!techTag) {
//     techTag = new Tag("tech");
//     em.persist(techTag);
//   }

//   const storefront = new Storefront(user, 'Gateway Technologies', 'Technology Products', "", "", [], em);
  
//   storefront.tags.add(techTag);
  
//   em.persist(user);
//   em.persist(storefront);
//   await em.flush();
  
//   for (let i = 0; i < Math.min(catalogueData.length, 1500); i++) {
//     try {
//       const item = catalogueData[i];
//       console.log(item.description);
//       const price: number = typeof item.prices === 'string' ? parseFloat(item.prices.replace(/,/g, '')) : item.prices;
//       const product = new Product(storefront, item.name || "null", price || 0, [item.displayUrl] as string[], item.description as string || "null", 100);

//       product.tags.add(techTag);
//       em.persist(product);
//     } catch (error) {
//       console.error(`Failed to create product at index ${i}:`, error);
//     }
//   }
  
//   await em.flush();
  
//   console.log('App data initialized successfully');
// }


export const createApp = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const em = orm.em.fork();

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  const redisStore = new RedisStore({
    client: redis,
    prefix: "korahack-server: "
  });

  const app = express();

  app.use(contextMiddleware(redis, em));

  app.set("trust proxy", 1);
  app.use(cors({
    credentials: true,
    origin: [`http://localhost:${process.env.PORT || 3000}`, 'https://ojami.shop']
  }));

  app.use(helmet());
  app.use(express.json());

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "None",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 1024,
      },
    } as any)
  );

  // initAppData(em);

  app.get('/', (req, res) => {
    res.send('Welcome to api.ojami.shop');
  });


  app.use('/api/auth', authRoutes);
  app.use('/api/identity', identityRoutes);
  app.use('/api/ecommerce', ecommerceRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/webhooks', webhookRoutes);
  app.use('/api/ai', aiRoutes);
  app.get('/p/:id', isAuth, resolvePaymentLink);


  return app;
}



const startServer = async () => {
  const app = await createApp();

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => console.error(err));
