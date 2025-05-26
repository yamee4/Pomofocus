import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import styles from '../css/AddTaskItem.module.css';
import axios from 'axios';

const AddTaskItem = ({ onAddTask, onCancel }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [estPomodoros, setEstPomodoros] = useState(1);
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

    const nameInputRef = useRef(null);
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (taskName.trim() === '') {
            alert('Task name cannot be empty');
            return;
        }

        try {
            const response = await axios.post(`${apiURL}/api/task/add_task`, {
                name: taskName.trim(),
                description: description.trim(),
                estimated_pomodoro: parseInt(estPomodoros, 10) || 1,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
                priority
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            // Clear form on success
            setTaskName('');
            setDescription('');
            setEstPomodoros(1);
            setDueDate('');
            setPriority('medium');

            onAddTask && onAddTask(response.data);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        }
    };



    return (
        <form onSubmit={handleSubmit} className={styles.addTaskForm}>
            <input
                ref={nameInputRef}
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What are you working on?"
                className={styles.inputName}
            />

             <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                className={styles.inputDescription}
                rows={3}
            />

            <div className={styles.controlsRow}>
                <div className={styles.inputGroup}>
                    <label htmlFor="estPomodoros" className={styles.labelEst}>Est Pomodoros:</label>
                    <input
                    type="number"
                    id="estPomodoros"
                    value={estPomodoros}
                    onChange={(e) => setEstPomodoros(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min="1"
                    className={styles.inputPomos}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="priority" className={styles.labelEst}>Priority:</label>
                    <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={styles.inputSelect}
                    >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    </select>
                </div>
            </div>


            <div className={styles.formActions}>
                <Button type="submit" variant="primary" className={styles.saveButton}>Add Task</Button>
                <Button type="button" onClick={onCancel} variant="secondary" className={styles.cancelButton}>Cancel</Button>
            </div>
        </form>

    );

}

export default AddTaskItem;