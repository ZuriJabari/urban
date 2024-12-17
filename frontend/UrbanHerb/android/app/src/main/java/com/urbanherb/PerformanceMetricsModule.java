// frontend/UrbanHerb/android/app/src/main/java/com/urbanherb/PerformanceMetricsModule.java
package com.urbanherb;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class PerformanceMetricsModule extends ReactContextBaseJavaModule {
    @Override
    public String getName() {
        return "PerformanceMetrics";
    }

    @ReactMethod
    public void getMemoryUsage(Callback callback) {
        Runtime runtime = Runtime.getRuntime();
        long usedMemory = runtime.totalMemory() - runtime.freeMemory();
        callback.invoke(usedMemory);
    }
}