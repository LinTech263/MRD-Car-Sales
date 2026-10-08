import React, { useState } from 'react';
import { Copy, Check, FileCode, ArrowLeft } from 'lucide-react';
import { Car, Category, GuideArticle } from '../types';
import { generateSitemapXML, generateRobotsTxt } from '../services/seo';

interface SitemapViewPageProps {
  type: 'sitemap' | 'robots';
  cars: Car[];
  categories: Category[];
  posts: GuideArticle[];
  onNavigate: (path: string) => void;
}

export const SitemapViewPage: React.FC<SitemapViewPageProps> = ({
  type,
  cars,
  categories,
  posts,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;

  const content =
    type === 'sitemap'
      ? generateSitemapXML(cars, categories, posts, baseUrl)
      : generateRobotsTxt(baseUrl);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </button>
          <h1 className="font-heading text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-amber-700" />
            <span>{type === 'sitemap' ? 'sitemap.xml' : 'robots.txt'} Output</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic crawlable file generated live from inventory and content routes.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Output'}</span>
        </button>
      </div>

      <div className="bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-6 overflow-x-auto text-xs font-mono border border-slate-800 shadow-inner">
        <pre className="whitespace-pre">{content}</pre>
      </div>
    </div>
  );
};
