'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

type Props = {
  currentLocale: string;
};

export default function LanguageSwitcher({ currentLocale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div className="relative flex items-center">
      <Globe className={`absolute left-2 h-4 w-4 ${isPending ? 'text-gray-300' : 'text-white'} pointer-events-none`} />
      <select
        className={`bg-forest border border-campfire ${isPending ? 'text-gray-300' : 'text-white'} py-1 pl-8 pr-6 rounded font-montserrat text-sm appearance-none cursor-pointer ${isPending ? 'opacity-70' : ''}`}
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        disabled={isPending}
      >
        <option value="vi">Vi</option>
        <option value="en">En</option>
      </select>
      <div className="absolute right-2 pointer-events-none">
        <svg
          className={`fill-current h-4 w-4 ${isPending ? 'text-gray-300' : 'text-white'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      {isPending && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
      )}
    </div>
  );
}
