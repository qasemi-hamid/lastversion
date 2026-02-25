
import { Product, MicroItem, User, Wishlist, WishlistItem, Transaction, Order, Notification } from '../types';

export const DEMO_UUIDS = {
    SUPER_ADMIN: 'admin-master-999',
    DEMO_USER: '74125896-3214-5698-7412-589632147852',
    TEST_BUYER: '85214796-3698-5214-7896-321456987412',
    TEST_MERCHANT: '96325874-1234-5678-9012-345678901234', // Real UUID for Demo Merchant
    FRIEND_1: 'friend-1-uuid-placeholder',
    FRIEND_2: 'friend-2-uuid-placeholder'
};

// --- TEST ORDERS FOR MERCHANTS ---
export const TEST_ORDERS: Order[] = [
    {
        id: 'test-ord-001',
        buyerId: DEMO_UUIDS.TEST_BUYER,
        merchantId: DEMO_UUIDS.TEST_MERCHANT,
        receiverId: DEMO_UUIDS.DEMO_USER,
        items: [{ name: 'آیفون ۱۳ پرو (تستی)', quantity: 1, price: 45000000 }],
        totalAmount: 45000000,
        status: 'pending',
        deliveryAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴ - تحویل به آقای محمدی',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        isTest: true
    }
];

export const DEMO_USERS: User[] = [
    {
        id: DEMO_UUIDS.FRIEND_1,
        name: 'سارا احمدی (دوست)',
        avatar: 'https://i.pravatar.cc/150?u=sara',
        role: 'user',
        email: 'sara@example.com',
        isTest: true
    },
    {
        id: DEMO_UUIDS.FRIEND_2,
        name: 'علی مولایی (دوست)',
        avatar: 'https://i.pravatar.cc/150?u=ali',
        role: 'user',
        email: 'ali@example.com',
        isTest: true
    }
];

export const DEMO_WISHLISTS: Wishlist[] = [
    {
        id: 'demo-list-1',
        ownerId: DEMO_UUIDS.DEMO_USER,
        name: 'آرزوهای شخصی من (تستی)',
        type: 'personal',
        privacy: 'friends',
        coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
        isTest: true,
        items: [
            {
                id: 'item-demo-1',
                name: 'قهوه‌ساز نسپرسو',
                description: 'مدل Essenza Mini - قرمز',
                link: 'https://example.com/nespresso',
                isGroupGift: true,
                allowOffers: true,
                price: 8500000,
                status: 'open',
                imageUrl: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400',
                contributions: [],
                // Fix: Added missing required property 'createdAt'
                createdAt: new Date().toISOString()
            }
        ]
    }
];

export const MOCK_MERCHANTS: any[] = [
  {
    id: DEMO_UUIDS.TEST_MERCHANT,
    name: 'دیجی‌کالا (نمونه)',
    email: 'shop@digikala.com',
    role: 'merchant',
    shopName: 'دیجی‌کالا',
    avatar: 'https://ui-avatars.com/api/?name=Digi+Kala&background=ef394e&color=fff',
    rating: 4.5,
    kycVerified: true,
    isTest: true
  }
];

export const MOCK_PRODUCTS: any[] = [
  {
    id: 'prod-mock-1',
    name: 'گوشی موبایل آیفون 13 (نمونه تستی)',
    description: 'رنگ آبی، حافظه 128 گیگابایت',
    price: 45000000,
    category: 'electronics',
    merchantId: DEMO_UUIDS.TEST_MERCHANT,
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400',
    isTest: true
  }
];

export const MOCK_MICRO_ITEMS: any[] = [
  {
    id: 'micro-1',
    charityId: 'charity-gen-1',
    name: 'یک اسکوپ بستنی (تستی)',
    icon: '🍦',
    price: 25000,
    color: 'bg-pink-100 text-pink-600',
    is_urgent: false,
    status: 'active',
    isTest: true
  }
];
