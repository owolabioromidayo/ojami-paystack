import express, { Request, Response } from "express";
import session from 'express-session';
import helmet from 'helmet';
import RedisStore from "connect-redis";
import argon2 from "argon2";
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
import aiRoutes, { generateEmbeddingsSync } from './routes/ai.routes';
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


// const https = require("https");

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
// };


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


async function initAppData(em: EntityManager) {
  const cataloguePath = path.join(__dirname, 'routes', 'catalogue.json');
  const catalogueData = JSON.parse(fs.readFileSync(cataloguePath, 'utf-8'));
  const hashedPassword = await argon2.hash("password");

  const user = new User('Gateway', 'Technologies', '09100000000', 'info@gateway.tech', hashedPassword);

  // Check if the tag already exists
  let techTag = await em.findOne(Tag, { name: "tech" });
  if (!techTag) {
    techTag = new Tag("tech");
    await em.persistAndFlush(techTag);
  }

  const storefront = new Storefront(user, 'Gateway Technologies', 'Technology Products',
    "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    [], em);

  storefront.tags.add(techTag);

  await em.persistAndFlush(user);
  await em.persistAndFlush(storefront);

  for (let i = 0; i < Math.min(catalogueData.length, 1500); i++) {
    try {
      const item = catalogueData[i];
      console.log(item.description);
      const price: number = typeof item.prices === 'string' ? parseFloat(item.prices.replace(/,/g, '')) : item.prices;
      let imageUrl = item.displayUrl;

      // Define keywords for different product categories
      const phoneKeywords = ['phone', 'smartphone', 'iphone', 'android'];
      const laptopKeywords = ['laptop', 'notebook', 'macbook', 'chromebook'];
      const accessoryKeywords = ['accessory', 'charger', 'cable', 'headphone', 'earphone', 'case', 'stand'];

      const phoneImages = [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      ];

      const laptopImages = [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      ];

      const accessoryImages = [
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608156639585-b3a7a6e98d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      ];

      // Check if the item name contains any of the keywords
      const categories = [phoneImages, laptopImages, accessoryImages];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      imageUrl = randomCategory[Math.floor(Math.random() * randomCategory.length)];
      const product = new Product(storefront, item.name || "null", price || 100000, [imageUrl] as string[], item.description as string || "null", 100);

      product.tags.add(techTag);
      em.persist(product);
    } catch (error) {
      console.error(`Failed to create product at index ${i}:`, error);
    }
  }

  await em.flush();

  console.log('App data initialized successfully');
}


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

  // Middleware to log every route request
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(contextMiddleware(redis, em));

  app.set("trust proxy", 1);
  app.use(cors({
    credentials: true,
    origin: [`http://localhost:${process.env.PORT || 3000}`, 'https://ojami-paystack-bwjp.vercel.app']
    //origin: (origin: any, callback: any ) => {callback(null, true); }
    //origin: '*'
  }));

  app.use(helmet());
  app.use(express.json());

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      //sameSite: "None",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 1024,
        //sameSite: 'lax'
      },
    } as any)
  );



  await generateEmbeddingsSync();
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

  const PORT = Number(process.env.PORT) || 4000;

  app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server ready on http://localhost:${PORT}`);
  // const server = https.createServer(options, app);
  // server.listen(PORT, '0.0.0.0', () => {
    // console.log(`App listening on https://localhost:${PORT}`);
  });


  // app.listen(PORT, '0.0.0.0', () => {
  //   console.log(`Server ready on http://localhost:${PORT}`);
  // });
}

startServer().catch((err) => console.error(err));
