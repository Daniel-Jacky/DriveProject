
import './App.css';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Tasks from './components/Tasks/Tasks';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );

  // <div className="App">
  //     <header className="App-header">
  //       <h1>Эй Года, сосать хуи готова?(Да)</h1>
  //     </header>
  //     <Footer></Footer>
  //   </div>
}

export default App;
