// ============================================================
// FuyFood Mock Data – extracted from Stitch HTML designs
// ============================================================

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  imageUrl: string;
  tags: string[];
  isFreeShipping?: boolean;
  isTopRated?: boolean;
  isPromo?: boolean;
  ordersToday?: string;
}

export interface FlashSaleItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  imageUrl: string;
}

export interface Category {
  emoji: string;
  label: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  line1: string;
  line2: string;
  icon: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  badge?: string;
}

export interface CartItem {
  id: string;
  name: string;
  notes: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  section: string;
}

export interface OrderHistoryItem {
  id: string;
  restaurantName: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Cancelled' | 'Active';
  itemsSummary: string;
  imageUrl: string;
}

export interface TrackingStep {
  label: string;
  time: string;
  status: 'done' | 'active' | 'pending';
}

// ---- Categories ----
export const categories: Category[] = [
  { emoji: '🍚', label: 'Rice' },
  { emoji: '🍜', label: 'Noodles' },
  { emoji: '🧋', label: 'Drinks' },
  { emoji: '🍟', label: 'Snacks' },
  { emoji: '🥗', label: 'Healthy' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍦', label: 'Dessert' },
  { emoji: '🥐', label: 'Bakery' },
  { emoji: '🍣', label: 'Sushi' },
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🌮', label: 'Tacos' },
  { emoji: '🥩', label: 'Steak' },
  { emoji: '🍗', label: 'Chicken' },
  { emoji: '🍖', label: 'BBQ' },
  { emoji: '🍤', label: 'Seafood' },
  { emoji: '🥟', label: 'Dumplings' },
  { emoji: '🍝', label: 'Pasta' },
  { emoji: '🥪', label: 'Sandwiches' },
  { emoji: '🍲', label: 'Hot Pot' },
  { emoji: '🍛', label: 'Curry' },
  { emoji: '🍱', label: 'Bento' },
  { emoji: '🥓', label: 'Breakfast' },
  { emoji: '🍿', label: 'Fast Food' },
  { emoji: '🥤', label: 'Soft Drinks' },
  { emoji: '☰', label: 'All' },
];

// ---- Flash Sale ----
export const flashSaleItems: FlashSaleItem[] = [
  {
    id: 'fs1',
    name: 'Premium Salmon Poke Bowl',
    price: 12.50,
    originalPrice: 18.00,
    discountPct: 30,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmWG3SHLeZ58Ghrq3LKTE8UopmNXmbb4qJtjXVwPCfytmYF9UOtqx6YYXiaDQmbetm8kEXDj2sG6JNYonGoyiRsYY33c55-i8Sz2t0TqWx2js-Y4W9Q6LpUHf8dYlIDB97h3IZOl78eD9zcF_UX1LbuHAxcQv9ioCNLLpqlPEHfvipt04_0clF-p0g-4xhNlseAEA15TPXEOlLrWcVJapMnZ7Cp_Czjhb1uJZTfP4pMjIdbN8bYrxnbpj_p3v8Vq4pO0xOpzyJDB8s',
  },
  {
    id: 'fs2',
    name: 'Honey Glazed BBQ Skewers',
    price: 14.00,
    originalPrice: 20.00,
    discountPct: 30,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwVLuBdXZOZ6rcGec5hxr3qJIIY5L75Rv3CIkFTyPAI_ZEXCOkJgQGbDS5L3s8AZQ2ZGwuYVPgHzY7iWbtp1pnoV2fVpmwHa_DqJC_KoY0riBgwbqIC1_hwnk4ohn5vINLNIXbo-NlTQPereaqCjCyobq6CBllJHgc_0GRcrGgiiIOWXJyjJRkaBz57xszCLoMzOFP_hhQxuq3DYIBsBaru03NHcprLi32TqlqG5sScv4UV0HaXPNiHLjWM5sTJbZmdt0wDO39snfa',
  },
  {
    id: 'fs3',
    name: 'Truffle Mushroom Pizza',
    price: 15.40,
    originalPrice: 22.00,
    discountPct: 30,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWsbU4i-9juwShzAs_HikOkZksXB8IiIcJThs7L8FKJylYdXf3PIRdq4zhHbvOcnUVG8aowItpU4S2EHskWnv0vMxvG-6rQBP4FYekyDZfCsk79VyRuEXTy-NO6tNmbZ35Cxm0Os3vQLrkW5vUY8ZCPqyUeXy9EOReE3SLETYmE4EBTxb69Se3HScuFdp4kpNUFwJiWH44R8Qot9SZGMc1LmX8mEF7lpNNNRwxyV187wTHjgX3aPfP0XCira3-UeRuIjQd8FATsYyN',
  },

  // New items
  {
    id: 'fs4',
    name: 'Crispy Fried Chicken Combo',
    price: 9.90,
    originalPrice: 14.00,
    discountPct: 29,
    imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92',
  },
  {
    id: 'fs5',
    name: 'Grilled Beef Banh Mi',
    price: 6.50,
    originalPrice: 9.50,
    discountPct: 32,
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/054/675/509/large_2x/delicious-grilled-beef-banh-mi-sandwich-with-fresh-vegetables-photo.jpg',
  },
  {
    id: 'fs6',
    name: 'Cheesy Seafood Pasta',
    price: 13.20,
    originalPrice: 19.00,
    discountPct: 31,
    imageUrl: 'https://patijinich.com/wp-content/uploads/2019/08/812-cheese-and-shrimp-pasta-bake.jpg',
  },
  {
    id: 'fs7',
    name: 'Matcha Cream Dessert Box',
    price: 7.80,
    originalPrice: 11.00,
    discountPct: 29,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
  },
  {
    id: 'fs8',
    name: 'Spicy Korean Tteokbokki',
    price: 8.40,
    originalPrice: 12.00,
    discountPct: 30,
    imageUrl: 'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-09-tteokbokki%2Ftteokbokki-523',
  },
];

// ---- Popular Restaurants ----
export const popularRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'The Kinetic Bistro',
    cuisine: 'Asian Fusion • Modern Grill • Healthy',
    rating: 4.8,
    deliveryTime: '25-35 min',
    distance: '1.2 km',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr-r3M20-tfxjiEwflbAnGTZnQXBK_zGGe7YtmUMwKce5H1dZtzgD-FMn9scv27o2JJDl1xAzTt9CKZwyO82NjUjl5gqQ_27nLPwxk8ZoiiZ65QjsGnTRgGbcLnwUEXnldyvvONKQO9J8N6tfQ-mvA9MePnW2foKlTL_D7YaryXrKeyvvvwF8TGH17YTnCkQyci5MzCpP1aKr-FahMeY1N99vM18FPRKG_8fzT-bOw05QCB0TKsgE9FXseCLzLKlUpZ6GDWOSMBSIe',
    tags: ['Free Shipping', 'Promo'],
    isFreeShipping: true,
    isPromo: true,
  },
  {
    id: 'r2',
    name: 'Sushi Zen & Grill',
    cuisine: 'Japanese • Seafood • Rolls',
    rating: 4.9,
    deliveryTime: '15-20 min',
    distance: '0.5 km',
    imageUrl: 'https://popmenucloud.com/cdn-cgi/image/width=1200,height=630,format=auto,fit=cover/ofkwqcbn/d12413fb-2fa6-4c68-aa71-48b0ebcbd87e.jpg',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r3',
    name: 'Burger Craft HQ',
    cuisine: 'American • Burgers • Shakes',
    rating: 4.7,
    deliveryTime: '30-45 min',
    distance: '2.8 km',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg476bxJM7whfNwQ2zvOCfvoV3M1VkKsdGZm-aDpDnPre2nNm58ocNhxZ2f_ApeWMhpcdtv9sMcUNou_juX62F0a47oSMeQNVt_uBn0GveKsuuuceM7CulsXnt8Sjem3lJt__CJOvMMI1oTskkRJIf0FXx7HQ2r6dTt3WpXOCwF1Ui3hxpe960p0pNM0S1A2vuI3RgDlO5gY93H-EX4i1Or3rTBrmie6bHex5MKEUS3qUtP0pmR8MnExvlQqSiS5D_YOOjI5IW_xuE',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r4',
    name: 'Pizza Palace',
    cuisine: 'Italian • Pizza • Pasta',
    rating: 4.6,
    deliveryTime: '20-30 min',
    distance: '1.5 km',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/68c8aaa474355d1850c80d81/2a584f48-236f-4b9c-881a-8542057bacdf/pizza-palace+%288%29.jpg',
    tags: ['Promo'],
    isPromo: true,
  },
  {
    id: 'r5',
    name: 'Taco Fiesta',
    cuisine: 'Mexican • Tacos • Burritos',
    rating: 4.5,
    deliveryTime: '15-25 min',
    distance: '0.8 km',
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r6',
    name: 'Noodle Nirvana',
    cuisine: 'Asian • Noodles • Soups',
    rating: 4.7,
    deliveryTime: '18-28 min',
    distance: '1.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r7',
    name: 'Green Garden Cafe',
    cuisine: 'Healthy • Salads • Smoothies',
    rating: 4.8,
    deliveryTime: '12-22 min',
    distance: '0.6 km',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    tags: ['Free Shipping', 'Promo'],
    isFreeShipping: true,
    isPromo: true,
  },
  {
    id: 'r8',
    name: 'BBQ Heaven',
    cuisine: 'American • BBQ • Ribs',
    rating: 4.9,
    deliveryTime: '25-40 min',
    distance: '2.2 km',
    imageUrl: 'https://img.cdn4dd.com/cdn-cgi/image/fit=cover,width=600,height=400,format=auto,quality=80/https://doordash-static.s3.amazonaws.com/media/store/header/f82cfa74-4e59-4c32-87ab-6533c7a27359.jpg',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r9',
    name: 'Sushi Express',
    cuisine: 'Japanese • Sushi • Rolls',
    rating: 4.6,
    deliveryTime: '10-20 min',
    distance: '0.4 km',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r10',
    name: 'Dessert Delight',
    cuisine: 'Desserts • Cakes • Ice Cream',
    rating: 4.7,
    deliveryTime: '15-25 min',
    distance: '1.3 km',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
    tags: ['Promo'],
    isPromo: true,
  },
  {
    id: 'r11',
    name: 'Chicken Corner',
    cuisine: 'American • Fried Chicken • Wings',
    rating: 4.5,
    deliveryTime: '20-35 min',
    distance: '1.8 km',
    imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92',
    tags: [],
  },
  {
    id: 'r12',
    name: 'Pasta Paradise',
    cuisine: 'Italian • Pasta • Risotto',
    rating: 4.8,
    deliveryTime: '22-32 min',
    distance: '1.7 km',
    imageUrl: 'https://fnb.qdc.vn/pictures/catalog/pasta-paradise/thiet-ke-nha-hang-pasta-paradise-04.jpg',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r13',
    name: 'Seafood Shack',
    cuisine: 'Seafood • Fish • Shellfish',
    rating: 4.9,
    deliveryTime: '18-28 min',
    distance: '0.9 km',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r14',
    name: 'Vegan Vibes',
    cuisine: 'Vegan • Plant-Based • Healthy',
    rating: 4.6,
    deliveryTime: '14-24 min',
    distance: '1.1 km',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    tags: ['Promo'],
    isPromo: true,
  },
  {
    id: 'r15',
    name: 'Steakhouse Supreme',
    cuisine: 'American • Steak • Grill',
    rating: 4.8,
    deliveryTime: '30-45 min',
    distance: '3.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r16',
    name: 'Dumpling Dynasty',
    cuisine: 'Chinese • Dumplings • Noodles',
    rating: 4.7,
    deliveryTime: '16-26 min',
    distance: '0.7 km',
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r17',
    name: 'Bakery Bliss',
    cuisine: 'Bakery • Bread • Pastries',
    rating: 4.5,
    deliveryTime: '10-20 min',
    distance: '0.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    tags: [],
  },
  {
    id: 'r18',
    name: 'Sandwich Spot',
    cuisine: 'American • Sandwiches • Wraps',
    rating: 4.4,
    deliveryTime: '12-22 min',
    distance: '1.4 km',
    imageUrl: 'https://dallas.culturemap.com/media-library/sandwich-spot.webp?id=50444596&width=2000&height=1500&coordinates=0%2C16%2C0%2C16',
    tags: ['Promo'],
    isPromo: true,
  },
  {
    id: 'r19',
    name: 'Hot Pot Haven',
    cuisine: 'Chinese • Hot Pot • Soups',
    rating: 4.8,
    deliveryTime: '25-40 min',
    distance: '2.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r20',
    name: 'Curry Corner',
    cuisine: 'Indian • Curry • Rice',
    rating: 4.6,
    deliveryTime: '20-30 min',
    distance: '1.6 km',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r21',
    name: 'Bento Box Cafe',
    cuisine: 'Japanese • Bento • Rice',
    rating: 4.7,
    deliveryTime: '15-25 min',
    distance: '0.9 km',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: [],
  },
  {
    id: 'r22',
    name: 'Breakfast Barn',
    cuisine: 'American • Breakfast • Pancakes',
    rating: 4.5,
    deliveryTime: '18-28 min',
    distance: '2.1 km',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8',
    tags: ['Promo'],
    isPromo: true,
  },
  {
    id: 'r23',
    name: 'Fast Food Frenzy',
    cuisine: 'Fast Food • Burgers • Fries',
    rating: 4.3,
    deliveryTime: '10-20 min',
    distance: '0.3 km',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    tags: [],
  },
  {
    id: 'r24',
    name: 'Soft Drink Station',
    cuisine: 'Beverages • Drinks • Smoothies',
    rating: 4.4,
    deliveryTime: '5-15 min',
    distance: '0.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
    tags: ['Free Shipping'],
    isFreeShipping: true,
  },
  {
    id: 'r25',
    name: 'Snack Shack',
    cuisine: 'Snacks • Chips • Popcorn',
    rating: 4.2,
    deliveryTime: '8-18 min',
    distance: '0.6 km',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    tags: [],
  },
  {
    id: 'r26',
    name: 'Thai Taste',
    cuisine: 'Thai • Curry • Noodles',
    rating: 4.7,
    deliveryTime: '20-30 min',
    distance: '1.9 km',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    tags: ['Top Rated'],
    isTopRated: true,
  },
  {
    id: 'r27',
    name: 'Mediterranean Mezze',
    cuisine: 'Mediterranean • Mezze • Grilled',
    rating: 4.8,
    deliveryTime: '22-32 min',
    distance: '1.4 km',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    tags: ['Free Shipping', 'Promo'],
    isFreeShipping: true,
    isPromo: true,
  },
  {
    id: 'r28',
    name: 'Korean Kitchen',
    cuisine: 'Korean • BBQ • Bibimbap',
    rating: 4.6,
    deliveryTime: '18-28 min',
    distance: '1.0 km',
    imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9',
    tags: [],
  },
];

