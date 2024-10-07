// import { MikroORM } from "@mikro-orm/core";
// import { __prod__ } from "./constants";
// import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
// import { defineConfig } from '@mikro-orm/postgresql';
// import { Migrator } from '@mikro-orm/migrations';

// require("dotenv").config();

// import { User } from "./entities/User";

// import path from 'path';

// export default defineConfig({
//     migrations: {
//         path: path.join(__dirname + '/migrations'),
//         transactional: true,
//         allOrNothing: true,
//         // pattern: /^[\w-]+\d+\.[tj]s$/,
//     },
//     entities: [
//         User
//     ],
//     dbName: process.env.PG_DATABASE,
//     // driver: 'postgresql',
//     debug: !__prod__,
//     password: process.env.PG_PASSWORD,
//     user: process.env.PG_ACCOUNT,
//     host: process.env.PG_HOST,
//     port: Number(process.env.PG_PORT),
//     metadataProvider: TsMorphMetadataProvider,
//     extensions: [Migrator],
// });

import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

require("dotenv").config();

import { User } from "./entities/User";
import path from "path";
import { Cart } from "./entities/Cart";
import { CartItem } from "./entities/CartItem";
import { InstantOrder } from "./entities/InstantOrder";
import { InstantOrderItem } from "./entities/InstantOrderItem";
import { InstantOrderLink } from "./entities/InstantOrderLink";
import { KYB } from "./entities/KYB";
import { KYC } from "./entities/KYC";
import { Order } from "./entities/Order";
import { PendingBalance } from "./entities/PendingBalance";
import { Product } from "./entities/Product";
import { ProductLink } from "./entities/ProductLink";
import { Storefront } from "./entities/Storefront";
import { Tag } from "./entities/Tag";
import { Transaction } from "./entities/Transaction";
import { VirtualAccount } from "./entities/VirtualAccount";
import { VirtualTransaction } from "./entities/VirtualTransaction";
import { VirtualWallet } from "./entities/VirtualWallet";
import { Voucher } from "./entities/Voucher";
import { PayInTransaction } from "./entities/PayInTransaction";

const commonConfig = {
  migrations: {
    path: path.join(__dirname, "/migrations"),
    transactional: true,
    allOrNothing: true,
  },
  entities: [
    User,
    Cart,
    CartItem,
    InstantOrder,
    InstantOrderItem,
    InstantOrderLink,
    KYB,
    KYC,
    Order,
    PendingBalance,
    Product,
    ProductLink,
    Storefront,
    Tag,
    Transaction,
    VirtualAccount,
    VirtualTransaction,
    VirtualWallet,
    Voucher,
    PayInTransaction
  ],
  debug: !__prod__,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
};

const prodConfig = {
  ...commonConfig,
  dbName: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  user: process.env.PG_ACCOUNT,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
};

const devConfig = {
  ...commonConfig,
  dbName: process.env.PG_DATABASE_DEV || "dev_db",
  password: process.env.PG_PASSWORD_DEV || "dev_password",
  user: process.env.PG_ACCOUNT_DEV || "dev_user",
  host: process.env.PG_HOST_DEV || "localhost",
  port: Number(process.env.PG_PORT_DEV) || 5432,
};

export default defineConfig(__prod__ ? prodConfig : devConfig);
