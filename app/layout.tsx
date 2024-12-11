import '@/app/ui/global.css'; 
import { Inter } from 'next/font/google';
import 'prismjs/themes/prism-tomorrow.css';

// 初始化 Inter 字体
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}