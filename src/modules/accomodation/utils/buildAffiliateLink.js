import { ACCOM_CONFIG } from '../data/apiConfig';

export const buildAffiliateLink = (basePartnerUrl, propertyId, city) => {
  if (!basePartnerUrl) return '#';
    
      const url = new URL(basePartnerUrl);
        url.searchParams.append('affiliate_id', ACCOM_CONFIG.AFFILIATE_ID);
          url.searchParams.append('ref', 'ayabus_web');
            url.searchParams.append('destination', encodeURIComponent(city));
              
                return url.toString();
                };