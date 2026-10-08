import React, { useEffect } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import { GuideArticle, DealershipSettings } from '../types';
import { updatePageSEO, buildArticleSchema } from '../services/seo';

interface GuidesPageProps {
  articles: GuideArticle[];
  selectedSlug?: string;
  settings: DealershipSettings;
  onNavigate: (path: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({
  articles,
  selectedSlug,
  settings,
  onNavigate,
}) => {
  const currentArticle = selectedSlug ? articles.find((a) => a.slug === selectedSlug) : undefined;

  useEffect(() => {
    if (currentArticle) {
      updatePageSEO(
        {
          title: `${currentArticle.seoTitle} | MRD Car Sales`,
          description: currentArticle.seoDescription,
          ogType: 'article',
          ogImage: currentArticle.coverImage,
          canonicalUrl: `${window.location.origin}/guides/${currentArticle.slug}`,
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Car Buying Guides', url: '/guides' },
            { name: currentArticle.title, url: `/guides/${currentArticle.slug}` },
          ],
          schema: buildArticleSchema(currentArticle, settings, window.location.origin),
        },
        settings
      );
    } else {
      updatePageSEO(
        {
          title: 'Car Buying Guides & Harare Automotive Advice | MRD Car Sales',
          description:
            'Expert car buying guides for Harare, Zimbabwe. Read checklists on luxury imports, ZIMRA duty clearance, and SUV inspection tips.',
          canonicalUrl: `${window.location.origin}/guides`,
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Car Buying Guides', url: '/guides' },
          ],
        },
        settings
      );
    }
  }, [currentArticle, settings]);

  // DETAIL ARTICLE VIEW
  if (currentArticle) {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <button
          onClick={() => onNavigate('/guides')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        <header className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold uppercase tracking-wider">
            <span>Harare Car Buyer Guide</span>
            <span>·</span>
            <span>{currentArticle.readTimeMinutes} min read</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {currentArticle.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {currentArticle.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-gray-100">
            <span>By {currentArticle.author} · Published {new Date(currentArticle.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Feature Cover Image */}
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content (Markdown rendered cleanly) */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 pt-4">
          {currentArticle.contentMarkdown.split('\n\n').map((block, idx) => {
            if (block.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-heading text-lg sm:text-xl font-bold text-slate-900 pt-4">
                  {block.replace('### ', '')}
                </h3>
              );
            }
            if (block.startsWith('- ')) {
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  {block.split('\n').map((li, lidx) => (
                    <li key={lidx}>{li.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\./.test(block)) {
              return (
                <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
                  {block.split('\n').map((li, lidx) => (
                    <li key={lidx}>{li.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={idx} className="text-xs sm:text-sm leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>

        {/* CTA: Check Matching Inventory */}
        <div className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading text-base font-bold text-slate-900">
              Browse Inspected Vehicles at MRD Car Sales
            </h4>
            <p className="text-xs text-slate-600">
              Every car on our Mount Pleasant floor carries fully compliant ZIMRA documentation.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/inventory')}
            className="px-5 py-3 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shrink-0"
          >
            Browse Verified Cars
          </button>
        </div>
      </article>
    );
  }

  // LIST OF GUIDES VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
          Market Intelligence & Advice
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Harare Car Buyer Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Objective, practical insights into duty regulations, vehicle inspection, and local ownership transfer in Zimbabwe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles
          .filter((a) => a.published)
          .map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate(`/guides/${article.slug}`)}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-amber-800 font-semibold uppercase">
                    <span>{article.readTimeMinutes} min read</span>
                    <span>·</span>
                    <span>Harare Guide</span>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-amber-800">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
