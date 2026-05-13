#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Sitemap Generator for Qasid (قاصد) - Hajj Apps Directory
 * Generates sitemap.xml with correct slug_id URLs, hreflang alternates, and proper encoding
 */

// Configuration
const CONFIG = {
  baseUrl: 'https://hajapps.org',
  languages: ['ar', 'en'],
  defaultLanguage: 'ar', // Arabic is the primary language
  outputPath: 'src/sitemap.xml',
  routesOutputPath: 'routes.txt',
  dataPath: 'src/app/services/applicationsData.ts'
};

// Static pages configuration
const STATIC_PAGES = [
  { path: 'about-us', priority: 0.6, changefreq: 'yearly' },
  { path: 'contact-us', priority: 0.6, changefreq: 'yearly' },
  { path: 'submit-app', priority: 0.6, changefreq: 'yearly' },
  { path: 'track-submission', priority: 0.5, changefreq: 'yearly' }
];

// Hajj app category slugs (synced with backend categories table)
const CATEGORIES = [
  'official-apps',
  'rituals-guidance',
  'transport-mobility',
  'health-emergency',
  'accommodation-services',
  'spiritual-enrichment',
  'maps-navigation',
  'trip-management',
  'communication-groups',
  'utility-tools'
];

/**
 * Create a URL slug from an app name (mirrors app-list.component.ts logic)
 */
function createAppSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Build the app URL param: "slug_id" format (e.g., "wahy_1_Wahy")
 * Mirrors getAppUrlParam() in app-list.component.ts
 */
function buildAppUrlParam(appId, appNameEn) {
  const slug = createAppSlug(appNameEn);
  return `${slug}_${appId}`;
}

/**
 * Parse TypeScript data file to extract app objects and developers
 */
function parseApplicationsData() {
  try {
    const dataContent = fs.readFileSync(CONFIG.dataPath, 'utf8');

    // Extract individual app objects using id + Name_En pairs
    const apps = [];
    const idPattern = /"id":\s*"([^"]+)"/g;
    const nameEnPattern = /"Name_En":\s*"([^"]+)"/g;

    // Extract all ids in order
    const ids = [];
    let idMatch;
    while ((idMatch = idPattern.exec(dataContent)) !== null) {
      ids.push(idMatch[1]);
    }

    // Extract all English names in order
    const namesEn = [];
    let nameMatch;
    while ((nameMatch = nameEnPattern.exec(dataContent)) !== null) {
      namesEn.push(nameMatch[1]);
    }

    // Pair them up
    for (let i = 0; i < ids.length && i < namesEn.length; i++) {
      apps.push({ id: ids[i], nameEn: namesEn[i] });
    }

    // Parse unique developer names for developer pages
    const developers = new Set();
    const developerMatches = dataContent.matchAll(/"Developer_Name_En":\s*"([^"]+)"/g);
    for (const match of developerMatches) {
      if (match[1] && match[1].trim()) {
        developers.add(match[1].trim());
      }
    }

    console.log(`📊 Parsed data:`);
    console.log(`   Apps: ${apps.length}`);
    console.log(`   Categories: ${CATEGORIES.length}`);
    console.log(`   Developers: ${developers.size}`);

    return {
      apps,
      categories: CATEGORIES,
      developers: Array.from(developers)
    };

  } catch (error) {
    console.error('❌ Error parsing applications data:', error.message);
    process.exit(1);
  }
}

/**
 * Create URL slug from developer name string
 */
function createDeveloperSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Escape XML special characters in attribute values
 */
function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Get current date in ISO format for lastmod
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate XML for a single URL entry with hreflang alternates
 */
function generateUrlEntry(loc, lastmod, changefreq, priority, alternateLinks = null) {
  let entry = `  <url>\n`;
  entry += `    <loc>${escapeXml(loc)}</loc>\n`;
  entry += `    <lastmod>${lastmod}</lastmod>\n`;
  entry += `    <changefreq>${changefreq}</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;

  if (alternateLinks) {
    alternateLinks.forEach(link => {
      entry += `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${escapeXml(link.href)}"/>\n`;
    });
  }

  entry += `  </url>\n`;
  return entry;
}

/**
 * Generate hreflang links for bilingual pages.
 * x-default points to the Arabic version (primary language).
 */
function generateHreflangLinks(basePath) {
  return [
    { hreflang: 'ar', href: `${CONFIG.baseUrl}/ar${basePath}` },
    { hreflang: 'en', href: `${CONFIG.baseUrl}/en${basePath}` },
    { hreflang: 'x-default', href: `${CONFIG.baseUrl}/ar${basePath}` }
  ];
}

/**
 * Generate complete sitemap XML
 */
