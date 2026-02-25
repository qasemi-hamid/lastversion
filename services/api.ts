
import { db, saveDatabase } from './database';
import { getSupabaseClient } from './supabaseClient';
import { User, Wishlist, WishlistItem, Friendship, Notification, Wallet, Transaction, Product, MicroItem, Order, Partner, SystemExpense, GatewaySettings, SmsSettings, TrafficSettings, CloudStorageSettings, AiSettings, ProfileType, GiveawayGift } from '../types';

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        try { return crypto.randomUUID(); } catch(e) {}
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const isRealUser = (userId: string) => isValidUUID(userId);

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const mapSupabaseList = (list: any): Wishlist => ({
    id: list.id,
    ownerId: list.owner_id,
    name: list.name,
    description: list.description || '',
    privacy: list.privacy || 'friends',
    type: list.type || 'personal',
    coverImage: list.cover_image || '',
    items: []
});

const mapSupabaseItem = (item: any): WishlistItem => ({
    id: item.id, 
    productId: item.product_id, 
    name: item.name, 
    description: item.description || '', 
    link: item.link || '',
    price: item.price ? Number(item.price) : undefined, 
    imageUrl: (!item.image_url || item.image_url === 'EMPTY' || item.image_url === 'NULL') ? '' : item.image_url,
    status: item.status || 'open', 
    isGroupGift: item.is_group_gift || false, 
    allowOffers: item.allow_offers || false,
    contributions: item.contributions || [], 
    claimedBy: item.claimed_by, 
    isGiveaway: item.is_giveaway || false, 
    isUrgent: item.is_urgent || false,
    createdAt: item.created_at || new Date().toISOString()
});

export const register = async (newUser: any): Promise<{ success: boolean; message?: string; user?: User }> => {
    const user: User = { ...newUser, id: generateUUID(), joinDate: new Date().toISOString() };
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('users').insert([{
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            role: user.role || 'user',
            status: 'active',
            mobile: user.mobile,
            shop_name: newUser.shopName || null
        }]).select().single();
        
        if (error) return { success: false, message: error.message };
        if (data) user.id = data.id;
    } catch (e: any) { 
        return { success: false, message: e.message };
    }

    db.users.push(user);
    db.wallets.push({ id: `w-${user.id}`, userId: user.id, balance: 0, transactions: [] });
    saveDatabase();
    return { success: true, user: deepClone(user) };
};

export const login = async ({ usernameOrEmail, password }: any) => {
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('users')
            .select('*')
            .or(`email.eq."${usernameOrEmail}",mobile.eq."${usernameOrEmail}"`)
            .eq('password', password)
            .maybeSingle();
        
        if (data && !error) {
            const user = { 
                ...data, 
                shopName: data.shop_name, 
                contactNumber: data.contact_number, 
                nationalCode: data.national_code, 
                accountHolderName: data.account_holder_name, 
                kycVerified: data.kyc_verified, 
                shahkarVerified: data.shahkar_verified,
                importantDates: data.important_dates || []
            };
            const idx = db.users.findIndex(u => u.id === data.id);
            if (idx !== -1) db.users[idx] = user; else db.users.push(user);
            saveDatabase();
            return deepClone(user);
        }
    } catch (err) { console.error("Cloud login failed", err); }

    const localUser = db.users.find(u => (u.email === usernameOrEmail || u.mobile === usernameOrEmail) && u.password === password);
    if (localUser) return deepClone(localUser);
    
    throw new Error('نام کاربری یا رمز عبور اشتباه است.');
};

export const getMyWishlists = async (userId: string): Promise<Wishlist[]> => {
    if (!isValidUUID(userId)) return [];
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('wishlists').select('*, items(*)').eq('owner_id', userId);
        if (error) throw error;
        const mapped = (data || []).map(list => ({
            ...mapSupabaseList(list),
            items: (list.items || []).map(mapSupabaseItem)
        }));
        const otherLists = db.wishlists.filter(w => w.ownerId !== userId);
        db.wishlists = [...otherLists, ...mapped];
        saveDatabase();
        return deepClone(mapped);
    } catch (err) { 
        return deepClone(db.wishlists.filter(w => w.ownerId === userId)); 
    }
};

