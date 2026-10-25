'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AccessibilityPanel,
  BackToTop,
  Footer,
  Header,
  ScrollProgress,
  TopBar,
  type ChromeNav,
} from '@/components/portal/chrome';
import {
  HeroSlider,
  QuickServices,
  StatsSection,
} from '@/components/portal/home';
import {
  FaqSection,
  HelpCTA,
  MultimediaPreview,
  NewsPreview,
  OrgSection,
  ProvincesMarquee,
  type NewsCardItem,
} from '@/components/portal/home2';
import { NewsDetailView, NewsListView } from '@/views/news-views';
import { ServicesView } from '@/views/services-view';
import { HelpView } from '@/views/help-view';
import {
  AboutView,
  ContactView,
  FaqView,
  MultimediaView,
  ProvincesView,
} from '@/views/misc-views';
import { TransparencyView } from '@/views/transparency-view';
import { AdminView } from '@/views/admin-view';
import { ChatWidget } from '@/components/portal/chat-widget';
import { LangProvider } from '@/lib/i18n';
import type { ViewName } from '@/lib/portal-data';

interface ViewParams {
  id?: string;
  province?: string;
  category?: string;
  search?: string;
  tab?: string;
  service?: string;
  cat?: string;
}

const VIEW_TITLES: Record<ViewName, string> = {
  home: 'کمیته امداد امام خمینی (ره)',
  news: 'پایگاه اطلاع‌رسانی',
  services: 'میز خدمت',
  about: 'معرفی کمیته امداد',
  provinces: 'استان‌ها',
  multimedia: 'چندرسانه‌ای',
  help: 'می‌خواهم کمک کنم',
  transparency: 'سامانه شفافیت',
  faq: 'سوالات متداول',
  contact: 'ارتباط با ما',
  admin: 'مدیریت اخبار',
};

export default function PortalPage() {
  const [view, setView] = useState<ViewName>('home');
  const [params, setParams] = useState<ViewParams>({});
  const [homeNews, setHomeNews] = useState<NewsCardItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const prevView = useRef<ViewName>('home');

  /* Load home news preview */
  useEffect(() => {
    fetch('/api/news?limit=6')
      .then((r) => r.json())
      .then((d) => setHomeNews(d.items || []))
      .catch(() => setHomeNews([]))
      .finally(() => setNewsLoading(false));
  }, []);

  const go = useCallback((next: ViewName, p?: Record<string, string>) => {
    prevView.current = view;
    setParams(p || {});
    setView(next);
    if (next !== 'home') {
      document.title = `${VIEW_TITLES[next]} | کمیته امداد`;
    } else {
      document.title = VIEW_TITLES.home;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view]);

  const search = useCallback(
    (q: string) => {
      if (q.trim()) go('news', { search: q.trim() });
    },
    [go]
  );

  const nav: ChromeNav = { go, search };

  const isHome = view === 'home';

  return (
    <LangProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollProgress />
        <TopBar nav={nav} />
        <Header nav={nav} />
        <AccessibilityPanel nav={nav} />
        <ChatWidget />
        <BackToTop />

      <AnimatePresence mode="wait">
        <motion.main
          key={view + JSON.stringify(params)}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          {isHome ? (
            <>
              <HeroSlider nav={nav} />
              <QuickServices nav={nav} />
              <StatsSection />
              <HelpCTA nav={nav} />
              <NewsPreview items={homeNews} nav={nav} loading={newsLoading} />
              <MultimediaPreview nav={nav} />
              <ProvincesMarquee nav={nav} />
              <OrgSection />
              <FaqSection nav={nav} />
            </>
          ) : view === 'news' ? (
            params.id ? (
              <NewsDetailView nav={nav} id={params.id} />
            ) : (
              <NewsListView nav={nav} initialCategory={params.category} initialSearch={params.search} />
            )
          ) : view === 'services' ? (
            <ServicesView
              initialService={params.service}
              onOpenService={(id) => setParams((p) => ({ ...p, service: id }))}
            />
          ) : view === 'help' ? (
            <HelpView initialTab={params.tab} />
          ) : view === 'about' ? (
            <AboutView nav={nav} initialTab={params.tab} />
          ) : view === 'provinces' ? (
            <ProvincesView nav={nav} initialProvince={params.province} />
          ) : view === 'multimedia' ? (
            <MultimediaView initialCat={params.cat} />
          ) : view === 'faq' ? (
            <FaqView />
          ) : view === 'contact' ? (
            <ContactView />
          ) : view === 'transparency' ? (
            <TransparencyView />
          ) : view === 'admin' ? (
            <AdminView nav={nav} />
          ) : null}
        </motion.main>
      </AnimatePresence>

      <Footer nav={nav} />
      </div>
    </LangProvider>
  );
}
