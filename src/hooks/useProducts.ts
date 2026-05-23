import { useState, useEffect, useCallback } from 'react';
import { Product, ProductsResponse } from '../types';

const CACHE = new Map<string, any>();

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = 'all-products';
    if (CACHE.has(key)) {
      setAllProducts(CACHE.get(key));
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('https://dummyjson.com/products?limit=194&skip=0')
      .then(r => r.json())
      .then((data: ProductsResponse) => {
        CACHE.set(key, data.products);
        setAllProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return { allProducts, loading, error };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(() => {
    const key = `product-${id}`;
    if (CACHE.has(key)) {
      setProduct(CACHE.get(key));
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then(r => r.json())
      .then((data: Product) => {
        CACHE.set(key, data);
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { product, loading, error };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
