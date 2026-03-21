'use client';

import { useMemo, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

type SiteQRCodeProps = {
  /** Full URL encoded in the QR (preferred — set on the server so the QR works on first paint). */
  encodedUrl?: string;
  /** Optional override (e.g. from server env). If unset, uses NEXT_PUBLIC_SITE_URL + locale or current origin. */
  siteUrl?: string;
  className?: string;
  size?: number;
  /** Heading above the QR (e.g. from translations) */
  title?: string;
  /** Short hint under the heading */
  subtitle?: string;
  /** Show the encoded URL in small text (helpful for debugging / print) */
  showUrl?: boolean;
  /** Show “Download PNG” button (print / flyers) */
  showDownload?: boolean;
};

/**
 * Encodes the public menu URL for QR scanning.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://ristorante-africa.dafitech.org) so the QR always points to production.
 */
export function getMenuPageUrl(siteUrl: string | undefined, locale: string): string {
  const base = (siteUrl || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  if (base) {
    return `${base}/${locale}`;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/${locale}`;
  }
  return '';
}

export default function SiteQRCode({
  encodedUrl,
  siteUrl,
  className = '',
  size = 160,
  title,
  subtitle,
  showUrl = true,
  showDownload = true,
}: SiteQRCodeProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('menu');
  const [downloading, setDownloading] = useState(false);

  const value = useMemo(() => {
    if (encodedUrl?.trim()) return encodedUrl.trim();
    return getMenuPageUrl(siteUrl, locale);
  }, [encodedUrl, siteUrl, locale]);

  const handleDownloadPng = useCallback(async () => {
    if (!value) return;
    try {
      setDownloading(true);
      const QRCode = (await import('qrcode')).default;
      const dataUrl = await QRCode.toDataURL(value, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#1c1917', light: '#ffffff' },
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'ristorante-africa-menu-qr.png';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('QR download failed:', e);
    } finally {
      setDownloading(false);
    }
  }, [value]);

  if (!value) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {title && (
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-1">{title}</h3>
      )}
      {subtitle && <p className="text-xs text-amber-100/90 mb-3 max-w-[220px]">{subtitle}</p>}
      <div className="inline-flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-lg ring-2 ring-amber-500/30">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          includeMargin
          bgColor="#ffffff"
          fgColor="#1c1917"
        />
      </div>
      {showDownload && (
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={downloading}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-500/50 bg-amber-600/20 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-600/35 disabled:opacity-60"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? '…' : t('downloadQr')}
        </button>
      )}
      {showUrl && (
        <p className="mt-3 text-[11px] text-amber-200/80 break-all max-w-[240px] font-mono leading-tight">
          {value}
        </p>
      )}
    </div>
  );
}
