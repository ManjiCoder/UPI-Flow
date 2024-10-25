import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import Footer from './layout/Footer';
import { ThemeBtn } from './layout/ThemeBtn';
import { ThemeProvider } from './theme/ThemeProvider';

type AppContainerProp = {
  children: ReactNode;
};
export default function AppContainer({ children }: AppContainerProp) {
  return (
    <>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <ThemeBtn />
        {children}
        <Footer />
        <ToastContainer autoClose={2000} theme='dark' />
      </ThemeProvider>
    </>
  );
}