export const trendingRestaurants: Restaurant[] = [
  {
    id: 't1',
    name: 'La Fiesta Tacos',
    cuisine: 'Mexican • Street Food • Spicy',
    rating: 4.6,
    deliveryTime: '20-30 min',
    distance: '1.5 km',
    imageUrl: 'https://s3-media0.fl.yelpcdn.com/bphoto/hYcy5BEzMNUvz9iDPuU96A/348s.jpg',
    tags: [],
    ordersToday: '500+',
  },
  {
    id: 't2',
    name: 'Pasta Paradiso',
    cuisine: 'Italian • Gourmet • Pasta',
    rating: 4.9,
    deliveryTime: '25-35 min',
    distance: '2.1 km',
    imageUrl: 'https://tb-static.uber.com/prod/image-proc/processed_images/0d179015db37a4c72f558ade6af2900b/c9252e6c6cd289c588c3381bc77b1dfc.jpeg',
    tags: [],
    ordersToday: '350+',
  },
  {
    id: 't3',
    name: 'The Green Kitchen',
    cuisine: 'Vegetarian • Organic • Fresh',
    rating: 4.7,
    deliveryTime: '15-25 min',
    distance: '0.8 km',
    imageUrl: 'https://tb-static.uber.com/prod/image-proc/processed_images/882af098dfc0ca6932acf8922e91c5d2/560a11f5d26e4cb83686f7810a5f5fe2.jpeg',
    tags: [],
    ordersToday: '420+',
  },
];

