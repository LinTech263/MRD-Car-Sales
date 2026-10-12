import { Car, GuideArticle, DealershipSettings, Category } from '../types';

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function updatePageSEO(config: SEOConfig, settings: DealershipSettings): void {
  if (typeof document === 'undefined') return;

  // 1. Document Title
  document.title = config.title;

  // Helper for setting meta tags
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Meta description
  setMeta('name', 'description', config.description);

  // 3. Robots / Noindex
  if (config.noindex) {
    setMeta('name', 'robots', 'noindex, nofollow');
  } else {
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
  }

  // 4. OpenGraph
  setMeta('property', 'og:title', config.title);
  setMeta('property', 'og:description', config.description);
  setMeta('property', 'og:type', config.ogType || 'website');
  setMeta('property', 'og:site_name', settings.businessName);

  const fallbackImage = settings.heroImageUrl || '/assets/images/hero_luxury_showroom_1791464684452.jpg';
  setMeta('property', 'og:image', config.ogImage || fallbackImage);

  // 5. Twitter Card
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', config.title);
  setMeta('name', 'twitter:description', config.description);
  setMeta('name', 'twitter:image', config.ogImage || fallbackImage);

  // 6. Canonical URL
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  const appBaseUrl = window.location.origin;
  const canonical = config.canonicalUrl || (appBaseUrl + window.location.pathname);
  canonicalEl.setAttribute('href', canonical);

  // 7. Structured Data (JSON-LD)
  let scriptEl = document.getElementById('mrd-jsonld-schema') as HTMLScriptElement;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'mrd-jsonld-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const schemas: unknown[] = [];

  // Sitewide AutoDealer Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${appBaseUrl}/#autodealer`,
    name: settings.businessName,
    description: 'High-end luxury car dealership in Mount Pleasant, Harare, Zimbabwe offering transparent USD pricing, curated vehicles and registration assistance.',
    url: appBaseUrl,
    telephone: settings.phone,
    email: settings.email,
    priceRange: '$$$$',
    currenciesAccepted: 'USD, ZiG',
    paymentAccepted: 'Cash, Bank Wire Transfer',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Harare, Zimbabwe',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.locationAddress,
      addressLocality: settings.suburb,
      addressRegion: settings.city,
      addressCountry: 'ZW',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -17.781373,
      longitude: 31.037922,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '13:00',
      },
    ],
    sameAs: [
      settings.socialLinks.facebook,
      settings.socialLinks.instagram,
      settings.socialLinks.autotrader,
    ].filter(Boolean),
  });

  // Breadcrumbs schema if available
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${appBaseUrl}${crumb.url}`,
      })),
    });
  }

  // Custom page schema (Car, Article, FAQPage, etc.)
  if (config.schema) {
    if (Array.isArray(config.schema)) {
      schemas.push(...config.schema);
    } else {
      schemas.push(config.schema);
    }
  }

  scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}

/**
 * Generate Vehicle / Car Schema with Offer
 * Never includes private VIN or cost markup
 */
export function buildCarSchema(car: Car, settings: DealershipSettings, appBaseUrl: string): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.year} ${car.make} ${car.model} ${car.trim}`,
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    vehicleModelDate: car.year.toString(),
    bodyType: car.bodyType,
    color: car.exteriorColor,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    vehicleTransmission: car.transmission,
    fuelType: car.fuel,
    itemCondition: car.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    image: car.images.map((img) => (img.startsWith('http') ? img : `${appBaseUrl}${img}`)),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: car.status === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: settings.businessName,
        url: appBaseUrl,
      },
    },
  };

  if (!car.priceOnRequest && car.askingPriceUSD > 0) {
    (schema.offers as Record<string, unknown>).price = car.askingPriceUSD;
  }

  return schema;
}

/**
 * Generate FAQPage Schema
 */
export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article Schema for Guides
 */
export function buildArticleSchema(article: GuideArticle, settings: DealershipSettings, appBaseUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage.startsWith('http') ? article.coverImage : `${appBaseUrl}${article.coverImage}`,
    datePublished: article.createdAt,
    author: {
      '@type': 'Organization',
      name: settings.businessName,
      url: appBaseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.businessName,
      logo: {
        '@type': 'ImageObject',
        url: `${appBaseUrl}/assets/images/hero_luxury_showroom_1791464684452.jpg`,
      },
    },
  };
}

/**
 * Generate Sitemap XML String
 */
interface SitemapEntry {
  loc: string;
  priority: string;
  changefreq: string;
  image?: string;
}

export function generateSitemapXML(cars: Car[], categories: Category[], articles: GuideArticle[], baseUrl: string): string {
  const now = new Date().toISOString().split('T')[0];

  const staticUrls: SitemapEntry[] = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/inventory`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/sell-your-car`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/request-a-car`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/guides`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
  ];

  const categoryUrls: SitemapEntry[] = categories.map((cat) => ({
    loc: `${baseUrl}/inventory/${cat.slug}`,
    priority: '0.8',
    changefreq: 'daily',
  }));

  const uniqueMakes = Array.from(new Set(cars.map((c) => c.make.toLowerCase())));
  const brandUrls: SitemapEntry[] = uniqueMakes.map((make) => ({
    loc: `${baseUrl}/brands/${make}`,
    priority: '0.8',
    changefreq: 'daily',
  }));

  // Cars that are not draft or archived
  const carUrls: SitemapEntry[] = cars
    .filter((c) => c.status !== 'Draft')
    .map((car) => ({
      loc: `${baseUrl}/cars/${car.slug}`,
      priority: car.status === 'Available' ? '0.9' : '0.5',
      changefreq: 'daily',
      image: car.images[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${baseUrl}${car.images[0]}`) : undefined,
    }));

  const articleUrls: SitemapEntry[] = articles
    .filter((a) => a.published)
    .map((article) => ({
      loc: `${baseUrl}/guides/${article.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
    }));

  const allUrls: SitemapEntry[] = [...staticUrls, ...categoryUrls, ...brandUrls, ...carUrls, ...articleUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.image
        ? `\n    <image:image>\n      <image:loc>${u.image}</image:loc>\n    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;
}

/**
 * Generate Robots.txt String
 */
export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /saved
Disallow: /*?*filter=
Disallow: /*?*sort=

Sitemap: ${baseUrl}/sitemap.xml
`;
}