export const getPublicCampaigns = async (): Promise<Wishlist[]> => {
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('wishlists').select('*, items(*)').eq('privacy', 'public');
        if (error) throw error;
        const mapped = (data || []).map(list => ({
            ...mapSupabaseList(list),
            items: (list.items || []).map(mapSupabaseItem)
        }));
        const otherPublicLists = db.wishlists.filter(w => w.privacy !== 'public');
        db.wishlists = [...otherPublicLists, ...mapped];
        saveDatabase();
        return deepClone(mapped);
    } catch (err) { 
        return deepClone(db.wishlists.filter(w => w.privacy === 'public')); 
    }
};

export const getWishlistsByOwners = async (ownerIds: string[]): Promise<Wishlist[]> => {
    if (ownerIds.length === 0) return [];
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('wishlists').select('*, items(*)').in('owner_id', ownerIds);
        if (error) throw error;
        const mapped = (data || []).map(list => ({
            ...mapSupabaseList(list),
            items: (list.items || []).map(mapSupabaseItem)
        }));
        return deepClone(mapped);
    } catch (err) { 
        return deepClone(db.wishlists.filter(w => ownerIds.includes(w.ownerId))); 
    }
};

export const addList = async (userId: string, details: any, type: ProfileType): Promise<Wishlist> => {
    const supabase = getSupabaseClient();
    const newListId = generateUUID();
    
    if (isValidUUID(userId)) {
        const { error } = await supabase.from('wishlists').insert([{
            id: newListId, owner_id: userId, name: details.name,
            privacy: details.privacy || 'friends', type: type, 
            description: details.description || '', cover_image: details.coverImage || ''
        }]);
        if (error) console.error("Cloud List Error:", error);
    }

    const newList: Wishlist = {
        id: newListId, ownerId: userId, name: details.name, description: details.description || '',
        privacy: details.privacy || 'friends', type: type, coverImage: details.coverImage || '', items: []
    };
    db.wishlists.push(newList);
    saveDatabase();
    return deepClone(newList);
};

export const addItem = async (listId: string, itemData: any): Promise<WishlistItem> => {
    const supabase = getSupabaseClient();
    const newItemId = generateUUID();
    const now = new Date().toISOString();

    if (isValidUUID(listId)) {
        try {
            const { error } = await supabase.from('items').insert([{
                id: newItemId, 
                list_id: listId, 
                product_id: itemData.productId || null, 
                name: itemData.name,
                description: itemData.description || '', 
                link: itemData.link || '',
                price: itemData.price ? Number(itemData.price) : null, 
                image_url: itemData.imageUrl || '',
                is_group_gift: itemData.isGroupGift || false, 
                allow_offers: itemData.allowOffers || false,
                is_giveaway: itemData.isGiveaway || false,
                is_urgent: itemData.isUrgent || false,
                purchased_from: itemData.purchasedFrom || null,
                is_test: itemData.isTest || false,
                created_at: now
            }]);
            
            if (error) {
                console.error("Cloud Item Insert Error:", error);
                throw error;
            }
        } catch (e) {
            console.error("Cloud Item Crash:", e);
        }
    }

    const newItem: WishlistItem = { 
        id: newItemId, 
        status: 'open', 
        contributions: [], 
        createdAt: now, 
        ...itemData 
    };
    
    const list = db.wishlists.find(w => w.id === listId);
    if (list) {
        if (!list.items) list.items = [];
        list.items.push(newItem);
        saveDatabase();
    }
    return deepClone(newItem);
};

export const getMerchantProducts = async (merchantId: string): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('products').select('*').eq('merchant_id', merchantId);
        if (error) throw error;
        if (data) {
            return data.map(p => ({
                id: p.id, merchantId: p.merchant_id, name: p.name, description: p.description,
                price: Number(p.price), imageUrl: p.image_url, category: p.category, 
                stock: p.stock || 0, reservedStock: p.reserved_stock || 0
            }));
        }
    } catch (e) { 
        console.error("Cloud Products Error:", e);
    }
    const user = db.users.find(u => u.id === merchantId);
    return deepClone(user?.products || []);
};

