import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Prerender home pages (English and Arabic) at build time
  {
    path: 'en',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'ar',
    renderMode: RenderMode.Prerender
  },
  // All other routes use server-side rendering (home pages are prerendered via routes.txt)
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
