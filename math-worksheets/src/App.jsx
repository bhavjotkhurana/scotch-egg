import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import BookPage from './pages/Book.jsx';
import AboutPage from './pages/About.jsx';
import UnitList from './pages/UnitList.jsx';
import UnitTopics from './pages/UnitTopics.jsx';
import TopicPractice from './pages/TopicPractice.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<UnitList />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="subjects" element={<Navigate to="/book" replace />} />
        <Route path="results" element={<Navigate to="/book" replace />} />
        <Route path="practice">
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":unitSlug" element={<UnitTopics />} />
          <Route path=":unitSlug/:topicSlug" element={<TopicPractice />} />
        </Route>
        <Route path="*" element={<UnitList />} />
      </Route>
    </Routes>
  );
}

export default App;