function generateSitemap(data) {
  const currentDate = getCurrentDate();
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n`;

  let routesTxt = '';

  console.log('🔨 Generating sitemap sections...');

  // 1. Homepage URLs (Priority 1.0)
  sitemap += `  <!-- Homepage URLs - Priority 1.0 -->\n`;
  CONFIG.languages.forEach(lang => {
    const hreflangLinks = generateHreflangLinks('');
    sitemap += generateUrlEntry(
      `${CONFIG.baseUrl}/${lang}`,
      currentDate,
      'weekly',
      '1.0',
      hreflangLinks
    );
    routesTxt += `/${lang}\n`;
  });
  sitemap += '\n';

  // 2. Category Pages (Priority 0.9)
  sitemap += `  <!-- Category Pages - Priority 0.9 -->\n`;
  data.categories.forEach(category => {
    CONFIG.languages.forEach(lang => {
      const hreflangLinks = generateHreflangLinks(`/${category}`);
      sitemap += generateUrlEntry(
        `${CONFIG.baseUrl}/${lang}/${category}`,
        currentDate,
        'weekly',
        '0.9',
        hreflangLinks
      );
      routesTxt += `/${lang}/${category}\n`;
    });
  });
  sitemap += '\n';

  // 3. Individual App Pages (Priority 0.8) — using slug_id format
  sitemap += `  <!-- Individual App Pages - Priority 0.8 -->\n`;
  data.apps.forEach(app => {
    const appUrlParam = buildAppUrlParam(app.id, app.nameEn);
    // Encode the full param: slug_id may contain spaces or special chars in id
    const encodedParam = encodeURIComponent(appUrlParam);
    CONFIG.languages.forEach(lang => {
      const hreflangLinks = generateHreflangLinks(`/app/${encodedParam}`);
      sitemap += generateUrlEntry(
        `${CONFIG.baseUrl}/${lang}/app/${encodedParam}`,
        currentDate,
        'monthly',
        '0.8',
        hreflangLinks
      );
      routesTxt += `/${lang}/app/${encodedParam}\n`;
    });
  });
  sitemap += '\n';

  // 4. Developer Pages (Priority 0.7)
  sitemap += `  <!-- Developer Pages - Priority 0.7 -->\n`;
  data.developers.forEach(developer => {
    const developerSlug = createDeveloperSlug(developer);
    CONFIG.languages.forEach(lang => {
      const hreflangLinks = generateHreflangLinks(`/developer/${developerSlug}`);
      sitemap += generateUrlEntry(
        `${CONFIG.baseUrl}/${lang}/developer/${developerSlug}`,
        currentDate,
        'monthly',
        '0.7',
        hreflangLinks
      );
      routesTxt += `/${lang}/developer/${developerSlug}\n`;
    });
  });
  sitemap += '\n';

  // 5. Static Pages (Priority 0.6)
  sitemap += `  <!-- Static Pages - Priority 0.6 -->\n`;
  STATIC_PAGES.forEach(page => {
    CONFIG.languages.forEach(lang => {
      const hreflangLinks = generateHreflangLinks(`/${page.path}`);
      sitemap += generateUrlEntry(
        `${CONFIG.baseUrl}/${lang}/${page.path}`,
        currentDate,
        page.changefreq,
        page.priority.toString(),
        hreflangLinks
      );
      routesTxt += `/${lang}/${page.path}\n`;
    });
  });

  sitemap += `</urlset>\n`;

  return { sitemapXml: sitemap, routesTxt };
}

/**
 * Calculate total URLs and provide statistics
 */
function calculateStats(data) {
  const langs = CONFIG.languages.length;
  const stats = {
    homepage: langs,
    categories: data.categories.length * langs,
    apps: data.apps.length * langs,
    developers: data.developers.length * langs,
    staticPages: STATIC_PAGES.length * langs,
  };

  stats.total = stats.homepage + stats.categories + stats.apps + stats.developers + stats.staticPages;

  return stats;
}

/**
 * Main execution function
 */
function main() {
  console.log('🚀 Starting sitemap generation...\n');

  try {
    // Parse data
    const data = parseApplicationsData();

    // Calculate statistics
    const stats = calculateStats(data);
    console.log(`\n📈 URL Statistics:`);
    console.log(`   Homepage: ${stats.homepage} URLs`);
    console.log(`   Categories: ${stats.categories} URLs`);
    console.log(`   Apps: ${stats.apps} URLs`);
    console.log(`   Developers: ${stats.developers} URLs`);
    console.log(`   Static Pages: ${stats.staticPages} URLs`);
    console.log(`   📊 Total: ${stats.total} URLs`);

    // Generate sitemap and routes
    const { sitemapXml, routesTxt } = generateSitemap(data);

    // Write to files
    fs.writeFileSync(CONFIG.outputPath, sitemapXml, 'utf8');
    fs.writeFileSync(CONFIG.routesOutputPath, routesTxt, 'utf8');

    // Validate XML (basic check)
    if (sitemapXml.includes('<?xml') && sitemapXml.includes('</urlset>')) {
      console.log(`\n✅ Sitemap generated successfully!`);
      console.log(`📁 Sitemap: ${CONFIG.outputPath}`);
      console.log(`📁 Routes:  ${CONFIG.routesOutputPath}`);
      console.log(`📊 Size: ${Math.round(sitemapXml.length / 1024)} KB`);
      console.log(`🔗 URLs: ${stats.total}`);
    } else {
      throw new Error('Generated XML appears to be invalid');
    }

  } catch (error) {
    console.error('\n❌ Sitemap generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, parseApplicationsData, generateSitemap };
