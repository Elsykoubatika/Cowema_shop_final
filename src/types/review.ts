
export interface Review {
  id: string;
  productId: string; // Changed from number to string
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  orderId: string;
  createdAt: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
}
