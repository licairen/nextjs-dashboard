import { fetchCardData } from '@/app/lib/data'
import { Cards } from '@/app/ui/dashboard/cards'

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData()

  return (
    <Cards
      numberOfInvoices={numberOfInvoices}
      numberOfCustomers={numberOfCustomers}
      totalPaidInvoices={totalPaidInvoices}
      totalPendingInvoices={totalPendingInvoices}
    />
  )
}
