'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
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
}: SiteQRCodeProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const value = useMemo(() => {
    if (encodedUrl?.trim()) return encodedUrl.trim();
    return getMenuPageUrl(siteUrl, locale);
  }, [encodedUrl, siteUrl, locale]);

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
      {showUrl && (
        <p className="mt-3 text-[11px] text-amber-200/80 break-all max-w-[240px] font-mono leading-tight">
          {value}
        </p>
      )}
    </div>
  );
}
