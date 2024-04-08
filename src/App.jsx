import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

import { FleetPage, MapPage, EditorPage } from './pages';
import { NavBar } from './components';

function App() {
  return (
    <>
      <NavBar />
      <Box sx={{ pt: '70px' }}>
        <Routes>
          <Route path='/' element={<MapPage />} />
          <Route path='/fleet' element={<FleetPage />} />
          <Route path='/editor' element={<EditorPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
