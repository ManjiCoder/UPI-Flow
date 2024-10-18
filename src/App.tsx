import { Route, Routes } from 'react-router-dom';
import AppContainer from './AppContainer';
import Home from './pages/Home';
import Records from './pages/Records';

export default function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/records' Component={Records} />
        {/* <Route path='*' Component={Home} /> */}
      </Routes>
    </AppContainer>
  );
}
