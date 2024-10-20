import DynamicHead from '@/components/DynamicHead';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Rubik } from 'next/font/google';

const inter = Rubik({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <DynamicHead />
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <Component {...pageProps} />
        <ModeToggle />
      </ThemeProvider>
    </div>
  );
}
