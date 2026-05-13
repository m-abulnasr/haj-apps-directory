import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  /**
   * Add or update the canonical URL link tag
   */
  setCanonical(url: string) {
    const head = this.doc.head;
    let link: HTMLLinkElement | null = head.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  /**
   * Remove the canonical link tag if it exists
   */
  removeCanonical() {
    const link = this.doc.head.querySelector('link[rel="canonical"]');
    if (link) {
      this.doc.head.removeChild(link);
    }
  }

  /**
   * Add or update hreflang link tags
   * @param links Array of objects with hreflang and href
   */
  setHreflang(links: { hreflang: string; href: string }[]) {
    const head = this.doc.head;
    
    // Remove existing hreflang tags
    this.removeHreflang();
    
    // Add new ones
    links.forEach(linkInfo => {
      const link: HTMLLinkElement = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', linkInfo.hreflang);
      link.setAttribute('href', linkInfo.href);
      head.appendChild(link);
    });
  }

  /**
   * Remove all existing hreflang link tags
   */
  removeHreflang() {
    const existingLinks = this.doc.head.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => this.doc.head.removeChild(link));
  }
}
