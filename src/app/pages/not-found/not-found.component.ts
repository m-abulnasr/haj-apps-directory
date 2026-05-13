import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NzResultModule, NzButtonModule],
  template: `
    <div class="not-found-container">
      <nz-result
        nzStatus="404"
        nzTitle="404"
        [nzSubTitle]="'ERRORS.404_SUBTITLE' | translate"
      >
        <div nz-result-extra>
          <a routerLink="/" nz-button nzType="primary">{{ 'ERRORS.BACK_HOME' | translate }}</a>
        </div>
      </nz-result>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
    }
  `]
})
export class NotFoundComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('الصفحة غير موجودة | قاصد');
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
  }
}
