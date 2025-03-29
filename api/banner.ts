interface BannerItem {
  index: number;
  name: string;
  url: string;
  link: string;
}

interface BannerData {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  data: BannerItem[];
  key: string;
  ["_constructor-name_"]: string;
}

/**
 * Fetches banner data from the API
 */
export async function getBannerData(): Promise<BannerData> {
  try {
    const response = await fetch('https://api.hsabook.vn/config-data/banner');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch banner data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.log(`🔴 getBannerData error:`, error);
    throw error;
  }
}

/**
 * Export types for use in components
 */
export type { BannerItem, BannerData }; 