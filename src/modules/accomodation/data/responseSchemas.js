export const normalizeListing = (rawListing, partnerName = "GenericPartner") => {
  // Maps partner-specific payload to our internal AyaBus schema
  return {
    id: rawListing.hotel_id || rawListing.id,
    name: rawListing.property_name || rawListing.name || "Verified Property",
    thumbnailUrl: rawListing.image_url || rawListing.thumbnail || "",
    pricePerNight: rawListing.price_amount || rawListing.rate || 0,
    currency: rawListing.currency || "UGX",
    rating: rawListing.star_rating || rawListing.rating || 0,
    reviewScore: rawListing.review_score || 0,
    reviewCount: rawListing.review_count || 0,
    amenities: rawListing.amenities || [],
    partnerSource: partnerName,
    rawUrl: rawListing.booking_link || rawListing.url || ""
  };
};