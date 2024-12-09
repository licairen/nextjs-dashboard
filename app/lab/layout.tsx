import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CIMC Lab | 学习实验室',
  description: 'Next.js 学习和实验的地方',
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <LabNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
} 