import type { Equipment } from "@/types/equipment";

export interface EquipmentData {
  _id: string;
  title?: string;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  condition?: string;
  stock?: number;
  status?: string;
  description?: string;
  [key: string]: unknown;
}

export interface WishlistButtonProps {
  equipmentData: EquipmentData | Equipment;
  equipmentId?: string;   // defaults to equipmentData._id
  customerId?: string;
  className?: string;
}

export interface WishlistItem {
  _id: string;
  customerId: string;
  equipmentId: string;
  equipmentData: EquipmentData;
  addedAt: string;        // ✅ matches backend (was `createdAt`)
  updatedAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data?: WishlistItem | WishlistItem[] | null;
}




// import type { Equipment } from "@/types/equipment";

// // types/wishlist.ts
// export interface EquipmentData {
//   _id: string;
//   name?: string;
//   price?: number;
//   image?: string;
//   // extend with the real product shape as needed
//   [key: string]: unknown;
// }

// export interface WishlistButtonProps {
//   // equipmentData: EquipmentData;
//     equipmentData: EquipmentData | Equipment;
//   /** Optional override; defaults to `productData._id`. */
//   equipmentId?: string;
//   customerId?: string;
//   className?: string;
// }

// export interface WishlistItem {
//   _id: string;
//   customerId: string;
//   equipmentId: string;
//   equipmentData: EquipmentData;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface WishlistResponse {
//   success: boolean;
//   message: string;
//   data?: WishlistItem | WishlistItem[] | null;
// }