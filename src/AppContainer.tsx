import { ReactNode } from 'react';
import { ThemeBtn } from './components/layout/ThemeBtn';
import { ThemeProvider } from './components/theme/ThemeProvider';

type AppContainerProp = {
  children: ReactNode;
};
export default function AppContainer({ children }: AppContainerProp) {
  return (
    <>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <ThemeBtn />
        {children}
      </ThemeProvider>
      {/* <Footer /> */}
    </>
  );
}
