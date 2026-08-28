import './app.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppContent from './route/Routes.jsx';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;