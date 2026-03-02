import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import './App.css';

function HabitDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const habit = habits.find(h => h.id === Number(id));

    if (!habit) {
        return (
            <div className="habit-detail not-found">
                <h2>Habit not found</h2>
                <button onClick={() => navigate('/')}>Back to Habits</button>
            </div>
        );
    }

    const progress = habit.history && habit.goal ? (habit.history.length / habit.goal) * 100 : 0;

    return (
        <div className="habit-detail">
            <h2>{habit.name}</h2>
            
            <div className="habit-status">
                <span className={`status-badge ${habit.completed ? "completed" : "not-completed"}`}>
                    {habit.completed ? "✓ Completed" : "✗ Not Completed"}
                </span>
            </div>

            <p className="last-update">
                <strong>Last Update:</strong> {habit.lastUpdated || "Never"}
            </p>

            <div className="history-section">
                <h3>History</h3>
                <ul className="history-list">
                    {habit.history && habit.history.length > 0 ? (
                        habit.history.map((date, index) => (
                            <li key={index}>{date}</li>
                        ))
                    ) : (
                        <li className="no-history">No history yet</li>
                    )}
                </ul>
            </div>

            <div className="progress-section">
                <h3>Progress</h3>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="progress-text">
                    Progress: {habit.history ? habit.history.length : 0} / {habit.goal || 30} days completed
                </p>
            </div>

            <button className="back-button" onClick={() => navigate('/')}>
                ← Back to Habits
            </button>
        </div>
    );
}

export default HabitDetail;