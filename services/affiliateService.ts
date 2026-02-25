
import { Partner } from '../types';

/**
 * Appends an affiliate tracking parameter to a URL if it belongs to a supported partner.
 * This effectively turns regular product links into revenue-generating links.
 * 
 * STRATEGY: 
 * Even without direct contracts, you can sign up for Digikala/Timcheh/Banimode affiliate panels
 * and get an ID. This service injects that ID automatically.
 * 
 * @param originalUrl The original product URL.
 * @param partners The list of active partners.
 * @returns The URL with an appended affiliate tag.
 */
export const generateAffiliateLink = (originalUrl: string, partners: Partner[]): string => {
    if (!originalUrl) return '';

    try {
        let urlObj: URL;
        try {
            urlObj = new URL(originalUrl);
        } catch {
            // Try appending protocol if missing
            urlObj = new URL(`https://${originalUrl}`);
        }
        
        // Check for Digikala (Most common in Iran)
        if (urlObj.hostname.includes('digikala.com')) {
            // Example structure for Digikala Affiliate (This varies, check their panel)
            // Usually uses a query param like ?aff_id=YOUR_ID
            // You (CEO) should register at affiliate.digikala.com
            const myDigikalaAffiliateId = 'YOUR_REAL_ID_HERE'; 
            if (!urlObj.searchParams.has('aff_id')) {
                urlObj.searchParams.set('aff_id', myDigikalaAffiliateId);
                // urlObj.searchParams.set('utm_source', 'giftino');
                // urlObj.searchParams.set('utm_medium', 'affiliate');
            }
            return urlObj.toString();
        }

        // Generic Partner Logic from DB
        if (partners && partners.length > 0) {
            const partner = partners.find(p => p.isActive && (urlObj.hostname === p.domain || urlObj.hostname.endsWith(`.${p.domain}`)));
            if (partner) {
                if (!urlObj.searchParams.has(partner.affiliateParam)) {
                    urlObj.searchParams.set(partner.affiliateParam, partner.affiliateValue);
                }
                return urlObj.toString();
            }
        }
    } catch (error) {
        console.warn("Affiliate Link Gen Error:", error);
        return originalUrl;
    }

    return originalUrl;
};
