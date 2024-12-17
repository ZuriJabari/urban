// frontend/UrbanHerb/src/utils/monitoring.ts
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Metric {
  metric: string;
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metricsQueue: Metric[] = [];
  private isUploading = false;
  private readonly MAX_QUEUE_SIZE = 1000;
  private readonly UPLOAD_INTERVAL = 30000;
  private readonly RETRY_ATTEMPTS = 3;
  private readonly METRICS_STORAGE_KEY = '@performance_metrics';

  private constructor() {
    this.loadPersistedMetrics();
    this.setupPeriodicUpload();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private async loadPersistedMetrics() {
    try {
      const persistedMetrics = await AsyncStorage.getItem(this.METRICS_STORAGE_KEY);
      if (persistedMetrics) {
        this.metricsQueue = [...this.metricsQueue, ...JSON.parse(persistedMetrics)];
      }
    } catch (error) {
      console.error('Failed to load persisted metrics:', error);
    }
  }

  private async persistMetrics() {
    try {
      await AsyncStorage.setItem(
        this.METRICS_STORAGE_KEY,
        JSON.stringify(this.metricsQueue)
      );
    } catch (error) {
      console.error('Failed to persist metrics:', error);
    }
  }

  trackScreenRender(screenName: string, duration: number) {
    if (this.metricsQueue.length >= this.MAX_QUEUE_SIZE) {
      this.metricsQueue.shift(); // Remove oldest metric
    }

    this.metricsQueue.push({
      metric: 'screen_render',
      value: duration,
      labels: { screen: screenName },
      timestamp: Date.now()
    });

    this.persistMetrics();
  }

  trackMemoryUsage() {
    if (NativeModules.PerformanceMetrics) {
      NativeModules.PerformanceMetrics.getMemoryUsage((error: Error | null, memoryUsage: number) => {
        if (error) {
          console.error('Failed to get memory usage:', error);
          return;
        }

        if (this.metricsQueue.length >= this.MAX_QUEUE_SIZE) {
          this.metricsQueue.shift();
        }

        this.metricsQueue.push({
          metric: 'memory_usage',
          value: memoryUsage,
          labels: {},
          timestamp: Date.now()
        });

        this.persistMetrics();
      });
    }
  }

  private async uploadWithRetry(metrics: Metric[], attempt = 1): Promise<boolean> {
    try {
      const response = await fetch(process.env.METRICS_ENDPOINT || 'http://localhost:9091/metrics/job/react-native', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error);
      
      if (attempt < this.RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.uploadWithRetry(metrics, attempt + 1);
      }
      
      return false;
    }
  }

  private async uploadMetrics() {
    if (this.isUploading || this.metricsQueue.length === 0) return;

    this.isUploading = true;
    const metricsToUpload = this.metricsQueue.slice(0, 100);

    try {
      const success = await this.uploadWithRetry(metricsToUpload);
      
      if (success) {
        this.metricsQueue = this.metricsQueue.slice(100);
        await this.persistMetrics();
      }
    } catch (error) {
      console.error('Failed to upload metrics:', error);
    } finally {
      this.isUploading = false;
    }
  }

  private setupPeriodicUpload() {
    setInterval(() => {
      this.uploadMetrics();
    }, this.UPLOAD_INTERVAL);
  }

  // Public method to force upload (useful for testing)
  async forceUpload(): Promise<boolean> {
    if (this.isUploading) return false;
    await this.uploadMetrics();
    return true;
  }
}

// Custom hook for performance monitoring
export const usePerformanceMonitoring = (screenName: string) => {
  const startTime = Date.now();

  return () => {
    const duration = Date.now() - startTime;
    PerformanceMonitor.getInstance().trackScreenRender(screenName, duration);
  };
};
