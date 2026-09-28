import { useState, useEffect, useMemo } from "react";
import { MOCK_CATALOG, type ExtendedListing } from "@/data/mockCatalog";
import { sellerStore } from "@/components/seller/sellerStore";
import { type MediaAsset } from "@/components/seller/sellerTypes";

export function assetToExtendedListing(asset: MediaAsset): ExtendedListing {
  return {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    medium: asset.medium,
    city: asset.city,
    country: asset.country,
    address: asset.address,
    size: asset.size,
    price_per_month: asset.pricePerMonth,
    currency: asset.currency,
    available: asset.available,
    second_hand: asset.secondHand,
    images: asset.images,
    featured: asset.featured,
    daily_impressions: asset.dailyImpressions,
    resolution: asset.resolution,
    lighting_type: asset.lightingType,
    minimum_flight: asset.minimumFlight,
    seller_name: "Apex Media Holdings (Owner)",
    seller_rating: 4.9,
    seller_reviews_count: 24,
    cpm: asset.spotRateDaily ? `$${(asset.spotRateDaily / 100).toFixed(2)}` : "$2.40",
  };
}

export function useLiveCatalog() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleSync = () => {
      setVersion((v) => v + 1);
    };

    window.addEventListener("markatads_seller_sync", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("markatads_seller_sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const liveListings = useMemo(() => {
    // 1. Get all assets from seller store
    const sellerAssets = sellerStore.getAssets();
    const sellerListings: ExtendedListing[] = sellerAssets.map(assetToExtendedListing);

    // 2. Combine with MOCK_CATALOG, prioritizing seller assets
    const combined: ExtendedListing[] = [...sellerListings];

    MOCK_CATALOG.forEach((item) => {
      if (!combined.some((c) => c.id === item.id)) {
        combined.push(item);
      }
    });

    return combined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return {
    listings: liveListings,
    totalCount: liveListings.length,
    activeCount: liveListings.filter((l) => l.available).length,
  };
}
