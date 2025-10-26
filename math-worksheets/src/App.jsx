import { Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './pages/Home.jsx';
import UploadPage from './pages/Upload.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
    </Routes>
  );
}

export default App;
