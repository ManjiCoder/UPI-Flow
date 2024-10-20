import { Route, Routes } from 'react-router-dom';
import AppContainer from './components/AppContainer';
import Home from './pages/Home';
import Records from './pages/Records';
import Test from './pages/Test';

export default function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/records' Component={Records} />
        <Route path='/settings' Component={Test} />
      </Routes>
    </AppContainer>
  );
}
