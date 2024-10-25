import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppContainer from './components/AppContainer';
import Loader from './components/Loader';
// import Analytics from './pages/Analytics';
// import Home from './pages/Home';
// import Records from './pages/Records';
// import Test from './pages/Test';

const Home = lazy(() => import('./pages/Home'));
const Records = lazy(() => import('./pages/Records'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Test = lazy(() => import('./temp/Test'));

export default function App() {
  return (
    <AppContainer>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/records' Component={Records} />
          <Route path='/analytics' Component={Analytics} />
          <Route path='/settings' Component={Test} />
        </Routes>
      </Suspense>
    </AppContainer>
  );
}