// ---- Addresses ----
export const addresses: Address[] = [
  {
    id: 'a1',
    type: 'home',
    label: 'Home',
    line1: '123 Kinetic Avenue, Apt 4B',
    line2: 'Cyber District, Neo City 54010',
    icon: 'home',
  },
  {
    id: 'a2',
    type: 'work',
    label: 'Work',
    line1: '456 Velocity Plaza, Floor 12',
    line2: 'Business Central, Neo City 54100',
    icon: 'work',
  },
];

// ---- Payment Methods ----
export const paymentMethods: PaymentMethod[] = [
  { id: 'pm1', name: 'FuyPay', subtitle: 'Balance: $142.50', icon: 'account_balance_wallet', badge: '10% Cashback' },
  { id: 'pm2', name: 'Visa •••• 8821', subtitle: 'Expires 12/26', icon: 'credit_card' },
  { id: 'pm3', name: 'Cash on Delivery', subtitle: 'Pay when food arrives', icon: 'payments' },
];

// ---- Cart Items (active order) ----
export const cartItems: CartItem[] = [
  {
    id: 'ci1',
    name: 'Truffle Umami Burger',
    notes: 'Extra pickles, No onions',
    price: 18.50,
    quantity: 1,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU5kfxbTu3B1d-IwdaULv69yyLwVBonFdko2nXu6wMZi7YP85XXnM_2u6_E5VN5mA2gGrvMjCnkWmjUh-nM_UoJzgn2ZVRZtFXZcdOjDv8XiCDaaaDr6QxUDTW6iTyVem-9oulKy-TfulE5pB4V50ywk9P6E15UAXLqUapu11G0UalMYTP9XK6GPENQ7TKzswQRVc2gLgCPndhW94qIO9LFAb6IzFkW5RSpDtwakj4DM9xbpxuibXfp5HySDQtQMROlYhvBs7XUIdN',
  },
  {
    id: 'ci2',
    name: 'Sweet Potato Fries',
    notes: 'Large size',
    price: 6.00,
    quantity: 1,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0vPnaePXl-Zs0xnC_QULIuqA_pQ6hlYC6z5Q8RdAht7BrzsAjykOnQt_EOa_MpqCRXY1zcQAin5AX6fpvX4vjz0UND9AXprF1muK2wTkV_q5qzdOCAfuHKFCMS0AhQ18bJ3WAmiun2ke_g-agGRLJn6BJliM6j19lX2vP5B4Uejb1O6JqYarzbb2rDQEwmtykeDSxdKVDDXoQ-oQONqngXXBjbskOohPvl9G1tH9N_aPHGLsIF3_z2hF0JDf23JWX27w0m6hf-54w',
  },
];

