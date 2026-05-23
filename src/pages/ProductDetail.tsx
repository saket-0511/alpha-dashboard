import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Package, Tag, DollarSign, BarChart2 } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(Number(id));
  const [activeImg, setActiveImg] = useState(0);

  const prev = useCallback(() => {
    if (!product) return;
    setActiveImg(i => (i - 1 + product.images.length) % product.images.length);
  }, [product]);

  const next = useCallback(() => {
    if (!product) return;
    setActiveImg(i => (i + 1) % product.images.length);
  }, [product]);

  if (loading) return (
    <div className="page-loading"><div className="spinner" /><span>Loading product…</span></div>
  );
  if (error || !product) return (
    <div className="page-loading"><span style={{ color: 'var(--red)' }}>Product not found.</span></div>
  );

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const inventoryValue = (product.price * product.stock).toFixed(0);

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate('/products')}>
        <ArrowLeft size={14} /> Back to Products
      </button>

      <div className="detail-layout">
        {/* Carousel */}
        <div className="carousel-section">
          <div className="carousel-main">
            <img
              src={product.images[activeImg] || product.thumbnail}
              alt={product.title}
              className="carousel-img"
              onError={e => { (e.target as HTMLImageElement).src = product.thumbnail; }}
            />
            {product.images.length > 1 && (
              <>
                <button className="carousel-btn carousel-btn--left" onClick={prev}>
                  <ChevronLeft size={18} />
                </button>
                <button className="carousel-btn carousel-btn--right" onClick={next}>
                  <ChevronRight size={18} />
                </button>
                <div className="carousel-dots">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      className={`dot ${i === activeImg ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="carousel-thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`thumb ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  onError={e => { (e.target as HTMLImageElement).src = product.thumbnail; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-cat">
            <Tag size={12} />
            {product.category}
          </div>
          <h1 className="detail-title">{product.title}</h1>
          {product.brand && <div className="detail-brand">by {product.brand}</div>}

          <div className="detail-rating">
            <span className="big-stars">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className="rating-val">{product.rating.toFixed(1)}</span>
          </div>

          <div className="price-section">
            <div className="detail-price">${discountedPrice}</div>
            {product.discountPercentage > 0 && (
              <>
                <div className="original-price">${product.price}</div>
                <div className="discount-badge">-{product.discountPercentage.toFixed(0)}%</div>
              </>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stats-grid">
            <div className="detail-stat">
              <Package size={14} />
              <div>
                <div className="ds-label">Stock</div>
                <div className={`ds-val ${product.stock === 0 ? 'red' : product.stock < 20 ? 'yellow' : 'green'}`}>
                  {product.stock} units
                </div>
              </div>
            </div>
            <div className="detail-stat">
              <DollarSign size={14} />
              <div>
                <div className="ds-label">Inventory Value</div>
                <div className="ds-val green">${Number(inventoryValue).toLocaleString()}</div>
              </div>
            </div>
            <div className="detail-stat">
              <BarChart2 size={14} />
              <div>
                <div className="ds-label">Discount</div>
                <div className="ds-val">{product.discountPercentage.toFixed(1)}%</div>
              </div>
            </div>
            <div className="detail-stat">
              <Star size={14} />
              <div>
                <div className="ds-label">Rating</div>
                <div className="ds-val yellow">{product.rating} / 5</div>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-primary" style={{ flex: 1 }}>Add to Cart</button>
            <button className="btn-secondary">Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
