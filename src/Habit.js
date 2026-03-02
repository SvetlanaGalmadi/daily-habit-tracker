import React, { useState } from 'react';
import {Link} from "react-router-dom";
import './App.css';

function Habit({ id, name, completed, lastUpdated, onDelete, onToggle, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const[newName, setNewName] = useState(name);

  return (
    <div className={`form-habit ${completed ? "habit-completed" : "habit-not-completed"}`}>      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {isEditing ? (
          <div>
            <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
            />
            <button onClick={() => { onUpdate(id, newName); setIsEditing(false); }}>
              Save
            </button>
          </div>
        ) : (
         <Link to={`/habit/${id}`} style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}>
            {name}
        </Link>
        )}

        {lastUpdated && (
          <small style={{ color: '#555' }}>
            Last Update: {lastUpdated}
          </small>
        )}
      </div>
      
      <div>
      <span
        className={`status-icon ${completed ? "completed" : "not-completed"}`}
        onClick={() => onToggle(id)}
      >
        {completed ? "✔" : "✖"}
      </span>

        <button className ="edit-button" onClick={() => setIsEditing(true)} >
        ✏️
        </button>

    <button className='delete-button' onClick={() => onDelete(id)}>
      🗑️
    </button>
    </div>
  </div>
  );
}

export default Habit;
