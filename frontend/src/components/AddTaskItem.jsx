import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import styles from '../css/AddTaskItem.module.css';

const AddTaskItem = ({ onAddTask, onCancel }) => {
    const [taskName, setTaskName] = useState('');
    const [estPomodoros, setEstPomodoros] = useState(1);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim() === '') {
            alert('Task name cannot be empty');
            return;
        }
        onAddTask(taskName.trim(), parseInt(estPomodoros, 10) || 1);
        setTaskName('');
        setEstPomodoros(1);
    }

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
            <div className={styles.controlsRow}>
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
            <div className={styles.formActions}>
                <Button type="submit" variant="primary" className={styles.saveButton}>Add Task</Button>
                <Button type="button" onClick={onCancel} variant="secondary" className={styles.cancelButton}>Cancel</Button>
            </div>
        </form>
    );

}

export default AddTaskItem;