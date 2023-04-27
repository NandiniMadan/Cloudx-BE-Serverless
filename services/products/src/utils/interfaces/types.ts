export interface ProductInterface {
    id: number;
    title: string;
    description: string;
    image: string;
    rating: number;
    released: string;
    platforms: string;
    genres: string;
    price: number;
}

export interface StockInterface {
    id: number;
    product_id: number;
    count: number;
}

// Used by auto-swagger generator
export type Product = ProductInterface;
export type Products = Product[];
export type AvailableProduct = ProductInterface & StockInterface;
export type AvailableProducts = AvailableProduct[];