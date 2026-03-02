import React, { useState } from 'react';
import './App.css';

function AddHabit({ onAddHabit }) {
  const [habitName, setHabitName] = useState('');
  const [goal, setGoal] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim() === '') return;
    onAddHabit(habitName , goal);
    setHabitName('');
    setGoal (30);
  };

  return (
    <div className='add-new-habit'>
    <form onSubmit={handleSubmit} className='add-habit-form'    >
 
      <input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="Enter new habit..."/>

      <input 
        type = "number"
        placeholder = "Goal (days)"
        value = {goal}
        onChange= {(e) => setGoal(Number(e.target.value))} />
 
      <button type="submit"> Add Habit </button>
    </form>
    </div>
      );
}

export default AddHabit;
