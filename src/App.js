import './App.css';
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import LandingPage from './pages/Page_Landing';
import SettingPage from './pages/Page_Setting';

function App() {
  return (
    <div className="App" style={{margin: 0, padding: 0}}>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
          <Route exact path="/setting" element={<SettingPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
