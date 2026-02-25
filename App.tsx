
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Wishlist, Product, WishlistItem, ProfileType, MicroItem, User, Friendship } from './types';
import { useAppContext } from './AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNavigation from './components/MobileNavigation';
import StoreMarketplace from './components/StoreMarketplace';
import Explore from './components/Explore';
import InstagramProfile from './components/InstagramProfile';
import MerchantDashboard from './components/MerchantDashboard';
import CharityDashboard from './components/CharityDashboard';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import WalletModal from './components/WalletModal'; 
import WishlistComponent from './components/Wishlist';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import EditListModal from './components/EditListModal'; 
import AddListModal from './components/AddListModal';
import EventsModal from './components/EventsModal';
import StoreProfile from './components/StoreProfile'; 
import ConfirmDeleteModal, { ConfirmDeleteListModal } from './components/ConfirmDeleteModal';
import NazarShadiModal from './components/NazarShadiModal';
import CharityMicroDonationModal from './components/CharityMicroDonationModal';
import ProfileShareModal from './components/ProfileShareModal';
import FriendsModal from './components/FriendsModal';
import BuyerOrdersModal from './components/BuyerOrdersModal';
import GuestParticipateModal from './components/GuestParticipateModal';
import * as api from './services/api';

// Added utility function for UUID validation at top level to be accessible in all scopes
const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const SuccessIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ErrorIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" cy="12" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const VerifiedTick = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-3 w-3"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CountdownTimer = ({ durationHours, isUrgent = false }: { durationHours: number, isUrgent?: boolean }) => {
    const [timeLeft, setTimeLeft] = useState({ h: durationHours, m: 45, s: 12 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`flex items-center gap-1 font-mono text-[9px] font-black ${isUrgent ? 'text-red-500' : 'text-slate-400'}`}>
            <ClockIcon className="h-2.5 w-2.5" />
            <span>{String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}</span>
        </div>
    );
};

