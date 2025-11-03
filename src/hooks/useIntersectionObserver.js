import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer
 * Preloads images/videos when they're about to enter viewport
 * 
 * Usage:
 * const ref = useIntersectionObserver();
 * <img ref={ref} src={url} />
 */
export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Stop observing once visible
        observer.unobserve(entry.target);
      }
    }, {
      // Start loading 200px before element enters viewport
      rootMargin: '200px',
      threshold: 0.01,
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
};

export default useIntersectionObserver;

