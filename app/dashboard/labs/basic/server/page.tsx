import { lusitana } from '@/app/ui/fonts';

export default function ServerDemo() {
  return (
    <div className="space-y-4">
      <h1 className={`${lusitana.className} text-2xl`}>服务器组件演示</h1>
      <div className="p-4 border rounded-lg">
        <p>这是一个服务器组件页面</p>
      </div>
    </div>
  );
}