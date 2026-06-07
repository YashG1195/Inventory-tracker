import { uid } from '../utils/helpers';

export const DEFAULT_CATEGORIES = [
  { id: 'electronics', name: 'Electronics',  color: '#3b82f6', emoji: '💻' },
  { id: 'clothing',    name: 'Clothing',     color: '#ec4899', emoji: '👗' },
  { id: 'food',        name: 'Food & Drink', color: '#10b981', emoji: '🍎' },
  { id: 'tools',       name: 'Tools',        color: '#f97316', emoji: '🔧' },
  { id: 'furniture',   name: 'Furniture',    color: '#7c3aed', emoji: '🪑' },
  { id: 'office',      name: 'Office',       color: '#06b6d4', emoji: '📋' },
];

export const DEMO_PRODUCTS = [
  { id: uid(), name: 'Wireless Mouse',      sku: 'WM-1042', category: 'electronics', quantity: 85,  minStock: 20, price: 29.99, unit: 'pcs',  supplier: 'TechCorp',  location: 'A-12', reorder: 15, notes: '',                       description: 'Ergonomic wireless mouse',        createdAt: Date.now() },
  { id: uid(), name: 'USB-C Hub',           sku: 'HUB-204', category: 'electronics', quantity: 12,  minStock: 20, price: 45.00, unit: 'pcs',  supplier: 'TechCorp',  location: 'A-13', reorder: 10, notes: '',                       description: '7-port USB-C hub',               createdAt: Date.now() },
  { id: uid(), name: 'Mechanical Keyboard', sku: 'KB-3301', category: 'electronics', quantity: 0,   minStock: 10, price: 129.99,unit: 'pcs',  supplier: 'KeyCo',     location: 'A-14', reorder: 5,  notes: '',                       description: 'RGB mechanical keyboard',         createdAt: Date.now() },
  { id: uid(), name: 'Cotton T-Shirt',      sku: 'TS-5502', category: 'clothing',    quantity: 200, minStock: 50, price: 12.50, unit: 'pcs',  supplier: 'FabricInc', location: 'B-01', reorder: 30, notes: '',                       description: 'Unisex cotton T-shirt',           createdAt: Date.now() },
  { id: uid(), name: 'Denim Jeans',         sku: 'DJ-6601', category: 'clothing',    quantity: 7,   minStock: 25, price: 49.99, unit: 'pcs',  supplier: 'FabricInc', location: 'B-02', reorder: 15, notes: '',                       description: 'Slim-fit denim jeans',            createdAt: Date.now() },
  { id: uid(), name: 'Organic Coffee',      sku: 'CF-7701', category: 'food',        quantity: 150, minStock: 30, price: 18.00, unit: 'kg',   supplier: 'BeanFarm',  location: 'C-01', reorder: 20, notes: '',                       description: 'Premium organic coffee beans',    createdAt: Date.now() },
  { id: uid(), name: 'Hammer Set',          sku: 'HS-8801', category: 'tools',       quantity: 40,  minStock: 10, price: 22.00, unit: 'pcs',  supplier: 'ToolCo',    location: 'D-03', reorder: 8,  notes: '',                       description: 'Professional hammer set',         createdAt: Date.now() },
  { id: uid(), name: 'Office Chair',        sku: 'OC-9901', category: 'furniture',   quantity: 5,   minStock: 5,  price: 299.00,unit: 'pcs',  supplier: 'FurnCo',    location: 'E-01', reorder: 3,  notes: '',                       description: 'Ergonomic mesh chair',            createdAt: Date.now() },
  { id: uid(), name: 'Sticky Notes (Pack)', sku: 'SN-1101', category: 'office',      quantity: 300, minStock: 50, price: 3.50,  unit: 'pack', supplier: 'StatCo',    location: 'F-01', reorder: 40, notes: '',                       description: '100-sheet sticky note pads',      createdAt: Date.now() },
  { id: uid(), name: 'Laptop Stand',        sku: 'LS-2201', category: 'electronics', quantity: 18,  minStock: 10, price: 39.99, unit: 'pcs',  supplier: 'TechCorp',  location: 'A-15', reorder: 8,  notes: '',                       description: 'Adjustable aluminum laptop stand',createdAt: Date.now() },
  { id: uid(), name: 'Wireless Headphones', sku: 'WH-3301', category: 'electronics', quantity: 3,   minStock: 10, price: 89.99, unit: 'pcs',  supplier: 'SoundTech', location: 'A-16', reorder: 5,  notes: 'High priority restock',  description: 'Noise-cancelling headphones',     createdAt: Date.now() },
  { id: uid(), name: 'A4 Paper Ream',       sku: 'AP-4401', category: 'office',      quantity: 500, minStock: 100,price: 6.50,  unit: 'pack', supplier: 'StatCo',    location: 'F-02', reorder: 80, notes: '',                       description: '500-sheet A4 paper ream',        createdAt: Date.now() },
];
