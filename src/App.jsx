import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Methods from './pages/Methods';
import CustomSimulator from './pages/CustomSimulator';
import Visualizer from './pages/Visualizer';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/category/:categoryId" element={<Questions />} />
            <Route path="/category/:categoryId/:questionId/methods" element={<Methods />} />
            <Route path="/category/:categoryId/:questionId/custom" element={<CustomSimulator />} />
            <Route path="/category/:categoryId/:questionId/visualize/:method" element={<Visualizer />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