export const getAllMerchants = async (): Promise<User[]> => {
    const supabase = getSupabaseClient();
    try {
        const { data, error } = await supabase.from('users').select('*').eq('role', 'merchant');
        if (error) throw error;
        const mapped = (data || []).map(d => ({ 
            ...d, 
            shopName: d.shop_name, 
            contactNumber: d.contact_number, 
            nationalCode: d.national_code, 
            accountHolderName: d.account_holder_name, 
            kycVerified: d.kyc_verified, 
            shahkarVerified: d.shahkar_verified,
            importantDates: d.important_dates || [] 
        }));
        return deepClone(mapped);
    } catch (err) { 
        return deepClone(db.users.filter(u => u.role === 'merchant')); 
    }
};

export const getAllAllProducts = async (): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    const combined: Product[] = [];
    try {
        const { data: cloudProds } = await supabase.from('products').select('*');
        if (cloudProds) {
            cloudProds.forEach(p => combined.push({
                id: p.id, name: p.name, description: p.description, price: Number(p.price),
                imageUrl: p.image_url, category: p.category || 'general', merchantId: p.merchant_id,
                stock: p.stock || 0, reservedStock: p.reserved_stock || 0
            }));
        }
    } catch (e) {}
    
    if (combined.length === 0) {
        db.users.forEach(u => {
            if (u.products) u.products.forEach(p => combined.push(p));
        });
    }

    const uniqueMap = new Map<string, Product>();
    combined.forEach(p => uniqueMap.set(p.id, p));
    return Array.from(uniqueMap.values());
};

export const addProduct = async (p: any, merchantId: string) => {
    const id = generateUUID();
    const supabase = getSupabaseClient();
    
    if (isValidUUID(merchantId)) {
        try {
            const { error } = await supabase.from('products').insert([{
                id, merchant_id: merchantId, name: p.name, description: p.description,
                price: Number(p.price), image_url: p.imageUrl, category: p.category, stock: Number(p.stock || 10)
            }]);
            if (error) throw error;
        } catch (e) {
            console.error("Add Product Cloud Fail:", e);
        }
    }

    const m = db.users.find(u => u.id === merchantId);
    if (m) { 
        if(!m.products) m.products = []; 
        const newProd = {...p, id, merchantId, price: Number(p.price), stock: Number(p.stock)};
        m.products.push(newProd); 
    }
    saveDatabase();
    return {...p, id, merchantId};
};

export const updateItem = async (itemId: string, updates: any) => {
    const supabase = getSupabaseClient();
    if (isValidUUID(itemId)) {
        await supabase.from('items').update({
            name: updates.name, description: updates.description, price: updates.price,
            image_url: updates.imageUrl, status: updates.status, claimed_by: updates.claimedBy
        }).eq('id', itemId);
    }
    db.wishlists.forEach(l => {
        const idx = l.items.findIndex(i => i.id === itemId);
        if (idx !== -1) l.items[idx] = { ...l.items[idx], ...updates };
    });
    saveDatabase();
};

export const deleteList = async (id: string) => { 
    if (isValidUUID(id)) await getSupabaseClient().from('wishlists').delete().eq('id', id);
    db.wishlists = db.wishlists.filter(w => w.id !== id);
    saveDatabase();
};

export const deleteItem = async (lId: string, iId: string) => {
    if (isValidUUID(iId)) await getSupabaseClient().from('items').delete().eq('id', iId);
    const list = db.wishlists.find(w => w.id === lId);
    if (list) list.items = list.items.filter(i => i.id !== iId);
    saveDatabase();
};

export const updateProduct = async (id: string, u: any) => {
    if (isValidUUID(id)) {
        const { error } = await getSupabaseClient().from('products').update({ 
            name: u.name, description: u.description, price: Number(u.price), 
            image_url: u.imageUrl, stock: Number(u.stock) 
        }).eq('id', id);
        if (error) console.error(error);
    }
    db.users.forEach(user => { if(user.products) { const i = user.products.findIndex(p => p.id === id); if(i!==-1) user.products[i] = {...user.products[i], ...u, price: Number(u.price), stock: Number(u.stock)}; }});
    saveDatabase();
};

