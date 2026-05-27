import React, { createContext, useContext, useState, useCallback } from 'react';

interface PublishedContextType {
  publishedIds: Set<number>;
  togglePublished: (id: number) => void;
  isPublished: (id: number) => boolean;
  publishAll: (ids: number[]) => void;
}

const PublishedContext = createContext<PublishedContextType | null>(null);

export function PublishedProvider({ children }: { children: React.ReactNode }) {
  // By default, products with even IDs are published (simulating mixed state)
  const [publishedIds, setPublishedIds] = useState<Set<number>>(() => {
    const saved = sessionStorage.getItem('published_ids');
    if (saved) return new Set(JSON.parse(saved));
    // Default: first 150 products published
    return new Set(Array.from({ length: 150 }, (_, i) => i + 1));
  });

  const togglePublished = useCallback((id: number) => {
    setPublishedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      sessionStorage.setItem('published_ids', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const isPublished = useCallback((id: number) => publishedIds.has(id), [publishedIds]);

  const publishAll = useCallback((ids: number[]) => {
    setPublishedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      sessionStorage.setItem('published_ids', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  return (
    <PublishedContext.Provider value={{ publishedIds, togglePublished, isPublished, publishAll }}>
      {children}
    </PublishedContext.Provider>
  );
}

export function usePublished() {
  const ctx = useContext(PublishedContext);
  if (!ctx) throw new Error('usePublished must be used within PublishedProvider');
  return ctx;
}
