import { appInfo } from '@/types/constant';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { footerOption } from './Footer';
import { ThemeBtn } from './ThemeBtn';

export default function Header() {
  const { pathname: pathName } = useLocation();
  return (
    <nav className='flex justify-between px-6 sm:px-20 py-4'>
      <section className='flex space-x-20 items-center'>
        <Link to='/'>
          <h3 className='text-brand border-none pb-0'>{appInfo.title}</h3>
        </Link>
        <ol className='hidden sm:flex py-3 gap-3 space-x-5'>
          {footerOption.map(({ name, href }) => {
            const isActive = pathName === href;
            return (
              <NavLink
                key={href + name}
                to={href}
                className={`${isActive && 'text-primary'}`}
              >
                <li className='flex gap-2 place-items-center'>
                  <span className='text-base'>{name}</span>
                </li>
              </NavLink>
            );
          })}
        </ol>
      </section>
      <section className='flex items-center'>
        {/* Search Bar */}
        <ThemeBtn />
      </section>
    </nav>
  );
}
