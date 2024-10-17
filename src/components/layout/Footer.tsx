import { ChartNoAxesCombined, Cog, Goal, House } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerOption = [
  {
    name: 'Home',
    icon: <House />,
    href: '/',
  },
  {
    name: 'Projects',
    icon: <Goal />,
    href: '/projects',
  },
  {
    name: 'Analytics',
    icon: <ChartNoAxesCombined />,
    href: '/analytics',
  },
  {
    name: 'Settings',
    icon: <Cog />,
    href: '/settings',
  },
];

export default function Footer() {
  const pathName = usePathname();
  return (
    <footer className=''>
      <ol className='fixed z-10 backdrop-blur-md bottom-0 w-full border-t-[1px] border-slate-600 flex justify-evenly py-3 gap-3'>
        {footerOption.map(({ name, href, icon }) => {
          const isActive = pathName === href;
          return (
            <Link
              key={href + name}
              href={href}
              className={`${isActive && 'text-primary'}`}
            >
              <li className='grid gap-y-1 place-items-center'>
                <span>{icon}</span>
                <span className='text-xs font-semibold'>{name}</span>
              </li>
            </Link>
          );
        })}
      </ol>
    </footer>
  );
}
