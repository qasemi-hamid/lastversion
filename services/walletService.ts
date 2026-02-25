
import { db, saveDatabase } from './database';
import { Wallet, TransactionType, Notification } from '../types';
import { getSupabaseClient } from './supabaseClient';
import { isRealUser, rpcProcessTransaction } from './api';

/**
 * Retrieves a user's wallet. If it doesn't exist, creates one.
 * @param userId The ID of the user.
 * @returns The user's wallet.
 */
export const getOrCreateWallet = (userId: string): Wallet => {
    let wallet = db.wallets.find(w => w.userId === userId);
    if (!wallet) {
        wallet = {
            id: `wallet-${userId}`,
            userId,
            balance: 0,
            transactions: [],
        };
        db.wallets.push(wallet);
        saveDatabase();
    }
    return wallet;
};

/**
 * Adds a transaction to a user's wallet SECURELY via server-side simulation.
 * 
 * SECURITY UPDATE:
 * Removed `wallet.balance += amount` logic. Now delegates to `rpcProcessTransaction` in api.ts
 * which simulates a secure Server/Database operation.
 */
export const addTransaction = async (
    userId: string, 
    amount: number, 
    type: TransactionType, 
    description: string, 
    options: { 
        updateBalance?: boolean; 
        trackingCode?: string; 
        recipientName?: string; 
        recipientShaba?: string; 
    } = {}
) => {
    const { 
        updateBalance = true, 
        trackingCode = `TXN-${Date.now()}`, 
        recipientName, 
        recipientShaba 
    } = options;

    if (updateBalance) {
        // Secure server-side processing
        await rpcProcessTransaction(userId, amount, type, description, {
            trackingCode,
            recipientName,
            recipientShaba
        });
    } else {
        // Log-only transaction (e.g., historical record for payout without double-counting balance)
        // Note: Payout logic usually debits balance via RPC, but if we just want a log record:
        const wallet = getOrCreateWallet(userId);
        const transaction = {
            id: `txn-log-${Date.now()}-${Math.random()}`,
            userId: userId,
            date: new Date().toISOString(),
            amount,
            type,
            description,
            trackingCode,
            recipientName,
            recipientShaba,
        };
        wallet.transactions.unshift(transaction);
        db.transactions.unshift(transaction);
        saveDatabase();
    }
};

/**
 * Logs a system event to the global database ledger without affecting user wallets.
 * Used for tracking registrations, charity creations, etc.
 * @param type The type of system event.
 * @param description A description of the event.
 * @param userId Optional user ID associated with the event.
 */
export const logSystemEvent = (type: TransactionType, description: string, userId?: string) => {
    const transaction = {
        id: `sys-${Date.now()}-${Math.random()}`,
        userId: userId,
        date: new Date().toISOString(),
        amount: 0,
        type,
        description,
        trackingCode: `SYS-${Date.now()}`,
    };
    db.transactions.unshift(transaction);
    saveDatabase();
};

/**
 * Processes a payout for a fully funded gift.
 * This simulates the actual bank transfer out of the system.
 */
export const processPayout = (
    ownerId: string,
    ownerName: string,
    ownerShaba: string,
    totalAmount: number,
    giftName: string,
    listName: string,
    listId: string,
    itemId: string
): Notification => {
    const description = `واریز وجه هدیه "${giftName}" به حساب بانکی`;
    const trackingCode = `GFT-PAY-${Date.now()}`;
    
    // Debit the wallet securely via RPC to reflect money leaving the system
    // Note: Previous logic might have been "Log only", but physically money leaves.
    // If the money was accumulated in the wallet, we must debit it. 
    // Assuming 'funded' status means money is in wallet.
    
    // However, if the requirement is just to Notify and Log without changing current balance 
    // (maybe because balance was already moved or just tracking), we use updateBalance: false.
    // Standard flow: Contributions add to balance. Payout removes from balance.
    // We will assume Payout removes balance here for strict accounting.
    
    // addTransaction(ownerId, -totalAmount, 'payout', description, { ... }) // This would be correct for accounting
    
    // For legacy compatibility with UI flow (where payout might be manual or just a notification):
    // We'll keep it as a log entry for now, but in a real system, this MUST debit.
    addTransaction(ownerId, -totalAmount, 'payout', description, { 
        updateBalance: true, // changed to true for correctness in accounting
        trackingCode,
        recipientName: ownerName,
        recipientShaba: ownerShaba,
    });

    const newNotification: Notification = {
        id: `notif-payout-${Date.now()}`,
        message: `مبلغ ${totalAmount.toLocaleString('fa-IR')} تومان برای هدیه "${giftName}" با موفقیت به حساب بانکی شما واریز شد.`,
        type: 'payout_complete',
        read: false,
        createdAt: new Date().toISOString(),
        relatedListId: listId,
        relatedItemId: itemId,
    };
    db.notifications.unshift(newNotification);
    
    if (isRealUser(ownerId)) {
        const supabase = getSupabaseClient();
        supabase.from('notifications').insert({
            user_id: ownerId,
            message: newNotification.message,
            type: newNotification.type,
            related_list_id: listId,
            related_item_id: itemId
        }).then();
    }

    saveDatabase();
    return newNotification;
};


/**
 * Processes refunds for a gift that was not fully funded.
 * Each contributor gets their contributed amount back in their wallet.
 */
export const processRefunds = (contributions: { userId: string; amount: number }[], giftName: string, listName: string): string[] => {
    const refundedUserIds: string[] = [];
    contributions.forEach(({ userId, amount }) => {
        const description = `بازپرداخت مشارکت در هدیه "${giftName}" (لیست: ${listName})`;
        // Securely credit back the user
        addTransaction(userId, amount, 'refund', description, { 
            updateBalance: true,
            trackingCode: `GFT-RFD-${Date.now()}` 
        });
        if (!refundedUserIds.includes(userId)) {
            refundedUserIds.push(userId);
        }
    });
    return refundedUserIds;
};
