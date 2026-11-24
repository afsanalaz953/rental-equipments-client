export type item= {
  _id: string;
  title: string;
  equipmentName?: string;   // legacy shape
  stock: number;
  price: number;
  category: string;
  condition: string;
  rentalType: string;
  description: string;
  imageUrl: string;
  image?: string;
  createdAt: string;        // ISO string from MongoDB
  updatedAt?: string;
}