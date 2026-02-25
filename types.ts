
export type ProfileType = 'personal' | 'charity' | 'organizational' | 'all-for-one' | 'group-trip' | 'merchant';
export type UserView = 'owner' | 'friend';
export type WishlistPrivacy = 'public' | 'friends' | 'private';
export type CampaignCategory = 'education' | 'health' | 'housing' | 'hunger' | 'environment' | 'other';
export type TransactionType = 'contribution' | 'cash_gift' | 'withdrawal' | 'payout' | 'refund' | 'payout_complete' | 'revenue' | 'expense' | 'system_log';
export type DateType = 'birthday' | 'spouse_birthday' | 'child_birthday' | 'father_birthday' | 'mother_birthday' | 'anniversary' | 'friend_birthday' | 'other';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  userId?: string;
  date: string;
  amount: number;
  type: TransactionType;
  description: string;
  trackingCode?: string;
  recipientName?: string;
  recipientShaba?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock: number; // موجودی کل
  reservedStock: number; // تعداد رزرو شده (در انتظار پرداخت)
  instagramLink?: string;
  externalLink?: string;
  merchantId?: string;
  isTest?: boolean;
}

export interface ImportantDate {
  id: string;
  type: DateType;
  date: string;
  label?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider?: 'google' | 'facebook' | 'apple' | 'email' | 'mobile';
  birthday?: string;
  wallet?: Wallet;
  isGuest?: boolean;
  shaba?: string;
  accountHolderName?: string;
  nationalCode?: string;
  address?: string;
  role?: 'user' | 'admin' | 'charity' | 'manager' | 'accountant' | 'merchant';
  status?: 'active' | 'banned';
  joinDate?: string;
  mobile?: string;
  isMobileVerified?: boolean;
  kycVerified?: boolean;
  shahkarVerified?: boolean;
  termsAccepted?: boolean;
  contactNumber?: string;
  responsiblePersonName?: string;
  responsiblePersonNationalId?: string;
  avatar?: string;
  shopName?: string;
  storeType?: 'website' | 'instagram';
  websiteUrl?: string;
  affiliateProgramStatus?: 'none' | 'pending' | 'active';
  instagramHandle?: string;
  shopCategory?: string; 
  shopCategories?: string[];
  rating?: number;
  reviewCount?: number;
  followersCount?: number;
  followingCount?: number;
  products?: Product[];
  coverImage?: string;
  shahkarVerifiedStatus?: 'pending' | 'verified' | 'failed';
  interests?: string[];
  badges?: string[];
  bio?: string;
  notificationPreferences?: {
      email: boolean;
      sms: boolean;
      push: boolean;
  };
  profilePrivacy?: 'public' | 'friends_only';
  referralCode?: string;
  referredBy?: string;
  importantDates?: ImportantDate[];
  giftsGivenCount?: number;
  giftsReceivedCount?: number;
  isTest?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'funded' | 'expiry' | 'claim_expiry' | 'claim_reminder' | 'payout_complete' | 'refund' | 'cash_gift' | 'birthday' | 'list_created' | 'offer_received' | 'friend_request' | 'order_shipped' | 'gift_claimed';
  read: boolean;
  createdAt: string;
  relatedListId?: string;
  relatedItemId?: string;
  relatedFriendshipId?: string;
  merchantName?: string;
  offerPrice?: number;
  isTest?: boolean;
}

export interface Contribution {
  userId: string;
  userName?: string;
  amount: number;
  createdAt: string;
  isAnonymous: boolean;
}

export interface WishlistItem {
  id: string;
  productId?: string; // آیدی محصول اصلی در فروشگاه برای مدیریت موجودی
  name: string;
  description: string;
  link: string;
  isGroupGift: boolean;
  allowOffers?: boolean;
  price?: number;
  imageUrl?: string;
  purchasedFrom?: string;
  status: 'open' | 'funded' | 'claimed' | 'settled';
  contributions: Contribution[];
  claimedBy?: string | null;
  requestedBy?: string;
  expiryDate?: string;
  affiliateCode?: string;
  isUrgent?: boolean;
  isTest?: boolean;
  isGiveaway?: boolean; 
  createdAt: string;
}

