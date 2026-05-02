import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  /**
   * Add JSON-LD structured data to the page
   * @param data The structured data object
   */
  addStructuredData(data: any): void {
    // Only manipulate DOM in browser context
    if (!isPlatformBrowser(this.platformId)) return;

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);

    // Remove existing structured data script if exists
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    this.document.head.appendChild(script);
  }

  /**
   * Generate structured data for the main website
   */
  generateWebsiteStructuredData(lang: 'ar' | 'en'): any {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": lang === 'ar' ? "قاصد - دليل تطبيقات الحج" : "Qasid - Hajj Apps Directory",
      "alternateName": lang === 'ar' ? "دليل تطبيقات الحج" : "Hajj Apps Directory",
      "url": "https://hajapps.org/",
      "description": lang === 'ar'
        ? "كل ما تحتاجه من تطبيقات الحج… في مكان واحد"
        : "Everything you need in Hajj apps, in one place",
      "inLanguage": lang,
      "publisher": {
        "@type": "Organization",
        "name": lang === 'ar' ? "باذل" : "Bathel",
        "url": "https://hajapps.org/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hajapps.org/assets/images/logo-with-text.png"
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `https://hajapps.org/${lang}?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    return baseData;
  }

  /**
   * Generate structured data for app listings page
   */
  generateItemListStructuredData(apps: any[], category: string | null, lang: 'ar' | 'en'): any {
    const categoryNames = {
      'ar': {
        'mushaf': 'تطبيقات المصحف',
        'tafsir': 'تطبيقات التفسير',
        'translations': 'تطبيقات الترجمة',
        'audio': 'التلاوات الصوتية',
        'recite': 'تطبيقات التسميع',
        'kids': 'تطبيقات الأطفال',
        'riwayat': 'الروايات القرآنية',
        'tajweed': 'تطبيقات التجويد'
      },
      'en': {
        'mushaf': 'Mushaf Apps',
        'tafsir': 'Tafsir Apps',
        'translations': 'Translation Apps',
        'audio': 'Audio Recitations',
        'recite': 'Recitation Apps',
        'kids': 'Kids Apps',
        'riwayat': 'Quran Narrations',
        'tajweed': 'Tajweed Apps'
      }
    };

    const items = apps.slice(0, 20).map((app, index) => ({
      "@type": "SoftwareApplication",
      "position": index + 1,
      "name": lang === 'ar' ? app.Name_Ar : app.Name_En,
      "description": lang === 'ar' ? app.Short_Description_Ar : app.Short_Description_En,
      "url": `https://quran-apps.itqan.dev/${lang}/app/${app.id}`,
      "image": app.applicationIcon,
      "applicationCategory": "MobileApplication",
      "operatingSystem": ["Android", "iOS"],
      "aggregateRating": app.Apps_Avg_Rating ? {
        "@type": "AggregateRating",
        "ratingValue": app.Apps_Avg_Rating,
        "ratingCount": "100+",
        "bestRating": 5,
        "worstRating": 1
      } : undefined,
      "author": {
        "@type": "Organization",
        "name": lang === 'ar' ? app.Developer_Name_Ar : app.Developer_Name_En
      }
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": category 
        ? (lang === 'ar' ? categoryNames.ar[category as keyof typeof categoryNames.ar] : categoryNames.en[category as keyof typeof categoryNames.en])
        : (lang === 'ar' ? "جميع تطبيقات القرآن الكريم" : "All Quran Applications"),
      "description": category 
        ? `${lang === 'ar' ? 'أفضل' : 'Best'} ${category} ${lang === 'ar' ? 'للقرآن الكريم' : 'for Holy Quran'}`
        : (lang === 'ar' ? "مجموعة شاملة من تطبيقات القرآن الكريم" : "Comprehensive collection of Quran applications"),
      "url": `https://quran-apps.itqan.dev/${lang}${category ? `/${category}` : ''}`,
      "numberOfItems": apps.length,
      "itemListElement": items
    };
  }

  /**
   * Generate structured data for individual app page
   */
  generateAppStructuredData(app: any, lang: 'ar' | 'en'): any {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": lang === 'ar' ? app.Name_Ar : app.Name_En,
      "description": lang === 'ar' ? app.Description_Ar : app.Description_En,
      "url": `https://quran-apps.itqan.dev/${lang}/app/${app.id}`,
      "image": app.applicationIcon,
      "screenshot": lang === 'ar' ? app.screenshots_ar : app.screenshots_en,
      "applicationCategory": "MobileApplication",
      "operatingSystem": ["Android", "iOS"],
      "aggregateRating": app.Apps_Avg_Rating ? {
        "@type": "AggregateRating",
        "ratingValue": app.Apps_Avg_Rating,
        "ratingCount": "100+",
        "bestRating": 5,
        "worstRating": 1
      } : undefined,
      "author": {
        "@type": "Organization",
        "name": lang === 'ar' ? app.Developer_Name_Ar : app.Developer_Name_En,
        "url": app.Developer_Website || undefined,
        "logo": app.Developer_Logo || undefined
      },
      "downloadUrl": [
        app.Google_Play_Link,
        app.AppStore_Link,
        app.App_Gallery_Link
      ].filter(Boolean),
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "keywords": app.categories?.join(', '),
      "inLanguage": lang
    };
  }

  /**
   * Generate BreadcrumbList structured data
   */
  generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>, lang: 'ar' | 'en'): any {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  /**
   * Generate Organization structured data
   */
  generateOrganizationStructuredData(lang: 'ar' | 'en'): any {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": lang === 'ar' ? "باذل" : "Bathel",
      "alternateName": lang === 'ar' ? "قاصد" : "Qasid",
      "url": "https://hajapps.org/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hajapps.org/assets/images/logo-with-text.png",
        "width": 400,
        "height": 100
      },
      "description": lang === 'ar'
        ? "كل ما تحتاجه من تطبيقات الحج… في مكان واحد"
        : "Everything you need in Hajj apps, in one place",
      "specialty": lang === 'ar' ? "تطبيقات الحج والعمرة" : "Hajj and Umrah Applications",
      "knowsAbout": [
        lang === 'ar' ? "تطبيقات الحج" : "Hajj Applications",
        lang === 'ar' ? "تطبيقات العمرة" : "Umrah Applications",
        lang === 'ar' ? "التطبيقات الإسلامية" : "Islamic Apps"
      ],
      "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": `https://hajapps.org/${lang}/contact-us`,
        "email": "info@bathel.sa",
        "availableLanguage": ["Arabic", "English"]
      }],
      "areaServed": "Worldwide",
      "audience": {
        "@type": "Audience",
        "audienceType": lang === 'ar' ? "حجاج بيت الله والمسلمون" : "Pilgrims and Muslims"
      }
    };
  }

  /**
   * Generate FAQ structured data
   */
  generateFAQStructuredData(lang: 'ar' | 'en'): any {
    const faqs = lang === 'ar' ? [
      {
        question: "ما هو دليل التطبيقات القرآنية؟",
        answer: "دليل شامل يضم أفضل تطبيقات القرآن الكريم المتاحة للأجهزة المحمولة، يشمل تطبيقات المصحف والتفسير والتلاوة والتحفيظ والتدبر."
      },
      {
        question: "كم عدد التطبيقات المتوفرة في الدليل؟",
        answer: "يحتوي الدليل على أكثر من 40 تطبيقاً قرآنياً متنوعاً، مع معلومات مفصلة عن كل تطبيق وتقييمات المستخدمين."
      },
      {
        question: "هل التطبيقات مجانية؟",
        answer: "معظم التطبيقات المدرجة مجانية، ونوضح بوضوح التطبيقات المدفوعة مع تفاصيل الأسعار والميزات."
      },
      {
        question: "كيف يتم اختيار التطبيقات؟",
        answer: "نختار التطبيقات بناءً على معايير الجودة والأمان وتقييمات المستخدمين والميزات المتوفرة ومدى مطابقتها لتعاليم الإسلام."
      }
    ] : [
      {
        question: "What is the Quran Apps Directory?",
        answer: "A comprehensive directory featuring the best Quran applications available for mobile devices, including Mushaf, Tafsir, recitation, memorization, and reflection apps."
      },
      {
        question: "How many apps are available in the directory?",
        answer: "The directory contains over 40 diverse Quran applications, with detailed information about each app and user ratings."
      },
      {
        question: "Are the apps free?",
        answer: "Most listed applications are free, and we clearly indicate paid apps with pricing details and features."
      },
      {
        question: "How are apps selected?",
        answer: "We select apps based on quality criteria, security, user ratings, available features, and compliance with Islamic teachings."
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  /**
   * Generate CollectionPage structured data
   */
  generateCollectionPageStructuredData(category: string, apps: any[], lang: 'ar' | 'en'): any {
    const categoryMap = {
      'ar': {
        'Mushaf': 'تطبيقات المصحف الشريف',
        'Tafsir': 'تطبيقات التفسير',
        'Translations': 'تطبيقات الترجمة',
        'Audio': 'التلاوات الصوتية',
        'Recite': 'تطبيقات التسميع',
        'Kids': 'تطبيقات الأطفال',
        'Riwayat': 'الروايات القرآنية',
        'Tajweed': 'تطبيقات التجويد',
        'Memorize': 'تطبيقات التحفيظ',
        'Accessibility': 'تطبيقات إمكانية الوصول',
        'Tools': 'أدوات قرآنية'
      },
      'en': {
        'Mushaf': 'Mushaf Applications',
        'Tafsir': 'Tafsir Applications', 
        'Translations': 'Translation Applications',
        'Audio': 'Audio Recitations',
        'Recite': 'Recitation Applications',
        'Kids': 'Kids Applications',
        'Riwayat': 'Quran Narrations',
        'Tajweed': 'Tajweed Applications',
        'Memorize': 'Memorization Applications',
        'Accessibility': 'Accessibility Applications',
        'Tools': 'Quranic Tools'
      }
    };

    const categoryName = categoryMap[lang][category as keyof typeof categoryMap['ar']] || category;

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": categoryName,
      "description": lang === 'ar' 
        ? `مجموعة مختارة من أفضل ${categoryName} للقرآن الكريم`
        : `Curated collection of the best ${categoryName} for the Holy Quran`,
      "url": `https://quran-apps.itqan.dev/${lang}/${category}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": apps.length,
        "itemListElement": apps.slice(0, 20).map((app, index) => ({
          "@type": "SoftwareApplication",
          "position": index + 1,
          "name": lang === 'ar' ? app.Name_Ar : app.Name_En,
          "url": `https://quran-apps.itqan.dev/${lang}/app/${app.id}`
        }))
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": lang === 'ar' ? "الرئيسية" : "Home",
          "item": `https://quran-apps.itqan.dev/${lang}`
        }, {
          "@type": "ListItem",
          "position": 2,
          "name": categoryName,
          "item": `https://quran-apps.itqan.dev/${lang}/${category}`
        }]
      }
    };
  }

  /**
   * Generate enhanced SoftwareApplication with more details
   */
  generateEnhancedAppStructuredData(app: any, lang: 'ar' | 'en'): any {
    const baseSchema = this.generateAppStructuredData(app, lang);
    
    return {
      ...baseSchema,
      "applicationSuite": "Quran Applications",
      "installUrl": app.Google_Play_Link || app.AppStore_Link,
      "memoryRequirements": "50MB",
      "storageRequirements": "100MB",
      "permissions": ["INTERNET", "STORAGE"],
      "softwareVersion": "Latest",
      "releaseNotes": lang === 'ar' 
        ? "تحديثات وتحسينات على الأداء والواجهة"
        : "Performance improvements and UI enhancements",
      "applicationSubCategory": app.categories?.join(', '),
      "countryOfOrigin": "Multiple",
      "featureList": [
        lang === 'ar' ? "قراءة القرآن الكريم" : "Quran Reading",
        lang === 'ar' ? "واجهة سهلة الاستخدام" : "User-friendly Interface",
        lang === 'ar' ? "دعم متعدد اللغات" : "Multi-language Support"
      ],
      "softwareRequirements": [
        "Android 5.0+",
        "iOS 12.0+"
      ],
      "copyrightHolder": {
        "@type": "Organization",
        "name": lang === 'ar' ? app.Developer_Name_Ar : app.Developer_Name_En
      },
      "maintainer": {
        "@type": "Organization", 
        "name": lang === 'ar' ? app.Developer_Name_Ar : app.Developer_Name_En,
        "url": app.Developer_Website
      }
    };
  }

  /**
   * Generate Person/Organization schema for developers
   */
  generateDeveloperStructuredData(developer: any, lang: 'ar' | 'en'): any {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": lang === 'ar' ? developer.Developer_Name_Ar : developer.Developer_Name_En,
      "url": developer.Developer_Website || `https://quran-apps.itqan.dev/${lang}/developer/${developer.Developer_Name_En?.toLowerCase().replace(/\s+/g, '-')}`,
      "logo": {
        "@type": "ImageObject",
        "url": developer.Developer_Logo
      },
      "description": lang === 'ar' 
        ? `مطور تطبيقات قرآنية متخصص في تقنيات القرآن الكريم`
        : `Quran app developer specialized in Islamic mobile applications`,
      "specialty": lang === 'ar' ? "تطبيقات القرآن الكريم" : "Quran Applications",
      "makesOffer": {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "SoftwareApplication",
          "applicationCategory": "MobileApplication"
        }
      }
    };
  }
}