export const App = () => {
  const {
    currentUser, myWishlists, publicCampaigns, friendsWishlists, notifications, friendships, allUsers, microItems,
    isSyncing, fetchError, isInitialBoot, toast,
    login, logout, refreshData, updateUser,
    addItem, editItem, removeItem, createList, editList, removeList,
    claim, unclaim,
    sendRequest, acceptRequest, declineOrRemove, showToast
  } = useAppContext();

  const onSearchUsers = api.searchUsers;

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'add' | 'activity' | 'profile'>('home');
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<User | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'security' | 'dates'>('profile');
  const [isFinReportOpen, setIsFinReportOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [addListType, setAddListType] = useState<ProfileType>('personal');
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProfileShareOpen, setIsProfileShareOpen] = useState(false);
  const [isNazarShadiOpen, setIsNazarShadiOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [editingList, setEditingList] = useState<Wishlist | null>(null); 
  const [selectedMicroItem, setSelectedMicroItem] = useState<MicroItem | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<{listId: string, item: WishlistItem} | null>(null);
  const [listToDelete, setListToDelete] = useState<Wishlist | null>(null);
  
  const guestParticipateData = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const participateId = params.get('participate');
    if (!participateId) return null;
    
    const allLists = [...myWishlists, ...publicCampaigns, ...friendsWishlists];
    for (const list of allLists) {
        const item = list.items.find(i => i.id === participateId);
        if (item) {
            const owner = allUsers.find(u => u.id === list.ownerId);
            return { item, ownerName: owner?.name || 'یکی از دوستان' };
        }
    }
    return null;
  }, [myWishlists, publicCampaigns, friendsWishlists, allUsers]);

  const guestParticipateItem = guestParticipateData?.item || null;
  const guestParticipateOwner = guestParticipateData?.ownerName || '';

  const isMerchant = currentUser?.role === 'merchant';
  const isCharityUser = currentUser?.role === 'charity';
  const inferredProfileType: ProfileType = isCharityUser ? 'charity' : 'personal';

  const paramsProcessedRef = useRef(false);

  useEffect(() => {
    if (paramsProcessedRef.current) return;
    
    const params = new URLSearchParams(window.location.search);
    const listId = params.get('list');
    const refId = params.get('ref');
    const participateId = params.get('participate');

    if (participateId && guestParticipateItem) {
        paramsProcessedRef.current = true;
    }

    if (listId) {
        setActiveListId(listId);
        setActiveTab('search');
        paramsProcessedRef.current = true;
    }

    if (refId && !currentUser) {
        showToast(`شما با لینک دعوت وارد شدید. برای دریافت هدیه خوش‌آمدگویی ثبت‌نام کنید.`);
        paramsProcessedRef.current = true;
    }
  }, [isInitialBoot, guestParticipateItem, currentUser, showToast]);

  const activeList = useMemo(() => {
    return myWishlists.find(l => l.id === activeListId) || 
           publicCampaigns.find(l => l.id === activeListId) || 
           friendsWishlists.find(l => l.id === activeListId);
  }, [activeListId, myWishlists, publicCampaigns, friendsWishlists]);

  const pendingRequests = useMemo(() => {
    if (!currentUser) return [];
    return friendships
        .filter(f => f.status === 'pending' && f.receiverId === currentUser.id)
        .map(f => {
            const user = allUsers.find(u => u.id === f.requesterId);
            return user ? { user, friendship: f } : null;
        })
        .filter(Boolean) as { user: User, friendship: Friendship }[];
  }, [friendships, allUsers, currentUser]);

  const processedFriends = useMemo(() => {
    if (!currentUser) return [];
    return friendships
        .filter(f => f.status === 'accepted')
        .map(f => {
            const targetId = f.requesterId === currentUser.id ? f.receiverId : f.requesterId;
            const user = allUsers.find(u => u.id === targetId);
            return user ? { user, friendshipId: f.id } : null;
        })
        .filter(Boolean) as { user: User, friendshipId: string }[];
  }, [friendships, allUsers, currentUser]);

  const pendingGiftsCount = useMemo(() => {
    if (!currentUser) return 0;
    return friendsWishlists.reduce((acc, list) => {
      const pendingInList = (list.items || []).filter(
        item => item.claimedBy === currentUser.id && item.status === 'claimed'
      ).length;
      return acc + pendingInList;
    }, 0);
  }, [friendsWishlists, currentUser]);

  const unreadCount = useMemo(() => {
      return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const handleAddToWishlistFromStore = async (product: Product) => {
    if (!currentUser) return;
    
    // پیدا کردن اولین لیست واقعی (ابری) کاربر
    let targetList = myWishlists.find(l => isValidUUID(l.id));
    let targetListId = targetList?.id || null;

    try {
        // اگر کاربر هیچ لیست ابری واقعی ندارد، یکی می‌سازیم
        if (!targetListId) {
            console.log("No cloud list found, creating one...");
            targetListId = await createList({ name: 'آرزوهای من', privacy: 'friends' }, 'personal');
        }

        if (targetListId && isValidUUID(targetListId)) {
            await addItem(targetListId, {
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                link: product.instagramLink || product.externalLink || '',
                purchasedFrom: product.merchantId || '',
                isGroupGift: false,
                allowOffers: true
            });
            
            // هدایت کاربر به پروفایل برای دیدن نتیجه
            setActiveTab('profile');
            setActiveListId(targetListId);
            setSelectedMerchant(null);
            showToast('کالا با موفقیت به لیست آرزوهای شما اضافه شد');
            
            // ریفرش داده‌ها به صورت اجباری برای اطمینان از نمایش آیتم جدید
            await refreshData(true);
        } else {
            showToast('خطا: لیست معتبری یافت نشد.', 'error');
        }
    } catch (error) {
        console.error("Store add error:", error);
        showToast('خطا در ثبت آرزو', 'error');
    }
  };

  if (!currentUser && !guestParticipateItem) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-slate-950 flex flex-col justify-center items-center p-4">
        {isInitialBoot && (
           <div className="fixed inset-0 z-[200] bg-[#FDFBF9] dark:bg-slate-950 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-rose-600/20 border-t-rose-600 rounded-full animate-spin"></div>
           </div>
        )}
        <Login 
          onLogin={async (c) => { 
              const user = await login(c); 
              if(user.role === 'merchant') setActiveTab('home'); 
              else setActiveTab('profile'); 
          }} 
          onRegister={api.register} 
          onCancel={() => {}} 
          onSocialLogin={() => {}} 
          onForgotPasswordClick={() => {}} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#FDFBF9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans" dir="rtl">
      {isSyncing && <div className="loading-progress-bar"></div>}

      {toast && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-max max-w-[90vw] animate-toast">
              <div className={`px-5 py-3.5 rounded-[1.25rem] shadow-[0_25px_60px_rgba(0,0,0,0.18)] flex items-center gap-4 border border-white/40 dark:border-white/10 backdrop-blur-3xl transition-all ${
                  toast.type === 'success' ? 'bg-slate-900/90 text-white' : 'bg-rose-600 text-white'
              }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-emerald-5/20 text-emerald-400' : 'bg-white/20'}`}>
                      {toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                  </div>
                  <span className="font-bold text-xs sm:text-sm tracking-tight">{toast.message}</span>
              </div>
          </div>
      )}

      {currentUser && !isMerchant && (
        <Sidebar 
            wishlists={myWishlists} 
            activeListId={activeListId} 
            onSelectList={setActiveListId} 
            onAddNewList={() => { setAddListType(inferredProfileType); setIsAddListOpen(true); }} 
            profileType={inferredProfileType} 
            mainView="lists" onSetMainView={() => {}} 
            lastWishlistInteraction={{}} friends={processedFriends.map(f => f.user)} upcomingBirthdays={[]} userView="owner" 
            onDeleteList={(id) => setListToDelete(myWishlists.find(l => l.id === id) || null)} 
            currentUser={currentUser} 
        />
      )}
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {currentUser && !isMerchant && (
            <Header 
                currentUser={currentUser} 
                onLoginClick={() => {}} 
                onFinReportClick={() => setIsFinReportOpen(true)} 
                onSettingsClick={() => { setSettingsTab('profile'); setIsSettingsOpen(true); }}
                onRefresh={refreshData}
                notifications={notifications} 
                isSyncing={isSyncing}
            />
        )}
        
        <div className="flex-1 overflow-y-auto relative">
          {!currentUser ? (
              <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400 font-bold">در حال بارگذاری مشارکت مهمان...</p>
              </div>
          ) : isMerchant ? (
              <MerchantDashboard 
                currentUser={currentUser} 
                onAddProduct={async (p) => { await api.addProduct(p, currentUser.id); }} 
                onLogout={logout}
                onRefreshData={refreshData}
                isSyncing={isSyncing}
                friendships={friendships}
                allUsers={allUsers}
                processedFriends={processedFriends}
                pendingRequests={pendingRequests}
                acceptRequest={acceptRequest}
                sendRequest={sendRequest}
                declineOrRemove={declineOrRemove}
                onSearchUsers={onSearchUsers}
              />
          ) : selectedMerchant ? (
              <StoreProfile currentUser={currentUser} merchant={selectedMerchant} onBack={() => setSelectedMerchant(null)} onAddToWishlist={handleAddToWishlistFromStore} userWishlists={myWishlists} />
          ) : activeListId && activeList ? (
              <WishlistComponent 
                  wishlist={activeList} 
                  userView={activeList.ownerId === currentUser.id ? 'owner' : 'friend'} 
                  onBack={() => setActiveListId(null)} 
                  currentUser={currentUser} 
                  users={allUsers} 
                  onUpdate={refreshData} 
                  onAddItem={() => setIsAddItemOpen(true)} 
                  onDeleteItem={(lId, itemId) => {
                      const item = activeList.items.find(i => i.id === itemId);
                      if (item) setItemToDelete({ listId: lId, item });
                  }} 
                  onEditItem={setEditingItem} 
                  onEditList={setEditingList} 
                  onDeleteList={() => setListToDelete(activeList)}
                  onClaimItem={(_, id) => claim(id)} 
                  onUnclaimItem={(_, id) => unclaim(id)} 
                  onPayClick={() => {}} 
                  onInitiateContributionPayment={() => {}} 
                  onContinueShopping={() => {}} 
                  onRecipientAction={() => {}} 
                  onUpdateListPrivacy={editList} 
                  onRequestAuth={() => {}} 
                  profileType={activeList.type} 
              />
          ) : (
            <div className="animate-fade-in h-full">
              {activeTab === 'home' && <StoreMarketplace currentUser={currentUser} merchants={[]} onSelectMerchant={setSelectedMerchant} onAddToWishlist={() => {}} />}
              {activeTab === 'search' && <Explore onSelectWishlist={setActiveListId} currentUser={currentUser} allWishlists={myWishlists} allUsers={allUsers} onAddToWishlist={handleAddToWishlistFromStore} onAddFromLink={async (u) => { if(myWishlists[0]) await addItem(myWishlists[0].id, {link: u, name: 'جدید'}); }} />}
              {activeTab === 'activity' && (
                  <div className="p-6 space-y-10 animate-fade-in pb-24">
                      <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 dark:text-white border-r-4 border-sky-500 pr-3">🍦 سهم لبخند</h2>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 mr-4">با مبالغ کوچک، شادی‌های بزرگ بسازید</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {microItems.map(item => {
                                const charity = allUsers.find(u => u.id === item.charityId);
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => setSelectedMicroItem(item)}
                                        className="flex flex-col items-center gap-3 p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-sky-400 active:scale-95 cursor-pointer group relative overflow-hidden"
                                    >
                                        {item.is_urgent && (
                                            <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-br-2xl shadow-sm z-10">فوری</div>
                                        )}
                                        <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{item.icon}</span>
                                        <div className="text-center w-full">
                                            <p className="text-[11px] font-black text-slate-800 dark:text-white truncate px-1">{item.name}</p>
                                            
                                            <div className="flex items-center justify-center gap-1 mt-1 mb-2">
                                                <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[60px]">{charity?.name || 'خیریه'}</span>
                                                <VerifiedTick />
                                            </div>

                                            <div className={`inline-block px-3 py-1 rounded-xl font-black text-[10px] ${item.color} bg-opacity-20`}>
                                                {item.price.toLocaleString('fa-IR')} ت
                                            </div>

                                            {item.is_urgent && (
                                                <div className="mt-2 flex justify-center">
                                                    <CountdownTimer durationHours={2} isUrgent={true} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white border-r-4 border-rose-500 pr-3 mb-6">پویش‌های فعال خیریه</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {publicCampaigns.filter(c => c.type === 'charity').map(campaign => {
                                const owner = allUsers.find(u => u.id === campaign.ownerId);
                                return (
                                    <div key={campaign.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] border border-slate-200 dark:border-800 shadow-sm flex items-center justify-between group hover:border-pink-500 transition-all cursor-pointer" onClick={() => setActiveListId(campaign.id)}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">{campaign.coverImage && <img src={campaign.coverImage} className="w-full h-full object-cover" />}</div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white">{campaign.name}</h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{owner?.name || 'موسسه خیریه'}</span>
                                                    <VerifiedTick />
                                                </div>
                                                <div className="mt-1">
                                                    <CountdownTimer durationHours={96} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] font-black text-pink-600 bg-pink-50 px-4 py-2 rounded-xl mb-1">مشارکت</span>
                                            <span className="text-[8px] text-slate-400 font-bold mr-1">۴ روز مانده</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                      </section>
                  </div>
              )}
              {activeTab === 'profile' && (
                    isCharityUser ? (
                        <CharityDashboard 
                            wishlists={myWishlists} 
                            users={allUsers} 
                            onViewList={setActiveListId} 
                            currentUser={currentUser} 
                            onLogout={logout}
                        />
                    ) : (
                        <InstagramProfile 
                            user={currentUser} wishlists={myWishlists} friendsLists={friendsWishlists} charityLists={[]} 
                            wallet={currentUser.wallet || { balance: 0, transactions: [], userId: currentUser.id, id: 'w1' }} 
                            onSelectList={setActiveListId} onEditProfile={() => { setSettingsTab('profile'); setIsSettingsOpen(true); }} 
                            onSettings={() => { setSettingsTab('security'); setIsSettingsOpen(true); }} onWallet={() => setIsFinReportOpen(true)} 
                            onLogout={logout} 
                            onAddNewList={() => setIsAddItemOpen(true)} 
                            onShareProfile={() => setIsProfileShareOpen(true)}
                            profileType={inferredProfileType} onOpenFriends={() => setIsFriendsOpen(true)} 
                            friendsCount={processedFriends.length} pendingRequestCount={pendingRequests.length} 
                            unreadNotificationCount={unreadCount}
                            onGoToActivity={() => setIsEventsOpen(true)} friends={processedFriends.map(f => f.user)} 
                            allUsers={allUsers} onManageDates={() => { setSettingsTab('dates'); setIsSettingsOpen(true); }} 
                            onOpenOrders={() => setIsOrdersOpen(true)}
                            pendingGiftsCount={pendingGiftsCount}
                        />
                    )
              )}
            </div>
          )}
        </div>
        {currentUser && !isMerchant && (
            <MobileNavigation 
                activeTab={activeTab} 
                onNavigate={(tab) => { setActiveTab(tab); setActiveListId(null); setSelectedMerchant(null); }} 
                onAddClick={() => { setAddListType(inferredProfileType); setIsAddListOpen(true); }} 
                unreadCount={unreadCount} currentUser={currentUser} 
            />
        )}
      </div>

      {currentUser && (
        <>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentUser={currentUser} onUpdateUserProfile={updateUser} initialTab={settingsTab} onLogout={logout} />
            <WalletModal isOpen={isFinReportOpen} onClose={() => setIsFinReportOpen(false)} wallet={currentUser.wallet || { balance: 0, transactions: [], userId: currentUser.id, id: 'w1' }} activeVirtualCards={[]} onShowCardDetails={() => {}} onCreateNewCard={() => {}} currentUser={currentUser} onWithdraw={async () => {}} />
            <EventsModal isOpen={isEventsOpen} onClose={() => setIsEventsOpen(false)} notifications={notifications} upcomingBirthdays={[]} onMarkAsRead={api.markNotificationAsRead} transactions={[]} onRefresh={refreshData} onAcceptFriend={acceptRequest} onRejectFriend={declineOrRemove} />
            <AddItemModal 
                isOpen={isAddItemOpen} 
                onClose={() => setIsAddItemOpen(false)} 
                onAddItem={async (d) => { 
                    let targetListId = activeListId;
                    if (!targetListId) {
                        const personalList = myWishlists.find(l => l.type === 'personal' && isValidUUID(l.id));
                        if (personalList) {
                            targetListId = personalList.id;
                        } else {
                            targetListId = await createList({ name: 'آرزوهای من', privacy: 'friends' }, 'personal');
                        }
                    }
                    if (targetListId) {
                        await addItem(targetListId, d); 
                        await refreshData(true);
                    }
                }} 
                onOpenCameraScanner={() => {}} 
                onClearInitialData={() => {}} 
                onNavigateTab={(tab) => { setActiveTab(tab); setIsAddItemOpen(false); setActiveListId(null); }} 
            />
            <EditItemModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} onSaveItem={(i) => { editItem(i.id, i); setEditingItem(null); }} item={editingItem} />
            <EditListModal isOpen={!!editingList} onClose={() => setEditingList(null)} onSave={async (d) => { if(editingList) await editList(editingList.id, d); setEditingList(null); }} wishlist={editingList} />
            <AddListModal isOpen={isAddListOpen} onClose={() => setIsAddListOpen(false)} onAddList={async (d, type) => { const id = await createList(d, type || addListType); if(id) setActiveListId(id); setIsAddListOpen(false); }} profileType={addListType} currentUser={currentUser} onNavigateTab={(tab) => { setActiveTab(tab); setIsAddItemOpen(false); setActiveListId(null); }} onSearchUsers={onSearchUsers} />
            <ProfileShareModal isOpen={isProfileShareOpen} onClose={() => setIsProfileShareOpen(false)} user={currentUser} />
            <ConfirmDeleteModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => itemToDelete && removeItem(itemToDelete.listId, itemToDelete.item.id).then(() => setItemToDelete(null))} itemName={itemToDelete?.item.name || ''} />
            <ConfirmDeleteListModal isOpen={!!listToDelete} onClose={() => setListToDelete(null)} onConfirm={() => listToDelete && removeList(listToDelete.id).then(() => { setListToDelete(null); setActiveListId(null); })} listName={listToDelete?.name || ''} />
            <NazarShadiModal isOpen={isNazarShadiOpen} onClose={() => setIsNazarShadiOpen(false)} items={microItems} onItemClick={setSelectedMicroItem} allUsers={allUsers} />
            <CharityMicroDonationModal isOpen={!!selectedMicroItem} onClose={() => setSelectedMicroItem(undefined)} onDonate={() => {}} initialItem={selectedMicroItem} />
            <FriendsModal isOpen={isFriendsOpen} onClose={() => setIsFriendsOpen(false)} currentUser={currentUser} allUsers={allUsers} friendships={friendships} friends={processedFriends} pendingRequests={pendingRequests} onSendRequest={sendRequest} onAcceptRequest={acceptRequest} onDeclineOrRemove={declineOrRemove} onSearchUsers={onSearchUsers} />
            <BuyerOrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} currentUser={currentUser} orders={[]} />
        </>
      )}

      {guestParticipateItem && (
          <GuestParticipateModal 
            isOpen={!!guestParticipateItem} 
            onClose={() => setGuestParticipateItem(null)} 
            item={guestParticipateItem} 
            ownerName={guestParticipateOwner} 
            onSuccess={(amt, name) => {
                showToast(`مشارکت ${amt.toLocaleString('fa-IR')} تومانی شما به نام ${name || 'ناشناس'} ثبت شد.`);
                setGuestParticipateItem(null);
            }} 
          />
      )}
    </div>
  );
};
