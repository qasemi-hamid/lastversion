
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, Wishlist, Notification, Friendship, MicroItem, WishlistItem, ProfileType } from './types';
import * as api from './services/api';
import { db } from './services/database';

interface AppContextType {
  currentUser: User | null;
  myWishlists: Wishlist[];
  publicCampaigns: Wishlist[];
  friendsWishlists: Wishlist[];
  notifications: Notification[];
  friendships: Friendship[];
  allUsers: User[];
  microItems: MicroItem[];
  isSyncing: boolean;
  fetchError: boolean;
  isInitialBoot: boolean;
  toast: { message: string, type: 'success' | 'error' } | null;
  
  login: (creds: any) => Promise<User>;
  logout: () => void;
  refreshData: (force?: boolean) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error') => void;
  
  addItem: (listId: string, itemData: any) => Promise<void>;
  editItem: (itemId: string, updates: any) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  createList: (details: any, type: ProfileType) => Promise<string>;
  editList: (listId: string, updates: any) => Promise<void>;
  removeList: (listId: string) => Promise<void>;
  
  claim: (itemId: string) => Promise<void>;
  unclaim: (itemId: string) => Promise<void>;
  
  sendRequest: (receiverId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineOrRemove: (requestId: string) => Promise<void>;
  addMicroItem: (item: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [myWishlists, setMyWishlists] = useState<Wishlist[]>([]);
  const [publicCampaigns, setPublicCampaigns] = useState<Wishlist[]>([]);
  const [friendsWishlists, setFriendsWishlists] = useState<Wishlist[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [microItems, setMicroItems] = useState<MicroItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isInitialBoot, setIsInitialBoot] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const lastFetchRef = useRef<number>(0);
  const isInitialBootRef = useRef<boolean>(true);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500); 
  }, []);

  const refreshData = useCallback(async (force = false) => {
    const now = Date.now();
    // Use a local check instead of relying on isSyncing in dependencies to avoid loops
    // Increased throttle to 5s for better stability
    if (!force && now - lastFetchRef.current < 5000 && !isInitialBootRef.current) return;
    
    setIsSyncing(true);
    lastFetchRef.current = now;
    setFetchError(false);

    try {
      const users = await api.getAllUsersForAdmin();
      if (!users) throw new Error("Failed to fetch users");
      
      setAllUsers(users);
      
      const micros = await api.getActiveMicroItems();
      setMicroItems(micros || []);

      if (currentUser) {
          const fresh = users.find(u => u.id === currentUser.id);
          if (fresh) setCurrentUser(fresh);
      }
      
      const results = await Promise.allSettled([
        currentUser ? api.getMyWishlists(currentUser.id) : Promise.resolve([]),
        api.getPublicCampaigns(),
        currentUser ? api.getFriendships(currentUser.id) : Promise.resolve([])
      ]);
      
      if (results[0].status === 'fulfilled') setMyWishlists(results[0].value || []);
      if (results[1].status === 'fulfilled') setPublicCampaigns(results[1].value || []);
      if (currentUser && results[2].status === 'fulfilled') {
        const fs = results[2].value || [];
        setFriendships(fs);
        const fIds = fs.filter(f => f.status === 'accepted').map(f => f.requesterId === currentUser.id ? f.receiverId : f.requesterId);
        if (fIds.length > 0) {
            api.getWishlistsByOwners(fIds).then(fw => setFriendsWishlists(fw || [])).catch(() => {});
        }
      }
    } catch (err) { 
      setFetchError(true); 
    } finally { 
      setIsSyncing(false); 
      setIsInitialBoot(false); 
      isInitialBootRef.current = false;
    }
  }, [currentUser?.id]); // Removed isSyncing from dependencies to break the loop

  useEffect(() => { refreshData(); }, [currentUser?.id, refreshData]);

  const login = async (creds: any): Promise<User> => {
    setIsSyncing(true);
    try {
      const user = creds.directUser || await api.login(creds);
      setCurrentUser(user);
      showToast(`خوش آمدی ${user.name} عزیز!`);
      return user;
    } catch (err: any) {
      showToast(err.message || 'ورود ناموفق بود.', 'error');
      throw err;
    } finally { setIsSyncing(false); }
  };

  const logout = () => { setCurrentUser(null); setMyWishlists([]); setFriendsWishlists([]); };

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const updated = await api.updateUserProfile(currentUser.id, updates);
      setCurrentUser(updated);
      showToast('تغییرات با موفقیت ذخیره شد');
    } catch (err) { showToast('خطا در بروزرسانی پروفایل', 'error'); } finally { setIsSyncing(false); }
  };

  const addItem = async (listId: string, itemData: any) => {
    setIsSyncing(true);
    try {
      await api.addItem(listId, itemData);
      // RELY ON REFRESH: Instead of manual setMyWishlists, fetch clean state from API
      await refreshData(true);
      showToast('آیتم با موفقیت ثبت شد');
    } catch (err) { showToast('خطا در ثبت آیتم', 'error'); } finally { setIsSyncing(false); }
  };

  const editItem = async (itemId: string, updates: any) => {
    setIsSyncing(true);
    try { await api.updateItem(itemId, updates); showToast('تغییرات ذخیره شد'); await refreshData(true); } catch (err) { showToast('خطا در بروزرسانی', 'error'); } finally { setIsSyncing(false); }
  };

  const removeItem = async (listId: string, itemId: string) => {
    setIsSyncing(true);
    try { await api.deleteItem(listId, itemId); showToast('آیتم حذف شد'); await refreshData(true); } catch (err) { showToast('خطا در حذف', 'error'); } finally { setIsSyncing(false); }
  };

  const createList = async (details: any, type: ProfileType) => {
    if (!currentUser) return '';
    setIsSyncing(true);
    try {
      const newList = await api.addList(currentUser.id, details, type);
      if (details.items && details.items.length > 0) {
          for (const templateItem of details.items) {
              await api.addItem(newList.id, {
                  ...templateItem,
                  status: 'open',
                  contributions: []
              });
          }
      }
      await refreshData(true);
      showToast('کمپین جدید با موفقیت ایجاد شد');
      return newList.id;
    } catch (err) { 
      showToast('خطا در ایجاد کمپین', 'error'); 
      return ''; 
    } finally { 
      setIsSyncing(false); 
    }
  };

  const editList = async (listId: string, updates: any) => {
    setIsSyncing(true);
    try { await api.updateList(listId, updates); showToast('لیست بروزرسانی شد'); await refreshData(true); } catch (err) { showToast('خطا در بروزرسانی لیست', 'error'); } finally { setIsSyncing(false); }
  };

  const removeList = async (listId: string) => {
    setIsSyncing(true);
    try { await api.deleteList(listId); showToast('لیست حذف شد'); await refreshData(true); } catch (err) { showToast('خطا در حذف لیست', 'error'); } finally { setIsSyncing(false); }
  };

  const claim = async (itemId: string) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try { await api.claimItem(itemId, currentUser.id); showToast('هدیه رزرو شد'); await refreshData(true); } catch (err) { showToast('خطا در رزرو', 'error'); } finally { setIsSyncing(false); }
  };

  const unclaim = async (itemId: string) => {
    setIsSyncing(true);
    try { await api.unclaimItem(itemId); showToast('رزرو لغو شد'); await refreshData(true); } catch (err) { showToast('خطا در لغو رزرو', 'error'); } finally { setIsSyncing(false); }
  };

  const sendRequest = async (receiverId: string) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try { await api.sendFriendRequest(currentUser.id, receiverId); showToast('درخواست ارسال شد'); await refreshData(true); } catch (err) { showToast('خطا در ارسال درخواست', 'error'); } finally { setIsSyncing(false); }
  };

  const acceptRequest = async (requestId: string) => {
    setIsSyncing(true);
    try { await api.acceptFriendRequest(requestId); showToast('شما با هم دوست شدید'); await refreshData(true); } catch (err) { showToast('خطا در تایید درخواست', 'error'); } finally { setIsSyncing(false); }
  };

  const declineOrRemove = async (requestId: string) => {
    setIsSyncing(true);
    try { await api.removeFriendship(requestId); showToast('عملیات انجام شد'); await refreshData(true); } catch (err) { showToast('خطا در انجام عملیات', 'error'); } finally { setIsSyncing(false); }
  };

  const addMicroItem = async (item: any) => {
    setIsSyncing(true);
    try {
      await api.addMicroItem(item);
      await refreshData(true);
      showToast('آیتم سهم لبخند با موفقیت ثبت شد');
    } catch (err) {
      showToast('خطا در ثبت آیتم', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const value = {
    currentUser, myWishlists, publicCampaigns, friendsWishlists, notifications, friendships, allUsers, microItems,
    isSyncing, fetchError, isInitialBoot, toast,
    login, logout, refreshData, updateUser, showToast,
    addItem, editItem, removeItem, createList, editList, removeList,
    claim, unclaim, sendRequest, acceptRequest, declineOrRemove, addMicroItem
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
