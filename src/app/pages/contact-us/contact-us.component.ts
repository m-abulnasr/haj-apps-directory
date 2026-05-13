import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [TranslateModule, LucideAngularModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
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
      ? 'تواصل معنا | قاصد' 
      : 'Contact Us | Qasid';
      
    const description = this.currentLang === 'ar'
      ? 'تواصل مع فريق قاصد — نسعد باستقبال ملاحظاتكم واقتراحاتكم'
      : 'Get in touch with the Qasid team — we welcome your feedback and suggestions';

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    
    const breadcrumbs = [
      { name: this.currentLang === "ar" ? "الرئيسية" : "Home", url: `https://hajapps.org/${this.currentLang}` },
      { name: this.currentLang === "ar" ? "تواصل معنا" : "Contact Us", url: `https://hajapps.org/${this.currentLang}/contact-us` }
    ];
    
    const breadcrumbData = this.seoService.generateBreadcrumbStructuredData(breadcrumbs, this.currentLang);
    this.seoService.addStructuredData([breadcrumbData]);
  }
}