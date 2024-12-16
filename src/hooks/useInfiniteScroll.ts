import { useState, useEffect } from 'react';

export function useInfiniteScroll<T>() {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    // Implement API call here
    // For now, we'll simulate data loading
  }, [page]);

  return { items, loadMore, hasMore };
}