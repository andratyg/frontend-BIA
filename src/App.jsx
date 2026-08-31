import './app.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './route/Routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;