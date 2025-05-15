import React, {useState} from "react";
import TaskList from './TaskList';
import AddTaskItem from './AddTaskItem';
import Button from './Button';
import styles from '../css/TaskManager.module.css';

const TaskManager = ({  tasks, onAddTask, onUpdateTask, onDeleteTask, onToggleTaskCompletion, onSelectTask, activeTaskId }) => {
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const unfinishedTasks = tasks.filter(task => !task.completed);
  const finishedTasks = tasks.filter(task => task.completed);

  return (
    <div className={styles.taskManagerContainer}>
      <div className={styles.tasksHeader}>
        <span className={styles.tasksTitle}>Tasks</span>
        {/* Placeholder for future options like filtering or sorting if needed */}
      </div>

      {/* Unfinished Tasks */}
      <TaskList
        tasks={unfinishedTasks}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onToggleTaskCompletion={onToggleTaskCompletion}
        onSelectTask={onSelectTask}
        activeTaskId={activeTaskId}
        listTitle="To Do"
      />

      {/* Add Task Button / Form */}
      {showAddTaskForm ? (
        <AddTaskItem
          onAddTask={(name, est) => {
            onAddTask(name, est);
            setShowAddTaskForm(false);
          }}
          onCancel={() => setShowAddTaskForm(false)}
        />
      ) : (
        <Button
          onClick={() => setShowAddTaskForm(true)}
          className={styles.addTaskButton}
        >
          + Add Task
        </Button>
      )}

      {/* Finished Tasks (Optional Section) */}
      {finishedTasks.length > 0 && (
        <div className={styles.completedTasksSection}>
          <TaskList
            tasks={finishedTasks}
            onUpdateTask={onUpdateTask} // For potential edits or un-completing
            onDeleteTask={onDeleteTask}
            onToggleTaskCompletion={onToggleTaskCompletion}
            onSelectTask={() => {}} // Completed tasks are not typically "selected" for work
            activeTaskId={null} // No active task in completed list
            listTitle="Completed"
            isCompletedList={true}
          />
        </div>
      )}
    </div>
  );
}


export default TaskManager;