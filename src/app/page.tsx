import CardWrapper from "@/app/components/molecules/card"
import RevenueChart from '@/app/components/molecules/revenue-chart';
import LatestInvoices from '@/app/components/molecules/latest-invoices';
import { lusitana } from '@/app/components/atoms/fonts';
import { fetchCardData } from '@/models/query';

export default async function Page() {
    const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <div className="col-span-4 md:col-span-4 lg:col-span-4">
                    <RevenueChart />
                </div>
                <div className="col-span-4 md:col-span-4 lg:col-span-4">
                    <LatestInvoices />
                </div>
            </div>
        </main>
    );
}