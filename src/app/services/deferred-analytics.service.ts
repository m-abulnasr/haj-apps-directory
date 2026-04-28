import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeferredAnalyticsService {
  private isLoaded = false;
  private hasUserInteracted = false;
  private pendingEvents: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeInteractionListeners();
  }

  /**
   * Initialize user interaction listeners to defer analytics loading
   * @deprecated Google Analytics is commented out
   */
  private initializeInteractionListeners(): void {
    // Google Analytics disabled - removed interaction listeners and script loading
    return;

    if (!isPlatformBrowser(this.platformId)) return;

    const interactions = ['click', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    const loadAnalytics = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.loadGoogleAnalytics();

        // Remove listeners after first interaction
        interactions.forEach(event => {
          document.removeEventListener(event, loadAnalytics);
        });
      }
    };

    // Also load after 5 seconds if no interaction
    setTimeout(() => {
      if (!this.hasUserInteracted) {
        loadAnalytics();
      }
    }, 5000);

    // Add interaction listeners
    interactions.forEach(event => {
      document.addEventListener(event, loadAnalytics, true);
    });
  }

  /**
   * Dynamically load Google Analytics script
   * @deprecated Google Analytics is commented out
   */
  private loadGoogleAnalytics(): void {
    // Google Analytics disabled - script loading removed
    return;

    if (!isPlatformBrowser(this.platformId) || this.isLoaded) return;

    // Create and inject the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-PM1CMKHFQ9';
    script.onload = () => {
      this.initializeGtag();
      this.processPendingEvents();
    };

    document.head.appendChild(script);
    this.isLoaded = true;
  }

  /**
   * Initialize gtag function and configuration
   * @deprecated Google Analytics is commented out
   */
  private initializeGtag(): void {
    // Google Analytics disabled - gtag initialization removed
    return;

    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize dataLayer and gtag function
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    // Configure Google Analytics
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', 'G-PM1CMKHFQ9', {
      // Optimize for performance
      send_page_view: false, // We'll send manually
      transport_type: 'beacon', // Use sendBeacon for better performance
      anonymize_ip: true // Privacy compliance
    });

    // Send initial page view
    this.trackPageView();
  }

  /**
   * Process any events that were queued before analytics loaded
   * @deprecated Google Analytics is commented out
   */
  private processPendingEvents(): void {
    // Google Analytics disabled - event processing removed
    this.pendingEvents = [];
  }

  /**
   * Track page view (called automatically on initialization)
   * @deprecated Google Analytics is commented out
   */
  trackPageView(page?: string): void {
    // Google Analytics disabled - page view tracking removed
    return;

    if (!isPlatformBrowser(this.platformId)) return;

    const data = {
      page_title: document.title,
      page_location: window.location.href,
      ...(page && { page_path: page })
    };

    this.sendEvent('page_view', data);
  }

  /**
   * Track custom events
   * @deprecated Google Analytics is commented out
   */
  trackEvent(action: string, data?: any): void {
    // Google Analytics disabled - event tracking removed
    return;

    this.sendEvent(action, data);
  }

  /**
   * Send event to Google Analytics (queue if not loaded yet)
   * @deprecated Google Analytics is commented out
   */
  private sendEvent(action: string, data?: any): void {
    // Google Analytics disabled - event sending removed
    return;

    if (!isPlatformBrowser(this.platformId)) return;

    if (this.isLoaded && (window as any).gtag) {
      (window as any).gtag('event', action, data);
    } else {
      // Queue the event for later processing
      this.pendingEvents.push({ action, data });
    }
  }

  /**
   * Check if analytics is loaded and ready
   * @deprecated Google Analytics is commented out
   */
  isReady(): boolean {
    // Google Analytics disabled
    return false;

    if (!isPlatformBrowser(this.platformId)) return false;
    return this.isLoaded && !!(window as any).gtag;
  }
}
