import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';

function Habit({ id, name, completed, lastUpdated, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    if (newName.trim() === '') return;
    onUpdate(id, newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(name);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить привычку "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className={`form-habit ${completed ? "habit-completed" : "habit-not-completed"}`}>      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <span style={{ fontSize: '24px', fontWeight: '600', color: '#362a20' }}>
            {name}
          </span>
        )}

        {lastUpdated && !isEditing && (
          <small style={{ color: '#555', marginTop: '5px' }}>
            Last Update: {lastUpdated}
          </small>
        )}
      </div>
       <Link to={`/habit/${id}`}>
          <button className="edit-button" title="View details">
            📊
          </button>
        </Link>
        
      <div>
        <button className="edit-button" onClick={() => setIsEditing(true)} title="Edit habit">
          ✏️
        </button>

        <button className="delete-button" onClick={handleDelete} title="Delete habit">
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Habit;