import React, { useState, useRef, useEffect, use } from "react";
import styles from "../css/TaskItem.module.css";
import Button from "./Button";


const CheckIcon = () => <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>;
const EditIcon = () => <svg viewBox="0 0 16 16"  width="14" height="14" fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.75.466l-3.162.962a.75.75 0 0 1-.928-.928l.962-3.162a1.752 1.752 0 0 1 .466-.75l8.61-8.61Zm-1.444 2.502-6.81 6.81V12.5h1.728l6.81-6.81-1.728-1.728Z" /></svg>;
const DeleteIcon = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.75.75 0 0 0 .746.675h3.197a.75.75 0 0 0 .746-.675l.66-6.6a.75.75 0 0 0-1.492-.15l-.66 6.6H6.802l-.66-6.6a.75.75 0 0 0-1.492.15Z" /></svg>;
const NotesIcon = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M3 1.75A1.75 1.75 0 0 1 4.75 0h4.5A1.75 1.75 0 0 1 11 .957V1h1.25A1.75 1.75 0 0 1 14 2.75v4.512A1.75 1.75 0 0 1 12.25 9H12v.957A1.75 1.75 0 0 1 10.25 11h-1.5V9.25A1.75 1.75 0 0 0 7 7.5H3V1.75ZM4.5 6h2a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1Zm0-2h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0 0 1Z M10.25 12A.25.25 0 0 0 10 12.25v.5A.25.25 0 0 0 10.25 13h.5a.25.25 0 0 0 .25-.25V12.5h1.75a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25h-1.5a.25.25 0 0 0-.25.25V12h-.5Z"/></svg>;

const TaskItem = ({ task, onUpdateTask, onDeleteTask, onToggleTaskCompletion, onSelectTask, isActive, isCompletedList }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedEstPomodoros, setEditedEstPomodoros] = useState(task.estPomodoros);
  const [showNotes, setShowNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(task.notes || '');

  const editNameInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editNameInputRef.current) {
      editNameInputRef.current.focus();
      editNameInputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editedName.trim() === "") {
      alert("Task name cannot be empty");
      setEditedName(task.name);
      return;
    }
     onUpdateTask({ ...task, name: editedName.trim(), estPomodoros: parseInt(editedEstPomodoros, 10) || 1 });
    setIsEditing(false);
  }

  const handleNotesSave = () => {
    onUpdateTask({ ...task, notes: editedNotes });
    setShowNotes(false); // Optionally close notes after saving
  }

  const handleSelectTask = (e) => {
   if (e.target.closest('button') || e.target.closest(`.${styles.checkbox}`)) {
        return;
    }
    if (!isCompletedList) {
      onSelectTask(task.id);
    }
  }

  if (isEditing) {
    return (
      <li className={`${styles.taskItem} ${styles.editing}`}>
        <form onSubmit={handleSaveEdit} className={styles.editForm}>
          <input
            ref={editNameInputRef}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className={styles.editInputName}
          />
          <div className={styles.editPomodoroControl}>
            Est:
            <input
              type="number"
              value={editedEstPomodoros}
              min="1"
              onChange={(e) => setEditedEstPomodoros(e.target.value)}
              className={styles.editInputPomos}
            />
          </div>
          <div className={styles.editActions}>
            <Button type="submit" className={`${styles.actionButton} ${styles.saveEditButton}`}>Save</Button>
            <Button type="button" onClick={() => { setIsEditing(false); setEditedName(task.name); setEditedEstPomodoros(task.estPomodoros);}} className={`${styles.actionButton} ${styles.cancelEditButton}`}>Cancel</Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`${styles.taskItem} ${isActive ? styles.activeTask : ''} ${task.completed ? styles.completedTask : ''}`}>
      <div className={styles.taskMainContent} onClick={handleSelectTask}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleTaskCompletion(task.id);
          }}
          className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}
          role="checkbox"
          aria-checked={task.completed}
          tabIndex="0"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleTaskCompletion(task.id)}}
          aria-label={task.completed ? `Mark ${task.name} as incomplete` : `Mark ${task.name} as complete`}
        >
          {task.completed && <CheckIcon />}
        </div>
        <span className={styles.taskName}>{task.name}</span>
        {!isCompletedList && (
            <div className={styles.taskPomodoros}>
            <span className={styles.completedPomosCount}>{task.completedPomodoros}</span>
            <span className={styles.pomodoroSeparator}>/</span>
            <span className={styles.estPomosCount}>{task.estPomodoros}</span>
            </div>
        )}
        <div className={styles.taskActions}>
          {!task.completed && <Button onClick={() => setIsEditing(true)} className={styles.actionButton} title="Edit Task"><EditIcon /></Button>}
          <Button onClick={() => setShowNotes(!showNotes)} className={styles.actionButton} title={showNotes ? "Hide Notes" : "Show Notes"}><NotesIcon /></Button>
          <Button onClick={() => onDeleteTask(task.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Delete Task"><DeleteIcon /></Button>
        </div>
      </div>
      {showNotes && (
        <div className={styles.notesSection}>
          <textarea
            placeholder="Your notes..."
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            rows="3"
            className={styles.notesTextarea}
          />
          <Button onClick={handleNotesSave} className={`${styles.actionButton} ${styles.notesSaveButton}`}>Save Notes</Button>
        </div>
      )}
    </li>
  );
};

export default TaskItem;