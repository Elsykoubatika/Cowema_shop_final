
export interface SelectedUpsell {
  name: string;
  isAdded: boolean;
  discount: number;
  price?: number;
  image?: string;
}

export interface UpsellProduct {
  name: string;
  discount: number;
  image: string;
  price?: number;
  description?: string;
}
