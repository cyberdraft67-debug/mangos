
import { Product } from './types';
import mangoStandardBox from './src/assets/images/mango_standard_box_1780218711076.png';
import mangoSovereignWoodBox from './src/assets/images/mango_premium_patti_decent_1781022733412.png';
import mangoHeritagePattie from './src/assets/images/medium_mango_petti_1781027647966.png';
import mangoBulkHarvest from './src/assets/images/mango_bulk_harvest_1780220263488.png';
import mangoBadshahBox from './src/assets/images/mango_badshah_exact_white_1781018432377.png';
import mangoOrangeCarton from './src/assets/images/mango_orange_exact_white_1781018452674.png';

export const ORDER_NOTIFICATION_EMAIL = 'cyberdraft67@gmail.com';

// Your production Excel/Spreadsheet Webhook URL
// To get this, use Make.com or Zapier to create a webhook that writes to Excel
export const SPREADSHEET_WEBHOOK_URL = 'https://hook.eu1.make.com/zdad5cs86ehxvko0q7vqihtatp5w5cf9';

export const PRODUCTS: Product[] = [
  {
    id: '2',
    name: 'Regular Paiti',
    description: 'Hand-selected extra-large grade specimens representing the peak of sugar concentration and velvety texture. Unmatched honey-sweet flavor handpicked in premium paiti packaging.',
    price: 3000,
    unit: '9-10 KG Paiti',
    image: mangoSovereignWoodBox,
    category: 'Regular',
    stock: 35,
    reviews: [
      { id: 'r3', userName: 'Elena R.', rating: 5, comment: 'Spectacular size! Incredible gold-yellow skin and incredibly sweet pulp.', date: '2026-06-07' }
    ]
  },
  {
    id: '3',
    name: 'Premium Box',
    description: 'Perfect for small families or personal indulgence. Handpicked premium quality, individually nested for that flawless sweet aroma.',
    price: 2000,
    unit: '4.5 - 5 KG Box',
    image: mangoBadshahBox,
    category: 'Premium',
    stock: 25,
    reviews: [
      { id: 'r4', userName: 'Bilal A.', rating: 5, comment: 'Very aromatic and sweet. The standard size is perfect for gift-giving.', date: '2026-06-08' }
    ]
  },
  {
    id: '4',
    name: 'Premium Box',
    description: 'Our ultimate orchard bounty. A majestic 9-10kg box designed for larger families who want a steady, daily supply of naturally ripened golden joy.',
    price: 3800,
    unit: '9-10 KG Box',
    image: mangoOrangeCarton,
    category: 'Premium',
    stock: 15,
    reviews: [
      { id: 'r5', userName: 'Zainab H.', rating: 5, comment: 'We had an amazing family mango party. Absolute hit, every single mango was gold!', date: '2026-06-08' }
    ]
  }
];
