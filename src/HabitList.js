import React, { useEffect, useState } from 'react';
import Habit from './Habit';
import AddHabitForm from './AddHabit';
import './App.css';

function HabitList() {
  const [habits, setHabits] = useState(() => {
  const savedHabits = localStorage.getItem('habits');
   return savedHabits ? JSON.parse(savedHabits) : [
  { id: 1, name: "Drink water", completed: false, lastUpdated: null, history: [], goal: 30 },
  { id: 2, name: "Exercise", completed: false, lastUpdated: null, history: [], goal: 30 },
  { id: 3, name: "Read a book", completed: false, lastUpdated: null, history: [], goal: 30 }
];


  });
  
  const [filter, setFilter]= useState("all");
  
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
      goal : goal
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id 
        ? { ...habit, 
            completed: !habit.completed, 
            lastUpdated: new Date().toLocaleString(),
            history: !habit.completed
            ? [...(habit.history || []), new Date().toLocaleDateString()]
            : habit.history
        }
        : habit
    ));
  };

  const updateHabit = (id, newName) => {
    setHabits( habits.map(habit => habit.id === id?
        {...habit, name:newName, lastUpdated: new Date().toLocaleString()} :habit
    ));
  };
  
  const filteredHabits= habits.filter(habit => {
    if (filter === "completed") return habit.completed === true;
    if (filter === "notCompleted") return habit.completed === false;
    return true;
  })

  return (
    <div className='layout'>

    
    <div className='filter-button'>
      <h2>Filter:</h2>
        <button className={`filter-button-all ${filter==="all"?"active":""}`} onClick={()=> setFilter("all")}> All</button>
        <button className={`filter-button-comp ${filter==="completed"?"active":""}`} onClick={()=> setFilter("completed")}> Completed </button>
        <button className={`filter-button-notcomp ${filter==="notCompleted"?"active":""}`} onClick={()=> setFilter("notCompleted")}> Not Completed</button>

    </div>
    <div className='habit-list'>
         <div className = "side-left">
         <AddHabitForm onAddHabit={addHabit} />
         </div>
    {filteredHabits.map(habit => (
        <Habit 
          key={habit.id} 
          id={habit.id}
          name={habit.name} 
          completed={habit.completed} 
          lastUpdated={habit.lastUpdated}
          onDelete={deleteHabit}
          onToggle={toggleHabit}
          onUpdate = {updateHabit}
        />
      ))}
    </div>
  </div>
  );
}

export default HabitList;
