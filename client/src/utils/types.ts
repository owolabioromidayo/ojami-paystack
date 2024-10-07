export interface KYC {
    id: number;
    user: User; // OneToOne relation with User
    phoneNumber: string; // Unique
    NIN?: string; // Optional
    BVN?: string; // Optional
    createdAt: Date;
    updatedAt: Date; // Automatically updated on modification
}

export interface KYB {
    id: number;
    user: User; // OneToOne relation with User
    businessName: string;
    address: string;
    state: string;
    country: string;
    hasPhysicalStore: boolean;
    hasDeliveryMethod: boolean;
    usagePlan: string;
    businessCategory: string;
    RCNumber: string;
    createdAt: Date;
    updatedAt: Date; // Automatically updated on modification
}

export interface Storefront {
    id: number;
    storename: string;
    profileImageUrl?: string; // Optional
    bannerImageUrl?: string; // Optional
    ratings: [];
    description: string;
    user: User; // ManyToOne relation with User
    products: Array<Product>; // OneToMany relation with Product as an array
    salesCount: number; // Track total sales
    tags: Tag[]; // ManyToMany relation with Tag as an array
}

export interface VirtualWallet {
    id: number;
    createdAt: Date;
    balance: number; // Using DecimalType
    currency: string;

    pendingBalances: Array<PendingBalance>; // OneToMany relation with PendingBalance as an array
    user: User; // OneToOne relation with User
    transactions: Array<VirtualTransaction>; // OneToMany relation with VirtualTransaction as an array
}

export interface VirtualTransaction {
    id: number;
    _type: TransactionType; // Enum type for transaction type
    currency: string;
    amount: number; // Using DecimalType
    status: VirtualTransactionStatus; // Enum type for transaction status
    createdAt: Date;
    isInstantPurchase: boolean;
    narration: string;
    sendingWallet: VirtualWallet; // ManyToOne relation with VirtualWallet
    receivingWallet?: VirtualWallet; // Optional ManyToOne relation with VirtualWallet
}

export interface PendingBalance {
    id: number;
    createdAt: Date;
    resolvesAt: Date;
    amount: number; // Using DecimalType
    status: PendingBalanceStatus; // Enum type for pending balance status
    currency: string;
    sendingWallet: VirtualWallet; // ManyToOne relation with VirtualWallet
    receivingWallet: VirtualWallet; // ManyToOne relation with VirtualWallet
}

export interface Tag {
    id: number;
    name: string; // Unique name of the tag
    products: Array<Product>; // ManyToMany relation with Product as an array
    storefronts: Array<Storefront>; // ManyToMany relation with Storefront as an array
}

export interface ProductLink {
    id: number;
    linkId: string; // Unique identifier for the link
    shortLink: string; // Shortened version of the link
    qrCode: string; // QR code representation of the link
    product: Product; // OneToOne relation with Product
}

export interface Product {
    id: number;
    name: string;
    images: Array<string>; // Array of image URLs
    threeDModel?: Buffer; // Optional Buffer for 3D model
    description: string;
    quantity: number;
    ratings: Array<number>;
    price: number;
    storefront: Storefront; // ManyToOne relation with Storefront
    link?: ProductLink; // Optional OneToOne relation with ProductLink
    tags: Array<Tag>; // ManyToMany relation with Tag as an array
}

export enum VoucherStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
}

export interface Voucher {
  id: number;
  voucherId: string;     // Unique identifier for the voucher
  currency: string;      // Currency type (e.g., USD, NGN)
  amount: number;        // Amount associated with the voucher
  status: VoucherStatus; // Status of the voucher (active, redeemed, etc.)
  createdAt: Date;       // Date when the voucher was created
  owner: User;           // User who owns the voucher
  redeemer?: User;       // User who redeemed the voucher (optional)
  publicKey: string;     // Public key associated with the voucher
  signature: string;     // Signature for verification purposes
}


