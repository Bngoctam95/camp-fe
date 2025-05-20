import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css'
import { montserrat, openSans } from '@/app/fonts';
import { Toaster } from "sonner";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${montserrat.variable} ${openSans.variable}`}>
      <body className={`${montserrat.className} ${openSans.className}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}