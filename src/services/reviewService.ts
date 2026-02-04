import api from './api';

export interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const reviewService = {
  // Get all reviews for a product
  getProductReviews: async (productId: string | number): Promise<Review[]> => {
    try {
      const response = await api.get(`/reviews/products/${productId}`);
      return response.data.data || []; // Backend returns { success, message, data }
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      // Return empty array for now
      return [];
    }
  },

  // Get review statistics for a product
  getProductReviewStats: async (productId: string | number): Promise<ReviewStats> => {
    try {
      const response = await api.get(`/reviews/product/${productId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      // Return default stats
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  },

  // Submit a new review
  submitReview: async (reviewData: {
    productId: string | number;
    rating: number;
    title: string;
    comment: string;
  }): Promise<Review> => {
    try {
      // Backend expects productId, rating, and comment (no title)
      const response = await api.post('/reviews', {
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: `${reviewData.title}\n\n${reviewData.comment}` // Combine title and comment
      });
      return response.data.data; // Backend returns { success, message, data }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId: string, reviewData: {
    rating?: number;
    title?: string;
    comment?: string;
  }): Promise<Review> => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<void> => {
    try {
      await api.delete(`/reviews/${reviewId}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Mark review as helpful
  markHelpful: async (reviewId: string): Promise<void> => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`);
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  },

  // Get user's review for a product (if they've already reviewed)
  getUserReview: async (productId: string | number): Promise<Review | null> => {
    try {
      const response = await api.get(`/reviews/user/product/${productId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // User hasn't reviewed this product
      }
      console.error('Error fetching user review:', error);
      return null;
    }
  }
};

export default reviewService;
