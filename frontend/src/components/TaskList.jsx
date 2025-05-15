import React from "react";
import TaskItem from "./TaskItem";
import styles from "../css/TaskList.module.css";

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onToggleTaskCompletion, onSelectTask, activeTaskId, listTitle, isCompletedList = false }) => {
  if(!tasks || tasks.length === 0) {
    return listTitle === "To Do" && !isCompletedList ? (
      <p className={styles.noTasksMessage}>No tasks here. Add one to get started!</p>
    ) : null;
  }

  return (
    <div className={styles.taskListContainer}>
     {listTitle && <h3 className={styles.listTitle}>{listTitle}</h3>}
      <ul className={styles.taskList}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onToggleTaskCompletion={onToggleTaskCompletion}
            onSelectTask={onSelectTask}
            isActive={task.id === activeTaskId && !isCompletedList} // Only active if not in completed list
            isCompletedList={isCompletedList}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;