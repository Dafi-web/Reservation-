import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import SiteQRCode from '@/components/SiteQRCode';
import { Link } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function QrPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const headerList = headers();
  const publicBase =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (() => {
      const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
      const proto = headerList.get('x-forwarded-proto') ?? 'https';
      return host ? `${proto}://${host}` : '';
    })();
  const qrEncodedUrl = publicBase ? `${publicBase}/${locale}` : '';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-start pt-12 pb-20 px-4 bg-gradient-to-b from-stone-100 to-stone-200">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        <Link
          href="/"
          className="self-start mb-6 text-sm font-semibold text-amber-800 hover:text-amber-950 transition-colors [dir=rtl]:self-end"
        >
          ← {t('menu.backToMenu')}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-2">
          {t('menu.qrPageTitle')}
        </h1>
        <p className="text-stone-600 text-center mb-10 max-w-sm">{t('menu.qrPageSubtitle')}</p>
        <SiteQRCode
          encodedUrl={qrEncodedUrl}
          siteUrl={process.env.NEXT_PUBLIC_SITE_URL}
          title={t('menu.qrTitle')}
          subtitle={t('menu.qrSubtitle')}
          size={200}
          showUrl
          showDownload
        />
      </div>
    </div>
  );
}
