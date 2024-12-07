import { Suspense } from 'react';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Set revalidate to 0 to opt out of static generation
export const revalidate = 0;

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<div>Loading...</div>}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
