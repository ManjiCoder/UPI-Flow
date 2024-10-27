import { appInfo } from '@/types/constant';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { footerOption } from './Footer';
import { ThemeBtn } from './ThemeBtn';

export default function Header() {
  const { pathname: pathName } = useLocation();
  return (
    <nav className='flex justify-between px-5 sm:px-20 py-4'>
      <section className='flex space-x-10 items-start'>
        <Link to='/'>
          <h3 className='border-none pb-0'>{appInfo.title}</h3>
        </Link>
        <ol className='hidden sm:flex py-3 gap-3'>
          {footerOption.map(({ name, href }) => {
            const isActive = pathName === href;
            return (
              <NavLink
                key={href + name}
                to={href}
                className={`${isActive && 'text-primary'}`}
              >
                <li className='flex gap-2 place-items-center'>
                  <span className='text-xs font-semibold'>{name}</span>
                </li>
              </NavLink>
            );
          })}
        </ol>
      </section>
      <section>
        {/* Search Bar */}
        <ThemeBtn />
      </section>
    </nav>
  );
}
