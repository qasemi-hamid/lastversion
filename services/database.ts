
import { User, Wishlist, Friendship, Notification, Wallet, Transaction, SystemLog, Partner, GatewaySettings, SystemExpense, Product, MicroItem, Order, Offer, SmsSettings, TrafficSettings, CloudStorageSettings, AiSettings, GiveawayGift } from '../types';
import { DEMO_WISHLISTS, MOCK_MICRO_ITEMS, TEST_ORDERS, MOCK_PRODUCTS, DEMO_UUIDS, DEMO_USERS } from '../data/seedData';

export interface Database {
    users: User[];
    wishlists: Wishlist[];
    friendships: Friendship[];
    notifications: Notification[];
    wallets: Wallet[];
    transactions: Transaction[];
    systemLogs: SystemLog[];
    partners: Partner[];
    gatewaySettings: GatewaySettings;
    expenses: SystemExpense[];
    lastWishlistInteraction: Record<string, string>;
    shabaToNameMap: Record<string, string>;
    microItems: MicroItem[];
    orders: Order[];
    offers: Offer[];
    externalProducts?: Product[];
    storeClicks: Record<string, number>;
    smsSettings: SmsSettings;
    trafficSettings: TrafficSettings;
    cloudSettings: CloudStorageSettings;
    aiSettings: AiSettings;
    sessionClaims: Record<string, string | null>; 
    giveawayGifts: GiveawayGift[];
}

const STORAGE_KEY = 'GIFTINO_LOCAL_DB_V2';

const getInitialData = (): Database => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.sessionClaims) parsed.sessionClaims = {};
            if (!parsed.giveawayGifts) parsed.giveawayGifts = [];
            if (!parsed.orders || parsed.orders.length === 0) parsed.orders = [...TEST_ORDERS];
            if (parsed.wishlists.length === 0) parsed.wishlists = [...DEMO_WISHLISTS];
            if (parsed.microItems.length === 0) parsed.microItems = [...MOCK_MICRO_ITEMS];
            
            const merchant = parsed.users.find((u: any) => u.id === DEMO_UUIDS.TEST_MERCHANT);
            if (merchant && (!merchant.products || merchant.products.length === 0)) {
                merchant.products = [...MOCK_PRODUCTS];
            }
            
            return parsed;
        }
    } catch (e) {}

    const now = new Date().toISOString();
    return {
        users: [
            { id: 'admin-user', name: 'مدیر سیستم', email: 'admin', mobile: '09000000000', role: 'admin', password: 'admin', isMobileVerified: true, joinDate: now, status: 'active' },
            { 
                id: DEMO_UUIDS.DEMO_USER,
                name: 'کاربر تستی', 
                email: 'user@gmail.com', 
                mobile: '09120000000', 
                role: 'user', 
                password: 'user', 
                isMobileVerified: true, 
                joinDate: now, 
                status: 'active',
                bio: 'علاقه‌مند به تکنولوژی و سفرهای ماجراجویانه 🏕️'
            },
            ...DEMO_USERS,
            { 
                id: DEMO_UUIDS.TEST_MERCHANT, 
                name: 'فروشگاه تستی', 
                email: 'shop@gmail.com', 
                mobile: '09350000000', 
                role: 'merchant', 
                password: 'shop', 
                shopName: 'گالری گیفتی‌نو', 
                isMobileVerified: true, 
                joinDate: now, 
                status: 'active', 
                kycVerified: true, 
                shahkarVerified: true,
                products: [...MOCK_PRODUCTS]
            }
        ],
        wishlists: [...DEMO_WISHLISTS], 
        friendships: [
            { id: 'f1', requesterId: DEMO_UUIDS.DEMO_USER, receiverId: DEMO_UUIDS.FRIEND_1, status: 'accepted' },
            { id: 'f2', requesterId: DEMO_UUIDS.DEMO_USER, receiverId: DEMO_UUIDS.FRIEND_2, status: 'accepted' }
        ], 
        notifications: [
            { id: 'n-init', message: 'خوش آمدید! لیست آرزوهای خود را بسازید.', type: 'list_created', read: false, createdAt: now }
        ], 
        wallets: [
            { id: `w-${DEMO_UUIDS.DEMO_USER}`, userId: DEMO_UUIDS.DEMO_USER, balance: 1200000, transactions: [] },
            { id: `w-${DEMO_UUIDS.TEST_MERCHANT}`, userId: DEMO_UUIDS.TEST_MERCHANT, balance: 5000000, transactions: [] }
        ], 
        transactions: [], 
        systemLogs: [], 
        partners: [],
        gatewaySettings: { provider: 'zarinpal', merchantId: '', isSandbox: true, callbackUrl: 'https://giftino.ir/callback', isActive: true },
        expenses: [], 
        lastWishlistInteraction: {}, 
        shabaToNameMap: {}, 
        microItems: [...MOCK_MICRO_ITEMS], 
        orders: [...TEST_ORDERS], 
        offers: [], 
        externalProducts: [], // Empty here because they exist in Demo Merchant's products
        storeClicks: {},
        smsSettings: { provider: 'kavehnegar', apiKey: '', senderNumber: '1000xx', patterns: { otp: '', welcome: '', payment: '' }, isActive: false },
        trafficSettings: { defaultCpc: 1000, redirectDelay: 3, enableUtm: true },
        cloudSettings: { provider: 'arvan', endpoint: '', bucketName: 'giftino-assets', accessKey: '', secretKey: '', isActive: false },
        aiSettings: { provider: 'gemini', apiKey: '', modelName: 'gemini-3-flash-preview', isActive: true },
        sessionClaims: {},
        giveawayGifts: []
    };
};

let db: Database = getInitialData();

const saveDatabase = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
        console.error("Local Storage Save Failed", e);
    }
};

export const setDatabase = (newDb: Database) => {
    db = newDb;
    saveDatabase();
};

export { db, saveDatabase, getInitialData };
