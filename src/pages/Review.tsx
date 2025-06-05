
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewForm from '../components/ReviewForm';

const Review = () => {
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');
  const customerId = searchParams.get('customerId');
  
  if (!orderId || !productId || !customerId) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-lg mx-auto my-8">
          <CardHeader>
            <CardTitle>Lien invalide</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ce lien de revue est invalide ou a expiré.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <ReviewForm 
        orderId={orderId} 
        productId={productId} // Now passing as string
        customerId={customerId} 
      />
    </div>
  );
};

export default Review;
