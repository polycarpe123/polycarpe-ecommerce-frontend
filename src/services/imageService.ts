// Unsplash API service for getting relevant product images

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description: string;
  alt_description: string;
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

// Category to search query mapping
const CATEGORY_SEARCH_QUERIES: Record<string, string> = {
  // Clothing
  'shoes': 'running shoes',
  'sneakers': 'sneakers',
  'boots': 'boots',
  'sandals': 'sandals',
  'jeans': 'denim jeans',
  'pants': 'trousers',
  'shorts': 'shorts',
  'shirt': 't-shirt',
  't-shirt': 't-shirt',
  'dress': 'dress',
  'skirt': 'skirt',
  'jacket': 'jacket',
  'coat': 'coat',
  'hoodie': 'hoodie',
  'sweater': 'sweater',
  'blouse': 'blouse',
  
  // Bags & Accessories
  'bag': 'handbag',
  'handbag': 'handbag',
  'backpack': 'backpack',
  'purse': 'purse',
  'wallet': 'wallet',
  'belt': 'belt',
  'hat': 'hat',
  'cap': 'cap',
  'sunglasses': 'sunglasses',
  'watch': 'wrist watch',
  
  // Electronics
  'laptop': 'laptop',
  'phone': 'smartphone',
  'headphones': 'headphones',
  'speaker': 'speaker',
  'camera': 'camera',
  'tablet': 'tablet',
  'monitor': 'computer monitor',
  'keyboard': 'keyboard',
  'mouse': 'computer mouse',
  
  // Home & Living
  'chair': 'chair',
  'table': 'table',
  'sofa': 'sofa',
  'bed': 'bed',
  'lamp': 'lamp',
  'pillow': 'pillow',
  'rug': 'rug',
  'plant': 'house plant',
  
  // Sports & Fitness
  'ball': 'sports ball',
  'bike': 'bicycle',
  'yoga': 'yoga mat',
  'fitness': 'fitness equipment',
  'gym': 'gym equipment',
  
  // Beauty & Personal Care
  'makeup': 'makeup',
  'skincare': 'skincare products',
  'perfume': 'perfume bottle',
  'shampoo': 'shampoo bottle',
  
  // Default fallback
  'default': 'product'
};

// Get the best search query for a product
const getSearchQuery = (productName: string, category?: string): string => {
  const lowerName = productName.toLowerCase();
  const lowerCategory = category?.toLowerCase() || '';
  
  // Try exact category match first
  if (category && CATEGORY_SEARCH_QUERIES[lowerCategory]) {
    return CATEGORY_SEARCH_QUERIES[lowerCategory];
  }
  
  // Try to match keywords in product name
  for (const [keyword, query] of Object.entries(CATEGORY_SEARCH_QUERIES)) {
    if (lowerName.includes(keyword) && keyword !== 'default') {
      return query;
    }
  }
  
  // Try category keywords in product name
  for (const [keyword, query] of Object.entries(CATEGORY_SEARCH_QUERIES)) {
    if (lowerCategory.includes(keyword) && keyword !== 'default') {
      return query;
    }
  }
  
  return CATEGORY_SEARCH_QUERIES.default;
};

// Test function to check API connectivity
export const testUnsplashAPI = async (): Promise<boolean> => {
  try {
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    console.log('Testing Unsplash API with key:', apiKey?.substring(0, 10) + '...');
    
    const response = await fetch(
      'https://api.unsplash.com/photos/random?count=1',
      {
        headers: {
          'Authorization': `Client-ID ${apiKey}`
        }
      }
    );
    
    console.log('Test response status:', response.status);
    const success = response.ok;
    console.log('API test result:', success);
    return success;
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
};

// Get product images from Unsplash
export const getProductImages = async (
  productName: string,
  category?: string,
  count: number = 5
): Promise<string[]> => {
  try {
    const query = getSearchQuery(productName, category);
    console.log('Searching Unsplash for:', query);
    
    // Check if API key is available
    const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key starts with:', apiKey?.substring(0, 10));
    
    // Use Unsplash API (you'll need to add your access key to .env)
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=portrait`,
      {
        headers: {
          'Authorization': `Client-ID ${apiKey || 'YOUR_ACCESS_KEY_HERE'}`
        }
      }
    );
    
    console.log('Unsplash response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error:', errorText);
      throw new Error(`Failed to fetch images: ${response.status} ${errorText}`);
    }
    
    const data: UnsplashResponse = await response.json();
    console.log('Unsplash response data:', data);
    
    // Return image URLs
    const imageUrls = data.results.map(photo => photo.urls.regular);
    console.log('Extracted image URLs:', imageUrls);
    
    return imageUrls;
    
  } catch (error) {
    console.error('Error fetching product images:', error);
    
    // Fallback to placeholder images
    const fallbackImages = Array(count).fill(null).map((_, index) => 
      `https://picsum.photos/seed/${productName.replace(/\s+/g, '-')}-${index}/400/600.jpg`
    );
    console.log('Using fallback images:', fallbackImages);
    return fallbackImages;
  }
};

// Get single product image
export const getProductImage = async (
  productName: string,
  category?: string
): Promise<string> => {
  const images = await getProductImages(productName, category, 1);
  return images[0] || `https://picsum.photos/seed/${productName.replace(/\s+/g, '-')}/400/600.jpg`;
};

// Get multiple product images for gallery
export const getProductGallery = async (
  productName: string,
  category?: string
): Promise<string[]> => {
  return await getProductImages(productName, category, 4);
};
