
import React from 'react';

const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-slate-700/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
);

export const WishlistItemSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-4 sm:p-6 mb-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                <Shimmer />
            </div>
            <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3 relative overflow-hidden"><Shimmer /></div>
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-24 relative overflow-hidden"><Shimmer /></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-20 relative overflow-hidden"><Shimmer /></div>
                </div>
                <div className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl relative overflow-hidden">
                    <Shimmer />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="flex -space-x-2 space-x-reverse">
                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900" />)}
                    </div>
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl w-32 relative overflow-hidden"><Shimmer /></div>
                </div>
            </div>
        </div>
    </div>
);

export const StoreCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 p-4 relative shadow-sm">
        <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-4 relative overflow-hidden"><Shimmer /></div>
        <div className="w-16 h-16 mx-auto -mt-12 rounded-2xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 mb-3 relative overflow-hidden"><Shimmer /></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4 mx-auto mb-2 relative overflow-hidden"><Shimmer /></div>
        <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded w-1/2 mx-auto relative overflow-hidden"><Shimmer /></div>
    </div>
);

export const SidebarListSkeleton = () => (
    <div className="space-y-3 px-2">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 p-2 relative overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 relative overflow-hidden"><Shimmer /></div>
                <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700 rounded relative overflow-hidden"><Shimmer /></div>
                <div className="w-6 h-4 bg-slate-50 dark:bg-slate-800 rounded-full relative overflow-hidden"><Shimmer /></div>
            </div>
        ))}
    </div>
);

export const ExploreProductSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 p-3 flex flex-col gap-3">
        <div className="aspect-square rounded-3xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden"><Shimmer /></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full relative overflow-hidden"><Shimmer /></div>
        <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded-lg w-1/2 relative overflow-hidden"><Shimmer /></div>
        <div className="mt-auto h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl relative overflow-hidden"><Shimmer /></div>
    </div>
);
