import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import Footer from './layout/Footer';
import Header from './layout/Header';
import { ThemeProvider } from './theme/ThemeProvider';

type AppContainerProp = {
  children: ReactNode;
};
export default function AppContainer({ children }: AppContainerProp) {
  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Header />
        {children}
        <Footer />
        <ToastContainer autoClose={2000} theme='dark' />
      </ThemeProvider>
    </>
  );
}