export interface User {
    id: number;
    createdAt: Date;
    firstname: string;
    lastname: string;
    birthDate?: string; // Optional
    phoneNumber: string; // Unique
    email: string; // Unique
    passwordHash: string; // Hidden
    isDisabled: boolean;
    profileImgUrl: string;
    storefronts: Array<Storefront>; // OneToMany relation
    virtualWallet: VirtualWallet; // OneToOne relation
    KYC?: KYC; // Optional OneToOne relation
    KYB?: KYB; // Optional OneToOne relation
    transactions: Array<Transaction>;
}

export interface Order {
  id: number;
  product: number; // Reference to Product type
  count: number; // Quantity of the product in the order
  storefront: number; // Reference to Storefront type
  fromUser: User; // Reference to User type (the user making the order)
  toUser: User; // Reference to User type (the user receiving the order)
  status: TransactionStatus; // Status of the order using TransactionStatus enum
}

export interface Cart {
  id: number; // Unique identifier for the cart
  user: User; // ManyToOne relation with User
  items: Array<CartItem>; // OneToMany relation with CartItem as an array
  totalPrice: number; // Total price of all items in the cart
}

export interface CartItem {
  id: number; // Unique identifier for the cart item
  cart: Cart; // ManyToOne relation with Cart
  product: Product; // ManyToOne relation with Product
  quantity: number; // Quantity of the product in the cart item
}


export interface CreateVirtualAccountResponse {
    status: boolean;
    message: string;
    data: {
      account_name: string;
      account_number: string;
      bank_code: string;
      bank_name: string;
      account_reference: string;
      unique_id: string;
      account_status: string;
      created_at: string;
      currency: string;
      customer: {
        name: string;
      };
    };
  }

  export interface Transaction {
    id: number;
    _type: TransactionType; // Enum type for transaction type
    currency: string; // Currency of the transaction
    amount: number; // Total amount of the transaction
    amountPaid?: number; // Optional amount that has been paid
    amountExpected: number; // Expected amount for the transaction
    fee: number; // Transaction fee
    vat: number; // Value-added tax
    reference: string; // Reference identifier for the transaction
    paymentReference: string; // Payment reference identifier
    status: TransactionStatus; // Enum type for transaction status
    narration: string; // Description or narration of the transaction
    merchantBearsCost: boolean; // Indicates if the merchant bears the cost
    accountName: string; // Name of the account holder
    accountNumber: string; // Account number associated with the transaction
    bankName: string; // Name of the bank
    bankCode: string; // Bank code for identification
    expiryDateInUtc: Date; // Expiry date in UTC format
    customerName: string; // Name of the customer involved in the transaction
    customerEmail: string; // Email address of the customer

    sendingUser: User; // ManyToOne relation with sending User
    receivingUser?: User; // Optional ManyToOne relation with receiving User
}
  
  
  export interface BankTransferResponse {
    status: boolean;
    message: string;
    data: {
      currency: string;
      amount: number;
      amount_expected: number;
      fee: number;
      vat: number;
      reference: string;
      payment_reference: string;
      status: string;
      narration: string;
      merchant_bears_cost: boolean;
      bank_account: {
        account_name: string;
        account_number: string;
        bank_name: string;
        bank_code: string;
        expiry_date_in_utc: string;
      };
      customer: {
        name: string;
        email: string;
      };
    };
  }
  
  //TODO: find out transaction status types
  export enum TransactionStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'canceled',
  }
  //TODO: alter this
  export enum VirtualTransactionStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
  }
  
  export enum PendingBalanceStatus{
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
  }
  
  export enum TransactionType{
    BANK_TRANSFER = 'bank_transfer',
    VIRTUAL_TRANSACTION = 'virtual_transaction',
   //virtual bank account to virtual bank account
  }
  
  
  export interface GetQueryChargeResponse {
      status: boolean;
      message: string;
      data: {
          reference: string;
          status: string;
          amount: number;
          amount_paid: string;
          fee: string;
          currency: string;
          description: string;
          // TODO: I dont think we need to store this
          payer_bank_account: {
              account_number: string;
              account_name: string;
              bank_name: string;
          };
      };
  }  