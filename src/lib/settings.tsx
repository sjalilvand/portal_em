'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MotionConfig } from 'framer-motion';

/* ---------------- Types ---------------- */

export type ThemeName = 'emerald' | 'azure' | 'royal' | 'sunset' | 'gold';
export type FontName = 'vazirmatn' | 'sahel' | 'samim' | 'shabnam';
export type FontScale = 0.9 | 1 | 1.15 | 1.3 | 1.45;

export interface A11yFlags {
  grayscale: boolean;
  underlineLinks: boolean;
  bigCursor: boolean;
  spacing: boolean;
  highContrast: boolean;
  motion: boolean; // true = animations on
}

export interface PortalSettings {
  theme: ThemeName;
  mode: 'light' | 'dark';
  font: FontName;
  fontScale: FontScale;
  a11y: A11yFlags;
}

const STORAGE_KEY = 'emdad-portal-settings';

const DEFAULT_SETTINGS: PortalSettings = {
  theme: 'emerald',
  mode: 'light',
  font: 'vazirmatn',
  fontScale: 1,
  a11y: {
    grayscale: false,
    underlineLinks: false,
    bigCursor: false,
    spacing: false,
    highContrast: false,
    motion: true,
  },
};

/* ---------------- Context ---------------- */

interface SettingsContextValue extends PortalSettings {
  setTheme: (t: ThemeName) => void;
  setMode: (m: 'light' | 'dark') => void;
  toggleMode: () => void;
  setFont: (f: FontName) => void;
  setFontScale: (s: FontScale) => void;
  setA11y: (key: keyof A11yFlags, value: boolean) => void;
  resetAll: () => void;
  hydrated: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

/* ---------------- Provider ---------------- */

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PortalSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage (deferred to avoid sync setState in effect)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSettings((s) => ({
            ...s,
            ...parsed,
            a11y: { ...s.a11y, ...(parsed.a11y || {}) },
          }));
        }
      } catch {
        /* ignore */
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Apply to <html> + persist
  useEffect(() => {
    if (!hydrated) return;
    const el = document.documentElement;
    el.dataset.theme = settings.theme;
    el.dataset.font = settings.font;
    el.style.setProperty('--font-scale', String(settings.fontScale));
    el.classList.toggle('dark', settings.mode === 'dark');
    if (settings.a11y.highContrast) el.dataset.contrast = 'high';
    else delete el.dataset.contrast;
    el.toggleAttribute('data-a11y-grayscale', settings.a11y.grayscale);
    el.toggleAttribute('data-a11y-links', settings.a11y.underlineLinks);
    el.toggleAttribute('data-a11y-cursor', settings.a11y.bigCursor);
    el.toggleAttribute('data-a11y-spacing', settings.a11y.spacing);
    if (settings.a11y.motion) delete el.dataset.a11yMotion;
    else el.dataset.a11yMotion = 'off';
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings, hydrated]);

  const setTheme = useCallback(
    (theme: ThemeName) => setSettings((s) => ({ ...s, theme })),
    []
  );
  const setMode = useCallback(
    (mode: 'light' | 'dark') => setSettings((s) => ({ ...s, mode })),
    []
  );
  const toggleMode = useCallback(
    () => setSettings((s) => ({ ...s, mode: s.mode === 'dark' ? 'light' : 'dark' })),
    []
  );
  const setFont = useCallback(
    (font: FontName) => setSettings((s) => ({ ...s, font })),
    []
  );
  const setFontScale = useCallback(
    (fontScale: FontScale) => setSettings((s) => ({ ...s, fontScale })),
    []
  );
  const setA11y = useCallback(
    (key: keyof A11yFlags, value: boolean) =>
      setSettings((s) => ({ ...s, a11y: { ...s.a11y, [key]: value } })),
    []
  );
  const resetAll = useCallback(
    () =>
      setSettings((s) => ({
        ...s,
        theme: 'emerald',
        mode: 'light',
        font: 'vazirmatn',
        fontScale: 1,
        a11y: { ...DEFAULT_SETTINGS.a11y },
      })),
    []
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setTheme,
      setMode,
      toggleMode,
      setFont,
      setFontScale,
      setA11y,
      resetAll,
      hydrated,
    }),
    [settings, setTheme, setMode, toggleMode, setFont, setFontScale, setA11y, resetAll, hydrated]
  );

  return (
    <SettingsContext.Provider value={value}>
      <MotionConfig reducedMotion={settings.a11y.motion ? 'never' : 'always'}>
        {children}
      </MotionConfig>
    </SettingsContext.Provider>
  );
}

/* ---------------- Persian date helper ---------------- */

export function toPersianDigits(input: string | number): string {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  return String(input).replace(/\d/g, (d) => fa[Number(d)]);
}

export function formatPersianDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
}

export function formatPersianNumber(n: number): string {
  return toPersianDigits(new Intl.NumberFormat('fa-IR').format(n));
}