export interface GiveawayGift {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: 'available' | 'claimed';
  claimedBy?: string;
  createdAt: string;
  category?: string;
}

export interface Wishlist {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  privacy: WishlistPrivacy;
  type: ProfileType;
  coverImage?: string;
  items: WishlistItem[];
  beneficiary?: {
    name: string;
    shaba?: string;
    address?: string;
    isThirdParty: boolean;
    giftType?: 'cash' | 'physical';
  };
  isTest?: boolean;
}

export interface Friendship {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface MicroItem {
  id: string;
  charityId: string;
  name: string;
  icon: string;
  price: number;
  color: string;
  is_urgent: boolean;
  status: 'active' | 'inactive';
  isTest?: boolean;
}

export interface Offer {
  id: string;
  merchantId: string;
  merchantName: string;
  itemId: string;
  price: number;
  description: string;
  createdAt: string;
}

export interface Order {
  id: string;
  productId?: string;
  buyerId: string;
  merchantId: string;
  receiverId: string;
  on_behalf_of?: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
  deliveryAddress: string;
  deliveryMethod?: string;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
  isTest?: boolean;
}

// Fixed: Added missing Template type for wishlist templates
export interface Template {
  title: string;
  description: string;
  icon: string;
  privacy: WishlistPrivacy;
  themeColor: string;
  coverImage: string;
  items: any[];
}

// Fixed: Added missing ChatMessage type for the gift guru assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// Fixed: Added missing DirectMessage, GroupMessage, and GroupChat types for communications
export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  groupId: string;
  text: string;
  createdAt: string;
}

export interface GroupChat {
  id: string;
  name: string;
  members: string[];
  messages: GroupMessage[];
  createdAt: string;
}

// Fixed: Added missing SystemLog type for audit logs
export interface SystemLog {
  id: string;
  type: string;
  details: string;
  userId?: string;
  userIp?: string;
  status: 'success' | 'failure';
  createdAt: string;
}

// Fixed: Added missing Partner type for affiliate partners
export interface Partner {
  id: string;
  name: string;
  domain: string;
  affiliateParam: string;
  affiliateValue: string;
  commissionRate: number;
  isActive: boolean;
}

// Fixed: Added missing GatewaySettings type for payment provider configuration
export interface GatewaySettings {
  provider: 'zarinpal' | 'nextpay' | 'saman';
  merchantId: string;
  isSandbox: boolean;
  callbackUrl: string;
  isActive: boolean;
}

// Fixed: Added missing ExpenseCategory and SystemExpense types for accounting
export type ExpenseCategory = 'server_infrastructure' | 'sms_panel' | 'salary' | 'rent' | 'marketing' | 'tax' | 'bank_fees' | 'other';

export interface SystemExpense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

// Fixed: Added missing SmsSettings type for SMS panel configuration
export interface SmsSettings {
  provider: 'kavehnegar' | 'ghasedak' | 'magfa';
  apiKey: string;
  senderNumber: string;
  patterns: {
    otp: string;
    welcome: string;
    payment: string;
  };
  isActive: boolean;
}

// Fixed: Added missing TrafficSettings type for SEO and redirect management
export interface TrafficSettings {
  defaultCpc: number;
  redirectDelay: number;
  enableUtm: boolean;
}

// Fixed: Added missing CloudStorageSettings type for asset storage configuration
export interface CloudStorageSettings {
  provider: 'arvan' | 'liara' | 'minio';
  endpoint: string;
  bucketName: string;
  accessKey: string;
  secretKey: string;
  isActive: boolean;
}

// Fixed: Added missing AiSettings type for AI engine configuration
export interface AiSettings {
  provider: 'gemini' | 'openai';
  apiKey: string;
  modelName: string;
  isActive: boolean;
}

// Fixed: Added missing VirtualCard type for wallet-based payments
export interface VirtualCard {
  id: string;
  number: string;
  cvv: string;
  expiry: string;
  amount: number;
  expiresAt: number;
  description: string;
  isExpired: boolean;
}

// Fixed: Added missing Review type for merchant reviews
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  criteria?: { [key: string]: number };
  createdAt: string;
}