export const deleteProduct = async (id: string) => {
    if (isValidUUID(id)) await getSupabaseClient().from('products').delete().eq('id', id);
    db.users.forEach(u => { if(u.products) u.products = u.products.filter(p => p.id !== id); });
    saveDatabase();
};

export const getAllUsersForAdmin = async (): Promise<User[]> => {
    const { data } = await getSupabaseClient().from('users').select('*');
    return (data || []).map(d => ({ ...d, shopName: d.shop_name, importantDates: d.important_dates || [] }));
};

export const getFriendships = async (uId: string) => {
    const { data } = await getSupabaseClient().from('friendships').select('*').or(`requester_id.eq."${uId}",receiver_id.eq."${uId}"`);
    return (data || []).map(f => ({ id: f.id, requesterId: f.requester_id, receiverId: f.receiver_id, status: f.status }));
};

export const sendFriendRequest = async (req: string, rec: string) => { await getSupabaseClient().from('friendships').insert([{ id: generateUUID(), requester_id: req, receiver_id: rec, status: 'pending' }]); };
export const acceptFriendRequest = async (id: string) => { await getSupabaseClient().from('friendships').update({ status: 'accepted' }).eq('id', id); };
export const removeFriendship = async (id: string) => { await getSupabaseClient().from('friendships').delete().eq('id', id); };
export const getActiveMicroItems = async () => { const { data } = await getSupabaseClient().from('micro_items').select('*').eq('status', 'active'); return (data || []).map(m => ({ id: m.id, charityId: m.charity_id, name: m.name, icon: m.icon, price: Number(m.price), color: m.color, is_urgent: m.is_urgent })); };
export const addMicroItem = async (m: any) => { await getSupabaseClient().from('micro_items').insert([{ id: generateUUID(), charity_id: m.charityId, name: m.name, icon: m.icon, price: m.price, color: m.color, is_urgent: m.isUrgent, status: 'active' }]); };

export const rpcProcessTransaction = async (userId: string, amount: number, type: string, description: string, options: any = {}) => {
    const wallet = db.wallets.find(w => w.userId === userId);
    if (!wallet) return;
    const transaction: Transaction = { id: generateUUID(), userId, date: new Date().toISOString(), amount, type: type as any, description, ...options };
    wallet.balance += amount;
    wallet.transactions.unshift(transaction);
    db.transactions.unshift(transaction);
    saveDatabase();
};

