import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
// import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue = await fetchRevenue(); // Fetch data inside the component
  const chartHeight = 350;
  // NOTE: Uncomment this code in Chapter 7

  const { yAxisLabels, topLabel } = generateYAxis(revenue);
  console.log(yAxisLabels, revenue);
  
  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      {/* NOTE: Uncomment this code in Chapter 7 */}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="grid grid-cols-[minmax(4rem,auto)_1fr] items-end gap-2 rounded-md bg-white p-4">
          {/* Y轴标签 */}
          <div
            className="flex flex-col justify-between text-sm text-gray-600"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label} className="text-right pr-2 -translate-y-1/2">
                {label}
              </p>
            ))}
          </div>

          {/* 柱状图部分 */}
          <div className="grid grid-cols-12 items-end gap-2 sm:gap-4">
            {revenue.map((month) => (
              <div key={month.month} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-md bg-blue-300"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                ></div>
                <p className="-rotate-90 text-sm text-gray-600 sm:rotate-0">
                  {month.month}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
