import Breadcrumb from '@/app/ui/dashboard/labs/breadcrumb';

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb />
      <div className="content-container flex-1">
        {children}
      </div>
    </div>
  );
} 