
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StockUpdate {
  product_id: string;
  stock: number;
  reserved_stock?: number;
  last_updated: string;
}

export const useRealTimeStock = (productId?: string) => {
  const [stockData, setStockData] = useState<Record<string, StockUpdate>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial stock data
  const fetchStock = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('products_unified')
        .select('id, stock, external_api_id');

      if (productId) {
        query = query.eq('id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stockMap: Record<string, StockUpdate> = {};
      data?.forEach(product => {
        stockMap[product.id] = {
          product_id: product.id,
          stock: product.stock,
          last_updated: new Date().toISOString()
        };
      });

      setStockData(stockMap);
    } catch (error) {
      console.error('Error fetching stock:', error);
      toast.error('Erreur lors du chargement des stocks');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Update stock for a product
  const updateStock = useCallback(async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products_unified')
        .update({ 
          stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      setStockData(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          stock: newStock,
          last_updated: new Date().toISOString()
        }
      }));

      toast.success('Stock mis à jour avec succès');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Erreur lors de la mise à jour du stock');
    }
  }, []);

  // Reserve stock for an order
  const reserveStock = useCallback(async (productId: string, quantity: number) => {
    const currentStock = stockData[productId]?.stock || 0;
    if (currentStock < quantity) {
      toast.error('Stock insuffisant');
      return false;
    }

    try {
      await updateStock(productId, currentStock - quantity);
      return true;
    } catch (error) {
      return false;
    }
  }, [stockData, updateStock]);

  // Set up real-time subscription
  useEffect(() => {
    fetchStock();

    const channel = supabase
      .channel('stock-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products_unified',
          filter: productId ? `id=eq.${productId}` : undefined
        },
        (payload) => {
          const newData = payload.new as any;
          setStockData(prev => ({
            ...prev,
            [newData.id]: {
              product_id: newData.id,
              stock: newData.stock,
              last_updated: newData.updated_at
            }
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStock, productId]);

  return {
    stockData,
    isLoading,
    updateStock,
    reserveStock,
    refetch: fetchStock
  };
};
