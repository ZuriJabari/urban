import { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '../monitoring';

export const usePerformanceTracking = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRender = useRef(Date.now());

  useEffect(() => {
    const renderTime = Date.now() - lastRender.current;
    renderCount.current += 1;

    PerformanceMonitor.getInstance().trackScreenRender(
      componentName,
      renderTime
    );

    lastRender.current = Date.now();

    // Track memory usage every 5 renders
    if (renderCount.current % 5 === 0) {
      PerformanceMonitor.getInstance().trackMemoryUsage();
    }
  });
};
