import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import HabitList from './HabitList';
import HabitDetail from './HabitDetail';
import './App.css';


function App() {
  return (
    <Router> 
      <div className="main-container"> 
        <h1>Daily Habit Tracker</h1>
        <h2>My Habits</h2>
        
        <Routes>
          <Route path='/' element={<HabitList/>} />
          <Route path='/habit/:id' element={<HabitDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
