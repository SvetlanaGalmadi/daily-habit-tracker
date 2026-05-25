import React, { useEffect, useState } from 'react';
import Habit from './Habit';
import AddHabit from './AddHabit';
import './App.css';

function HabitList() {
  const [filter, setFilter] = useState("all");

  const updateTodayStatus = (habitsList) => {
    const today = new Date().toLocaleDateString();
    return habitsList.map(habit => {

      const completedToday = habit.completedDays?.some(day => day.date === today);
      return {
        ...habit,
        completed: completedToday || false,
        completedDays: habit.completedDays || []
      };
    });
  };
  
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits);
      return updateTodayStatus(parsed);
    }
    return [
      { id: 1, name: "Drink water", completed: false, lastUpdated: null, history: [], goal: 30, completedDays: [] },
      { id: 2, name: "Exercise", completed: false, lastUpdated: null, history: [], goal: 30, completedDays: [] },
      { id: 3, name: "Read a book", completed: false, lastUpdated: null, history: [], goal: 30, completedDays: [] }
    ];
  });
  
  useEffect(() => {
    const updateStatus = () => {
      setHabits(prev => updateTodayStatus(prev));
    };
    updateStatus();
    
    const interval = setInterval(updateStatus, 3600000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name, goal) => {
    const newHabit = {
      id: Date.now(),
      name,
      completed: false,
      lastUpdated: null,
      history: [],
      goal: goal,
      completedDays: []
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  };

  const updateHabit = (id, newName) => {
    setHabits(habits.map(habit => habit.id === id
      ? { ...habit, name: newName }
      : habit
    ));
  };
  
  const updateHabitStatus = (id, completed) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed }
        : habit
    ));
  };
  
  const filteredHabits = habits.filter(habit => {
    if (filter === "completed") return habit.completed === true;
    if (filter === "notCompleted") return habit.completed === false;
    return true;
  });

  return (
    <div className='layout'>
      <div className='filter-button'>
        <h2>Filter:</h2>
        <button 
          className={`filter-button-all ${filter === "all" ? "active" : ""}`} 
          onClick={() => setFilter("all")}
        > 
          All
        </button>
        <button 
          className={`filter-button-comp ${filter === "completed" ? "active" : ""}`} 
          onClick={() => setFilter("completed")}
        > 
          Completed Today 
        </button>
        <button 
          className={`filter-button-notcomp ${filter === "notCompleted" ? "active" : ""}`} 
          onClick={() => setFilter("notCompleted")}
        > 
          Not Completed Today
        </button>
      </div>
      
      <div className='habit-list'>
        <div className="side-left">
          <AddHabit onAddHabit={addHabit} />
        </div>
        
        {filteredHabits.length > 0 ? (
          filteredHabits.map(habit => (
            <Habit 
              key={habit.id} 
              id={habit.id}
              name={habit.name} 
              completed={habit.completed} 
              lastUpdated={habit.lastUpdated}
              onDelete={deleteHabit}
              onUpdate={updateHabit}
              onStatusUpdate={updateHabitStatus}
            />
          ))
        ) : (
          <div className="no-habits-message">
            {filter === "completed" && <p>No habits completed today. Keep going! 💪</p>}
            {filter === "notCompleted" && <p>Great! All habits are completed today! 🎉</p>}
            {filter === "all" && <p>No habits yet. Add your first habit! ✨</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitList;