import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [TranslateModule, NzIconModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private metaService: Meta,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.currentLang = this.translateService.currentLang as 'ar' | 'en' || 'ar';
    this.updateSeoData();
    
    // Subscribe to language changes
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang = event.lang as 'ar' | 'en';
      this.updateSeoData();
    });
  }

  private updateSeoData() {
    const title = this.currentLang === 'ar' 
      ? 'عن قاصد | دليل تطبيقات الحج' 
      : 'About Qasid | Hajj Apps Directory';
      
    const description = this.currentLang === 'ar'
      ? 'اكتشف قاصد — دليلك الشامل لأفضل تطبيقات الحج. مبادرة من باذل لتسهيل رحلة الحاج الرقمية'
      : 'Discover Qasid — your comprehensive guide to the best Hajj apps. An initiative by Bathel to simplify the pilgrim\'s digital journey';

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    
    // Basic structured data for About page
    const breadcrumbs = [
      { name: this.currentLang === "ar" ? "الرئيسية" : "Home", url: `https://hajapps.org/${this.currentLang}` },
      { name: this.currentLang === "ar" ? "عن قاصد" : "About Qasid", url: `https://hajapps.org/${this.currentLang}/about-us` }
    ];
    
    const breadcrumbData = this.seoService.generateBreadcrumbStructuredData(breadcrumbs, this.currentLang);
    this.seoService.addStructuredData([breadcrumbData]);
  }
}