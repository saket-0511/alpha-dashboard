import React, { useMemo, useCallback, useState, useEffect, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, LayoutGrid, List } from 'lucide-react';
import { useProducts, useDebounce } from '../hooks/useProducts';
import { Product, SortField, SortOrder } from '../types';
import './Products.css';

const PAGE_SIZE = 12;

const StockBadge = memo(({ stock }: { stock: number }) => {
  const cls = stock === 0 ? 'badge-red' : stock < 20 ? 'badge-yellow' : 'badge-green';
  const label = stock === 0 ? 'Out of Stock' : stock < 20 ? 'Low Stock' : 'In Stock';
  return <span className={`badge ${cls}`}>{label}</span>;
});

const Stars = memo(({ rating }: { rating: number }) => (
  <span className="stars">
    {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    <span className="rating-num">{rating.toFixed(1)}</span>
  </span>
));

const ProductRow = memo(({ product, onClick }: { product: Product; onClick: () => void }) => (
  <tr className="product-row" onClick={onClick}>
    <td>
      <div className="product-cell">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <div>
          <div className="product-name">{product.title}</div>
          <div className="product-brand">{product.brand}</div>
        </div>
      </div>
    </td>
    <td><span className="cat-pill">{product.category}</span></td>
    <td className="price-cell">${product.price}</td>
    <td><StockBadge stock={product.stock} /></td>
    <td><Stars rating={product.rating} /></td>
    <td>
      <button className="view-btn"><Eye size={13} /> View</button>
    </td>
  </tr>
));

const ProductCard = memo(({ product, onClick }: { product: Product; onClick: () => void }) => (
  <div className="product-card" onClick={onClick}>
    <img src={product.thumbnail} alt={product.title} loading="lazy" />
    <div className="product-card-body">
      <span className="cat-pill">{product.category}</span>
      <div className="product-card-title">{product.title}</div>
      <div className="product-card-footer">
        <span className="price-cell">${product.price}</span>
        <Stars rating={product.rating} />
      </div>
      <StockBadge stock={product.stock} />
    </div>
  </div>
));

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, loading } = useProducts();

  // URL state
  const searchRaw = searchParams.get('search') || '';
  const categoriesRaw = searchParams.get('category') || '';
  const sort = (searchParams.get('sort') || 'title') as SortField;
  const order = (searchParams.get('order') || 'asc') as SortOrder;
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchRaw);
  const debouncedSearch = useDebounce(searchInput, 300);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategories = useMemo(() =>
    categoriesRaw ? categoriesRaw.split(',').filter(Boolean) : [], [categoriesRaw]);

  const allCategories = useMemo(() =>
    Array.from(new Set(allProducts.map(p => p.category))).sort(), [allProducts]);

  // Sync debounced search to URL
  useEffect(() => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (debouncedSearch) p.set('search', debouncedSearch); else p.delete('search');
      p.set('page', '1');
      return p;
    }, { replace: true });
  }, [debouncedSearch]);

  const setSort = useCallback((field: SortField) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (p.get('sort') === field) {
        p.set('order', p.get('order') === 'asc' ? 'desc' : 'asc');
      } else {
        p.set('sort', field);
        p.set('order', 'asc');
      }
      p.set('page', '1');
      return p;
    });
  }, [setSearchParams]);

  const toggleCategory = useCallback((cat: string) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      const cats = p.get('category') ? p.get('category')!.split(',').filter(Boolean) : [];
      const idx = cats.indexOf(cat);
      if (idx >= 0) cats.splice(idx, 1); else cats.push(cat);
      if (cats.length) p.set('category', cats.join(',')); else p.delete('category');
      p.set('page', '1');
      return p;
    });
  }, [setSearchParams]);

  const setPage = useCallback((n: number) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('page', String(n));
      return p;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const filtered = useMemo(() => {
    let result = allProducts;
    const q = debouncedSearch.toLowerCase();
    if (q) result = result.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
    if (selectedCategories.length) result = result.filter(p => selectedCategories.includes(p.category));
    result = [...result].sort((a, b) => {
      const av = sort === 'title' ? a.title : sort === 'price' ? a.price : sort === 'rating' ? a.rating : a.stock;
      const bv = sort === 'title' ? b.title : sort === 'price' ? b.price : sort === 'rating' ? b.rating : b.stock;
      return order === 'asc' ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
    });
    return result;
  }, [allProducts, debouncedSearch, selectedCategories, sort, order]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() =>
    filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort !== field) return <ChevronUp size={12} className="sort-icon inactive" />;
    return order === 'asc' ? <ChevronUp size={12} className="sort-icon" /> : <ChevronDown size={12} className="sort-icon" />;
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">{filtered.length} products found</p>
        </div>
        <div className="products-header-actions">
          <button className={`view-toggle ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}><List size={14} /></button>
          <button className={`view-toggle ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><LayoutGrid size={14} /></button>
        </div>
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search products…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
        <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(f => !f)}>
          <SlidersHorizontal size={14} />
          Filters
          {selectedCategories.length > 0 && <span className="filter-count">{selectedCategories.length}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-label">Categories</div>
          <div className="cat-list">
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button className="cat-btn clear-btn" onClick={() => {
                setSearchParams(prev => { const p = new URLSearchParams(prev); p.delete('category'); return p; });
              }}>✕ Clear</button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="page-loading"><div className="spinner" /><span>Loading products…</span></div>
      ) : view === 'table' ? (
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th onClick={() => setSort('title')} className="sortable">Product <SortIcon field="title" /></th>
                <th>Category</th>
                <th onClick={() => setSort('price')} className="sortable">Price <SortIcon field="price" /></th>
                <th>Stock</th>
                <th onClick={() => setSort('rating')} className="sortable">Rating <SortIcon field="rating" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <ProductRow key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />
              ))}
            </tbody>
          </table>
          {paginated.length === 0 && (
            <div className="empty-state">No products match your filters.</div>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {paginated.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let n = i + 1;
            if (totalPages > 7) {
              if (page <= 4) n = i + 1;
              else if (page >= totalPages - 3) n = totalPages - 6 + i;
              else n = page - 3 + i;
            }
            return (
              <button key={n} className={`page-btn ${n === page ? 'active' : ''}`} onClick={() => setPage(n)}>
                {n}
              </button>
            );
          })}
          <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight size={14} />
          </button>
          <span className="page-info mono">{page} / {totalPages}</span>
        </div>
      )}
    </div>
  );
}
