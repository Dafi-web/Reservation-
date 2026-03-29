import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import FloatingAdminButton from '@/components/FloatingAdminButton';
import LocaleHomeFooter from '@/components/LocaleHomeFooter';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-gradient-to-b from-stone-100 via-slate-50 to-gray-50">
            <Navigation />
            <main>{children}</main>
            <LocaleHomeFooter
              qrEncodedUrl={qrEncodedUrl}
              siteUrl={process.env.NEXT_PUBLIC_SITE_URL}
            />
            <FloatingAdminButton />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