// ---- Tracking Steps ----
export const trackingSteps: TrackingStep[] = [
  { label: 'Order Placed', time: '12:40 PM', status: 'done' },
  { label: 'Preparing Your Food', time: '12:45 PM', status: 'done' },
  { label: 'Driver Picking Up', time: 'In Progress', status: 'active' },
  { label: 'Delivering', time: 'Pending', status: 'pending' },
  { label: 'Delivered', time: 'Pending', status: 'pending' },
];

// ---- Order History ----
export const orderHistory: OrderHistoryItem[] = [
  {
    id: 'oh1',
    restaurantName: "Mama's Italian Pizza",
    date: 'Oct 24, 2023 • 12:45 PM',
    total: 34.50,
    status: 'Delivered',
    itemsSummary: 'Large Pepperoni Feast, Garlic Knots (6pcs), Diet Coke 500ml',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYIr3qiT5e9nkKxk5_5tlaSu3X2tAa1I-0PYNEM-KD6H3bZ3h4BNZeuYw8DS4h-N80DPp-xE2PawRPn625WtD7KWpDECrIfXTyBmlacJD9Iu2y73loP61t_vK82w6h-x_jIbBwARUfLjiBqa1RJUUObELRac5Lh8pz91aO3Hiz2JEcAySz7xkyyifgJHRwvkpmp7cWPyPsJD2KCPEGktsCaTJik9c122VifF3XDyecPxNE4azY-zFHfY9m870NWRZWQu_DSWGM8AZy',
  },
  {
    id: 'oh2',
    restaurantName: 'The Burger Collective',
    date: 'Oct 21, 2023 • 7:15 PM',
    total: 22.80,
    status: 'Delivered',
    itemsSummary: 'Classic Wagyu Burger, Truffle Parmesan Fries, Vanilla Milkshake',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_lyapw6f6G72TEeFglx6R8OrzxgaHGYxEcop635iwgSPRJLZr1qVDvQzjpRcNFfqK651Vo4v7ubE8ncQH7NGrupTWDNEQzwZ68S0J37m_j7CMsrI1nOFC4Y9yaZolZT5FLkV7TjNVBgkmWY_VlzpPEHOzFkK4-oWa4_9wNiv4gGjVM9iowqqomu2hVJCWfni3nD22pwwzkJLHWLNrGUFoNyp1MKwNdBhmuYTHRoPFy7us1ErEmxafX7KK0h6jg8ycT6tWFhYafkXN',
  },
  {
    id: 'oh3',
    restaurantName: 'Green Garden Salads',
    date: 'Oct 18, 2023 • 1:30 PM',
    total: 18.20,
    status: 'Cancelled',
    itemsSummary: 'Spicy Chicken Quinoa Bowl, Lemon Ginger Juice',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDsvDYqmUiCDy6OiIgcNeKre0fEV3MbxDSu3EShlHJdsvOTF8scDT5J1pMeHgj5zXfGgBmKn5j81NNujXXn8mZNTXcqAB2wdAFtxmIMjsNDoT_frwDIMh-6k-pkSgT7Y0dkttVfbEhvbmUSUdEbPwJe86qgEyfOkXL75klacPQtR4nHtH9jKoIUI1oPEghBPGDAm4WYI0g_f78_xDPTE63qnJpYRpRcMzXKh6zwNnp4WQABx2nXfHEuoGHa5NSfqRQOdHDMvaTql7Q',
  },
  {
    id: 'oh4',
    restaurantName: 'Sakura Sushi House',
    date: 'Oct 15, 2023 • 8:45 PM',
    total: 52.00,
    status: 'Delivered',
    itemsSummary: 'Premium Omakase Box (12pcs), Miso Soup, Green Tea Mochi',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT_7s8ioJh9IJqqeBIVdcE5l2NGzKHiaQEduqGw3Kux8weU1n0NveEPS2NOIEPK_GlvE0y4H6KLlET1_SIO81ukSYum264AhcT67seJWpijGErxED5xWvB3WutQ8cA3eHCyDBWKxhWznxZJiq78gRh4JeKWgSCjewAPhLM9M67j4NZ2990FH7dGnQOsH5wco9Zc5s_n1DGlpfW7LqdUn16VboT52soRDWrB0lXmFtm6711BZ-JBuGp_zEWm36Yy34eHcCHr6cuDuTL',
  },
];

