export interface Equipment {
  _id: string;

  // New (rental) fields
  equipmentName?: string;
  equipmentImage?: string;
  rentalPrice?: number;
  rentalType?: string;
  location?: string;
  availabilityStatus?: string;

  // Legacy (add-equipment form) fields
  title?: string;
  price?: number;
  stock?: number;
  category?: string;
  condition?: string;
  description?: string;
  image?: string;
  status?: "Pending" | "Approved" | "Rejected";

  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerAddress?: string;
  ownerPhone?: string;
  createdAt?: string;
}
