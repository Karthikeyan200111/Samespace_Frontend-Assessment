import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Component/Home';
import Layout from './Component/Layout';
import TopTracks from './Component/TopTracks';
import { AccentColorProvider } from './context/AccentColorProvider ';

function App() {
  return (
    <AccentColorProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/toptracks' element={<TopTracks />} />
        </Route>
      </Routes>
    </AccentColorProvider>
  );
}

export default App;