// ---- Restaurant Detail Menu ----
export const urbanUmamiMenu: MenuItem[] = [
  {
    id: 'm1',
    name: 'Black Garlic Tonkotsu',
    description: 'Rich pork bone broth infused with charred black garlic oil, bamboo shoots, and soft-boiled egg.',
    price: 16.50,
    section: 'Popular Now',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQy4UiOF1a36Bc4war66AipduZjrG3MIgsvF8oHwNQve8Q3iFeTW_tZ0nwFug_u_e7p0T6llNAUOo_3yHm33nC-c9Wd6JIqWT26ZX_g3qVNn8Ab-WWozjabaRdLVbAeaTWGgIcJ9tJ_oC6CpRX3qjJIHZMdOL2J20b_RKntViprKQPrPa6UpkjW9Hv3IE-PmTQ0RQCI0KFC-Rzy98F2VA6PlzCaOd3fVplZo0qJa4K_v6lpoEyEzEJI4omAzv-o--LJX8uxCPsK9WP',
  },
  {
    id: 'm2',
    name: 'Spicy Tuna Crunch Roll',
    description: 'Fresh ahi tuna, cucumber, spicy mayo topped with tempura flakes and unagi sauce.',
    price: 14.00,
    section: 'Popular Now',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK5n0Us_jswSa-vv5RHSFzKOT8HscHErlarCEJmwixfOJqJpQhbt32dXQY3pB2MoHU4Nkhc2010u26w33XTys9tT1fKV1MnhyRk8Iwg74Z1Lzc3LvQJQoWvbYHwr686WxEYnZZQtQPFA4j9f3bWzB46DLCMDQuWCit0BKmiNH5ZSdzACfLWDIqTmii-bjxHOVmqh5CxgdN6sX-n-Th8re5UMyzSDpRJU44xmm58v5Mk73brihEDCDt4Uqex6h-w8P_VjdrsO1DjApr',
  },
  {
    id: 'm3',
    name: 'Golden Dragon Roll',
    description: 'Shrimp tempura and cucumber topped with sliced avocado, gold flakes, and mango puree.',
    price: 18.25,
    section: 'Sushi Rolls',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDzUol0FUbClPFa5g5bqRoCRq0qMAti6UfuQ4eqso_woYoASQNegM22rVmErd95fRH1NZ18-zSomL326fPX4eZ4B4uXx8VGKe-0xy3TG3ZbR5_TX8CS_zpZYURA95jUjb1gRB6aW3C_c_ZoHvR8CaYb1krHWt-Q8QkDNwDlt3Li0KzaZ9ev8ucjKnG3cxDCzj7wpwa-v_F-VvaqjP3NGp3-Fpz09ZpiEVJ-nKV0PVoMOumi5pzMfYaQI3utUetbf5wh2i-015EI50V',
  },
  {
    id: 'm4',
    name: 'Classic California',
    description: 'Real snow crab, avocado, and cucumber rolled in sesame seeds.',
    price: 12.00,
    section: 'Sushi Rolls',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqH6UxAAK7CYe_NmdQHlgJq1BqLMIHH-rGWmTpDezz1GPH1ZUZKZtf42vyKDN5CU3Mt5JPqIDyK5NAg9064pJMVAIjjSlG9Ckn5zZGRM197eE5Up074SICXUn3mTTSoj-LZNO1ZRvL1mdKO1ttgK86sQ5lUzc93Ws-c5bIHtLYjZzCYnCIWQuFJxcmza9h1LFZX0jhTfF8XJhl0IApRnOvtBw1TPcyfOoLWVG_M0u_GdkIm17FFk5TEBRnyRoDKXv0N0cnWWAk6',
  },
];
