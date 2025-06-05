
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../types/review';

interface ReviewState {
  reviews: Review[];
  addReview: (
    productId: string, // Changed from number to string
    customerId: string,
    customerName: string,
    rating: number,
    comment: string,
    orderId: string
  ) => Review;
  getProductReviews: (productId: string) => Review[]; // Changed from number to string
  getPendingReviews: () => Review[];
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  hasReviewedProduct: (customerId: string, productId: string) => boolean; // Changed from number to string
  getAverageRatingForProduct: (productId: string) => number; // Changed from number to string
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (productId, customerId, customerName, rating, comment, orderId) => {
        const newReview: Review = {
          id: uuidv4(),
          productId,
          customerId,
          customerName,
          rating,
          comment,
          orderId,
          createdAt: new Date().toISOString(),
          verified: true,
          status: 'approved'
        };
        
        set((state) => ({
          reviews: [...state.reviews, newReview]
        }));
        
        return newReview;
      },
      
      getProductReviews: (productId) => {
        return get().reviews.filter(
          review => review.productId === productId && review.status === 'approved'
        );
      },
      
      getPendingReviews: () => {
        return get().reviews.filter(review => review.status === 'pending');
      },
      
      approveReview: (id) => {
        set((state) => ({
          reviews: state.reviews.map(review => 
            review.id === id 
              ? { ...review, status: 'approved' } 
              : review
          )
        }));
      },
      
      rejectReview: (id) => {
        set((state) => ({
          reviews: state.reviews.map(review => 
            review.id === id 
              ? { ...review, status: 'rejected' } 
              : review
          )
        }));
      },
      
      hasReviewedProduct: (customerId, productId) => {
        return get().reviews.some(
          review => review.customerId === customerId && 
                   review.productId === productId
        );
      },
      
      getAverageRatingForProduct: (productId) => {
        const productReviews = get().reviews.filter(
          review => review.productId === productId && review.status === 'approved'
        );
        
        if (productReviews.length === 0) return 0;
        
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / productReviews.length;
      }
    }),
    {
      name: 'cowema-review-store'
    }
  )
);
