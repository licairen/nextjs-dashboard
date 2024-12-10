import Breadcrumb from '@/app/ui/dashboard/labs/breadcrumb';

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      {children}
    </div>
  );
} 