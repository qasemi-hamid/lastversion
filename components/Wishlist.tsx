
import React, { useState, useEffect, useMemo } from 'react';
import { Wishlist as WishlistType, WishlistItem, User, UserView, ProfileType, Offer, WishlistPrivacy } from '../types';
import WishlistItemComponent from './WishlistItem';
import ShareModal from './ShareModal';
import ClaimGiftFlowModal from './ClaimGiftFlowModal'; // Import New Modal
import { WishlistItemSkeleton } from './Skeleton';
import * as api from '../services/api';

interface WishlistProps {
  wishlist: WishlistType;
  userView: UserView;
  onUnclaimItem: (listId: string, itemId: string) => void;
  onClaimItem: (listId: string, itemId: string) => void;
  onContinueShopping: (listId: string, itemId: string) => void;
  onPayClick: (listId: string, item: WishlistItem) => void;
  onInitiateContributionPayment: (item: WishlistItem, amount: number) => void;
  onAddItem: () => void;
  onEditItem: (item: WishlistItem) => void;
  onEditList: (wishlist: WishlistType) => void; 
  onDeleteItem: (listId: string, itemId: string) => void;
  onDeleteList?: (listId: string) => void;
  onRecipientAction: (item: WishlistItem) => void;
  profileType: ProfileType;
  currentUser: User | null;
  users: User[];
  onRequestAuth: () => void;
  onUpdateListPrivacy: (listId: string, privacy: WishlistPrivacy) => void;
  onBack: () => void;
  offers?: Offer[];
  onUpdate: () => void;
}

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const VerifiedBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;

const Wishlist: React.FC<WishlistProps> = ({
  wishlist, userView, onUnclaimItem, onAddItem, onEditItem, onEditList, onDeleteItem, onDeleteList, currentUser, users, onBack, onUpdate
}) => {
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [claimingItem, setClaimingItem] = useState<WishlistItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingContent(false), 800);
    if (userView === 'friend') {
        api.incrementWishlistView(wishlist.id).catch();
    }
    return () => clearTimeout(timer);
  }, [wishlist.id, userView]);

  const isOwner = currentUser && wishlist && currentUser.id === wishlist.ownerId;
  const beneficiary = wishlist.beneficiary;

  // پیدا کردن صاحب لیست برای نمایش نام صحیح
  const owner = useMemo(() => {
    return users.find(u => u.id === wishlist.ownerId);
  }, [users, wishlist.ownerId]);

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20 overflow-y-auto">
        <header className="relative flex-shrink-0">
            <div className="h-56 sm:h-64 w-full overflow-hidden relative bg-slate-900">
                 {wishlist.coverImage ? (
                     <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${wishlist.coverImage}')` }}></div>
                 ) : (
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-rose-600 to-amber-500">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div className="w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full animate-pulse"></div>
                        </div>
                     </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-slate-50 dark:to-slate-950"></div>
                 <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                     <button onClick={onBack} className="bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-full text-white hover:bg-white/30 transition-all active:scale-95"><ArrowRightIcon /></button>
                     <div className="flex gap-2">
                        {isOwner && (
                            <>
                                <button onClick={() => onEditList(wishlist)} className="bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-full text-white hover:bg-white/40 transition-all active:scale-95"><EditIcon /></button>
                                <button onClick={() => onDeleteList?.(wishlist.id)} className="bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-full text-white hover:bg-rose-500 transition-all"><TrashIcon /></button>
                            </>
                        )}
                        <button onClick={() => setShareModalOpen(true)} className="bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-full text-white hover:bg-white/30 transition-all"><ShareIcon /></button>
                     </div>
                 </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50 dark:bg-slate-950 rounded-t-[50%_100px] transform scale-x-150 translate-y-1"></div>
        </header>

        <div className="px-4 sm:px-6 relative z-10 -mt-20 mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                                {userView === 'friend' && owner 
                                    ? `آرزوهای ${owner.name}` 
                                    : wishlist.name}
                            </h2>
                            {/* نشانگر تعداد آرزوها */}
                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-xl text-[10px] font-black border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                {wishlist.items.length.toLocaleString('fa-IR')} آرزو
                            </span>
                            {wishlist.type === 'charity' && <VerifiedBadge />}
                            {userView === 'friend' && (
                                <span className="bg-rose-50 text-rose-600 dark:bg-rose-900/20 text-[9px] font-black px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-800">نمای دوست</span>
                            )}
                        </div>
                        {wishlist.description && <p className="text-sm text-slate-500 dark:text-slate-400">{wishlist.description}</p>}
                        
                        {beneficiary && beneficiary.isThirdParty && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-black border border-indigo-100 dark:border-indigo-800">
                                    🎁 هدیه برای: {beneficiary.name}
                                </span>
                                {beneficiary.giftType === 'physical' && beneficiary.address && (
                                    <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-100 dark:border-emerald-800 truncate max-w-[200px]">
                                        📍 ارسال به: {beneficiary.address}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {isOwner && (
                        <button onClick={onAddItem} className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                            <PlusIcon /> افزودن آیتم
                        </button>
                    )}
                </div>
            </div>
        </div>

        <div className="px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-4">
          {isLoadingContent ? (
              Array.from({ length: 3 }).map((_, i) => <WishlistItemSkeleton key={i} />)
          ) : wishlist.items.length > 0 ? (
            wishlist.items.map((item) => (
              <WishlistItemComponent
                key={item.id}
                item={item}
                userView={userView}
                onUnclaimItem={() => onUnclaimItem(wishlist.id, item.id)}
                onClaimItem={(item) => setClaimingItem(item)}
                onContinueShopping={() => {}}
                onPayClick={() => {}}
                onContributeClick={() => {}}
                onEditItem={onEditItem}
                onDeleteItem={(itemId) => onDeleteItem(wishlist.id, itemId)}
                onRecipientAction={() => {}}
                profileType={wishlist.type}
                currentUser={currentUser}
                users={users}
                beneficiary={wishlist.beneficiary}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
              این لیست در حال حاضر خالی است.
            </div>
          )}
        </div>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} wishlist={wishlist} profileType={wishlist.type} />
      {claimingItem && currentUser && (
        <ClaimGiftFlowModal 
            isOpen={!!claimingItem} 
            onClose={() => setClaimingItem(null)} 
            item={claimingItem} 
            wishlist={wishlist} 
            currentUser={currentUser} 
            onSuccess={onUpdate}
        />
      )}
    </main>
  );
};

export default Wishlist;
