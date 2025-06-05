
import { useState } from 'react';
import { DiscountType, PromoTarget } from '../../../hooks/usePromotionStore';

interface BatchGenerationState {
  prefix: string;
  count: number;
  discount: number;
  discountType: DiscountType;
  expiryDays: number;
  minPurchaseAmount: number;
  usageLimit: number | null;
  target: PromoTarget;
}

export const useGenerateCodesForm = (onGenerate: (options: BatchGenerationState) => void) => {
  const [batchGeneration, setBatchGeneration] = useState<BatchGenerationState>({
    prefix: 'PROMO',
    count: 5,
    discount: 10,
    discountType: 'percentage',
    expiryDays: 30,
    minPurchaseAmount: 0,
    usageLimit: null,
    target: 'all'
  });

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setBatchGeneration(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setBatchGeneration(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle usage limit changes (can be null)
  const handleUsageLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    setBatchGeneration(prev => ({
      ...prev,
      usageLimit: value
    }));
  };

  // Generate example code display
  const getExampleCode = () => {
    return `${batchGeneration.prefix}XXXX`;
  };

  // Generate codes
  const handleGenerateCodes = () => {
    onGenerate(batchGeneration);
  };

  return {
    batchGeneration,
    handleFormChange,
    handleSelectChange,
    handleUsageLimitChange,
    getExampleCode,
    handleGenerateCodes
  };
};
