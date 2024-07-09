
import './App.css';
import Footer from './components/Footer/Footer';
import Game from './components/Home/Game';
import Home from './components/Home/Home';
import Tasks from './components/Tasks/Tasks';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='Main'>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );

  // Подключите в терминале "npm install react-router-dom" и "npm install react-icons"
  //Хуй
 
}

export default App;