export const createOrder = async (b: string, m: string, r: string, items: any[], addr: string) => { await getSupabaseClient().from('orders').insert([{ id: generateUUID(), buyer_id: b, merchant_id: m, receiver_id: r, items, total_amount: items.reduce((s,i)=>s+(i.price*(i.quantity||1)),0), delivery_address: addr, status: 'pending' }]); };
export const getAllSystemOrders = async () => { const { data } = await getSupabaseClient().from('orders').select('*'); return (data || []).map(o => ({ id: o.id, buyerId: o.buyer_id, merchantId: o.merchant_id, receiverId: o.receiver_id, items: o.items, totalAmount: Number(o.total_amount), status: o.status, deliveryAddress: o.delivery_address, createdAt: o.created_at })); };
export const getMerchantOpportunities = async () => { try { const { data } = await getSupabaseClient().from('items').select('*, wishlists(owner_id)').eq('allow_offers', true); return (data || []).map(item => ({ ...mapSupabaseItem(item), ownerId: item.wishlists?.owner_id })); } catch(e) { return []; } };
export const verifyShaba = async (s: string) => ({ ownerName: 'تایید شده توسط بانک' });
export const verifyShahkar = async (uId: string, nCode: string, mob: string) => { 
    await getSupabaseClient().from('users').update({ national_code: nCode, shahkar_verified: true }).eq('id', uId); 
    const idx = db.users.findIndex(u => u.id === uId);
    if(idx !== -1) db.users[idx].shahkarVerified = true;
    saveDatabase();
    return { success: true, message: 'هویت فروشگاه با موفقیت تایید شد.' }; 
};
export const updateUserProfile = async (id: string, u: any) => { await getSupabaseClient().from('users').update({ name: u.name, bio: u.bio, address: u.address, shop_name: u.shopName, national_code: u.nationalCode, shaba: u.shaba, account_holder_name: u.accountHolderName, contact_number: u.contactNumber }).eq('id', id); const fresh = await getSupabaseClient().from('users').select('*').eq('id', id).single(); return {...fresh.data, shopName: fresh.data.shop_name}; };
export const claimItem = async (itemId: string, userId: string) => { await updateItem(itemId, { claimedBy: userId, status: 'claimed' }); };
export const unclaimItem = async (itemId: string) => { await updateItem(itemId, { claimedBy: null, status: 'open' }); };
export const updateList = async (id: string, u: any) => { if (isValidUUID(id)) await getSupabaseClient().from('wishlists').update({ name: u.name, privacy: u.privacy, description: u.description, cover_image: u.coverImage }).eq('id', id); };
export const updateOrderStatus = async (id: string, s: string) => { await getSupabaseClient().from('orders').update({ status: s }).eq('id', id); };
export const searchUsers = async (q: string) => { const { data } = await getSupabaseClient().from('users').select('*').or(`name.ilike."%${q}%",email.ilike."%${q}%",mobile.ilike."%${q}%"`); return (data || []).map(d => ({ ...d, shopName: d.shop_name })); };
export const createNotification = async (n: any) => { await getSupabaseClient().from('notifications').insert([{ user_id: n.userId, message: n.message, type: n.type, related_item_id: n.relatedItemId }]); };
export const markNotificationAsRead = async (id: string) => { await getSupabaseClient().from('notifications').update({ read: true }).eq('id', id); };
export const incrementWishlistView = async (id: string) => {};
export const getGatewaySettings = async () => db.gatewaySettings;
export const updateGatewaySettings = async (s: any) => {};
export const getSmsSettings = async () => db.smsSettings;
export const updateSmsSettings = async (s: any) => {};
export const getTrafficSettings = async () => db.trafficSettings;
export const updateTrafficSettings = async (s: any) => {};
export const getCloudSettings = async () => db.cloudSettings;
export const updateCloudSettings = async (s: any) => {};
export const getAiSettings = async () => db.aiSettings;
export const updateAiSettings = async (s: any) => {};
export const getPartners = async (): Promise<Partner[]> => db.partners || [];
export const addPartner = async (partner: Partner): Promise<Partner[]> => { db.partners.push(partner); saveDatabase(); return db.partners; };
export const deletePartner = async (id: string): Promise<Partner[]> => { db.partners = db.partners.filter(p => p.id !== id); saveDatabase(); return db.partners; };
export const getDatabaseSnapshot = async () => db;
export const restoreDatabase = async (n: any) => true;
export const getMerchantReviews = async (id: string) => [];
export const getExpenses = async () => [];
export const addExpense = async (e: any, u: string) => [];
export const deleteExpense = async (id: string) => [];
export const getStoreClickStats = async () => [];
export const toggleUserKyc = async (id: string) => { await getSupabaseClient().from('users').update({ kyc_verified: true }).eq('id', id); };
export const createCharityUser = async (d: any) => register({ ...d, role: 'charity' });
export const getGiveawayGifts = async () => [];
export const addGiveaway = async (o: string, n: string, d: any) => {};
export const claimGiveaway = async (u: string, g: string) => {};
export const toggleFollow = async (m: string, u: string) => true;
export const submitReview = async (m: string, r: any) => true;
export const getMerchantOrders = async (mId: string) => { try { const { data } = await getSupabaseClient().from('orders').select('*').eq('merchant_id', mId); return (data || []).map(o => ({ id: o.id, buyerId: o.buyer_id, merchantId: o.merchant_id, receiverId: o.receiver_id, items: o.items, totalAmount: Number(o.total_amount), status: o.status, deliveryAddress: o.delivery_address })); } catch(e) { return []; } };
export const updateOrderDelivery = async (id: string, d: any) => { await getSupabaseClient().from('orders').update({ status: 'shipped', delivery_method: d.method, tracking_code: d.trackingCode }).eq('id', id); };
