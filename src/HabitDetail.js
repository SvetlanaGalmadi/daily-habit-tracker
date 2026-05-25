import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './App.css';

function HabitDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [habit, setHabit] = useState(null);
    const [completedDays, setCompletedDays] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const loadHabitData = useCallback(() => {
        const habits = JSON.parse(localStorage.getItem("habits")) || [];
        const foundHabit = habits.find(h => h.id === Number(id));
        if (foundHabit) {
            setHabit(foundHabit);
            if (foundHabit.completedDays) {
                setCompletedDays(foundHabit.completedDays);
            } else {
                setCompletedDays([]);
            }
        }
    }, [id]); 

    useEffect(() => {
        loadHabitData();
    }, [loadHabitData]); 

    if (!habit) {
        return (
            <div className="habit-detail not-found">
                <h2>Habit not found</h2>
                <button onClick={() => navigate('/')}>Back to Habits</button>
            </div>
        );
    }

    const goal = habit.goal || 30;
    const completedCount = completedDays.length;
    const progress = (completedCount / goal) * 100;
    const isComplete = completedCount >= goal;
    
    const hasCompletedToday = () => {
        const today = new Date();
        const todayString = today.toLocaleDateString();
        return completedDays.some(day => day.date === todayString);
    };

    const toggleDay = (dayNumber) => {
        const today = new Date();
        const todayString = today.toLocaleDateString();
        
        const isDayCompleted = completedDays.some(day => day.dayNumber === dayNumber);
        
        if (!isDayCompleted) {
            const alreadyCompletedToday = hasCompletedToday();
            
            if (alreadyCompletedToday) {
                window.alert("❌ You can only complete ONE habit per day!\n\nYou have already completed a habit today. Come back tomorrow to complete another one.");
                return;
            }

            const newCompletedDays = [...completedDays, {
                dayNumber: dayNumber,
                date: todayString,
                timestamp: today.getTime()
            }];
            
            newCompletedDays.sort((a, b) => a.dayNumber - b.dayNumber);
            setCompletedDays(newCompletedDays);

            const habits = JSON.parse(localStorage.getItem("habits")) || [];
            const updatedHabits = habits.map(h => 
                h.id === habit.id 
                    ? { 
                        ...h, 
                        completedDays: newCompletedDays,
                        history: newCompletedDays.map(day => `${day.date} - Day ${day.dayNumber}`),
                        completed: newCompletedDays.some(day => day.date === todayString),
                        lastUpdated: new Date().toLocaleString()
                      }
                    : h
            );
            localStorage.setItem("habits", JSON.stringify(updatedHabits));
            
            setHabit({
                ...habit,
                completedDays: newCompletedDays,
                history: newCompletedDays.map(day => `${day.date} - Day ${day.dayNumber}`),
                completed: newCompletedDays.some(day => day.date === todayString),
                lastUpdated: new Date().toLocaleString()
            });
        } else {

            const completedDayInfo = completedDays.find(day => day.dayNumber === dayNumber);
            const confirmUnmark = window.confirm(`⚠️ Are you sure you want to UNMARK Day ${dayNumber}?\n\nThis will remove the completion record from ${completedDayInfo?.date}`);
            
            if (confirmUnmark) {
                const newCompletedDays = completedDays.filter(day => day.dayNumber !== dayNumber);
                newCompletedDays.sort((a, b) => a.dayNumber - b.dayNumber);
                setCompletedDays(newCompletedDays);
                
                const habits = JSON.parse(localStorage.getItem("habits")) || [];
                const updatedHabits = habits.map(h => 
                    h.id === habit.id 
                        ? { 
                            ...h, 
                            completedDays: newCompletedDays,
                            history: newCompletedDays.map(day => `${day.date} - Day ${day.dayNumber}`),
                            completed: newCompletedDays.some(day => day.date === new Date().toLocaleDateString()),
                            lastUpdated: new Date().toLocaleString()
                          }
                        : h
                );
                localStorage.setItem("habits", JSON.stringify(updatedHabits));
                
                setHabit({
                    ...habit,
                    completedDays: newCompletedDays,
                    history: newCompletedDays.map(day => `${day.date} - Day ${day.dayNumber}`),
                    completed: newCompletedDays.some(day => day.date === new Date().toLocaleDateString()),
                    lastUpdated: new Date().toLocaleString()
                });
            }
        }
    };

    const goalDaysArray = Array.from({ length: goal }, (_, i) => i + 1);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const isDateCompleted = (day) => {
        const dateString = new Date(year, month, day).toLocaleDateString();
        return completedDays.some(completed => completed.date === dateString);
    };

    const getDayCompletionInfo = (day) => {
        const dateString = new Date(year, month, day).toLocaleDateString();
        const completion = completedDays.find(completed => completed.date === dateString);
        return completion;
    };
    
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const isCompleted = isDateCompleted(i);
        const completionInfo = getDayCompletionInfo(i);
        calendarDays.push({ 
            day: i, 
            completed: isCompleted, 
            dayNumber: completionInfo?.dayNumber 
        });
    }

    return (
        <div className={`habit-detail ${isComplete ? 'habit-complete-all' : ''}`}>
            <h2>{habit.name}</h2>
            
            <div className="days-grid-section">
                <h3>Goal Progress (Complete {goal} times)</h3>
                <div className="days-grid">
                    {goalDaysArray.map(dayNum => {
                        const completedInfo = completedDays.find(day => day.dayNumber === dayNum);
                        const isCompleted = !!completedInfo;
                        return (
                            <div
                                key={dayNum}
                                className={`day-square ${isCompleted ? 'completed-day' : 'incomplete-day'}`}
                                onClick={() => toggleDay(dayNum)}
                                title={isCompleted ? `Completed on ${completedInfo.date}` : `Day ${dayNum} - Not completed yet`}
                            >
                                {dayNum}
                                {isCompleted && <span className="check-mark">✓</span>}
                            </div>
                        );
                    })}
                </div>
                <p className="days-hint">
                    📅 Click on squares to mark completion. ⚠️ Only ONE square per day!
                </p>
            </div>

            <div className="progress-section">
                <h3>Progress</h3>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                <p className="progress-text">
                    🎯 Progress: {completedCount} / {goal} times completed ({Math.round(progress)}%)
                </p>
                {isComplete && (
                    <p className="congrats-message">🎉 Congratulations! You've completed all {goal} times! 🎉</p>
                )}
            </div>

            <div className="calendar-section">
                <h3>📆 Calendar - Days when you completed</h3>
                <div className="calendar-header">
                    <button className="calendar-nav" onClick={goToPreviousMonth}>←</button>
                    <span className="calendar-month">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="calendar-nav" onClick={goToNextMonth}>→</button>
                </div>
                <div className="calendar-weekdays">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div className="calendar-grid">
                    {calendarDays.map((day, index) => (
                        <div 
                            key={index} 
                            className={`calendar-day ${day ? (day.completed ? 'calendar-day-completed' : 'calendar-day-normal') : 'calendar-day-empty'}`}
                            title={day && day.completed ? `Completed Day ${day.dayNumber}` : ''}
                        >
                            {day ? day.day : ''}
                        </div>
                    ))}
                </div>
                <p className="calendar-hint">
                    💚 Green days = days when you completed a habit
                </p>
            </div>

            <div className="history-section">
                <h3>📝 Completion History</h3>
                <ul className="history-list">
                    {completedDays.length > 0 ? (
                        [...completedDays].sort((a, b) => b.timestamp - a.timestamp).map((item, index) => (
                            <li key={index}>
                                ✅ {item.date} - Completed Day {item.dayNumber}
                            </li>
                        ))
                    ) : (
                        <li className="no-history">No completions yet. Click on squares to track your progress!</li>
                    )}
                </ul>
            </div>

            <button className="back-button" onClick={() => navigate('/')}>
                ← Back to Habits
            </button>
        </div>
    );
}

export default HabitDetail;