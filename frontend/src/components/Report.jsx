import React, { useState, useMemo } from 'react';
import styles from '../css/Report.module.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Clock, CheckCircle, List } from 'lucide-react';
import { formatDate, formatDuration } from '../utils/formatTime';

const Report = ({ initialSessions = [], initialTasks = [] , onClose}) => {
  const [dateRange, setDateRange] = useState('last7days');

  const processedSessions = useMemo(() => {
    let sessionsToProcess = initialSessions;
    return sessionsToProcess.map(session => ({
      ...session,
      name: formatDate(session.date),
      focusTime: session.duration,
    }));
  }, [dateRange, initialSessions]);

  const totalFocusTime = useMemo(
    () => processedSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    [processedSessions]
  );
  const totalSessionsCount = processedSessions.length;
  const avgSessionDuration = totalSessionsCount > 0
    ? Math.round(totalFocusTime / totalSessionsCount)
    : 0;

  const filteredTasks = useMemo(() => {
    if (!initialTasks.length || !processedSessions.length) return [];
    const sessionDates = processedSessions.map(s => new Date(s.date)).filter(d => !isNaN(d));
    if (!sessionDates.length) return initialTasks;

    const reportStartDate = new Date(Math.min(...sessionDates));
    const reportEndDate = new Date(Math.max(...sessionDates));
    reportEndDate.setHours(23, 59, 59, 999);

    return initialTasks
      .filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        return taskDate >= reportStartDate && taskDate <= reportEndDate;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [processedSessions, initialTasks]);

  const SummaryCard = ({ title, value, icon, color }) => (
    <div className={styles.summaryCard} style={{ borderLeftColor: color }}>
      <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardValue}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.reportOverlay}>
      <div className={styles.reportModal}>
        <div className={styles.reportHeader}>
          <h1>Report</h1>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close Report">
            &times;
          </button>
        </div>

        <div className={styles.rangeSelector}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={styles.select}
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
          </select>
        </div>

        <div className={styles.cardGrid}>
          <SummaryCard
            title="Total Focus Time"
            value={formatDuration(totalFocusTime)}
            icon={<Clock size={24} className="text-red-500" />}
            color="#ef4444"
          />
          <SummaryCard
            title="Total Sessions"
            value={totalSessionsCount}
            icon={<CheckCircle size={24} className="text-blue-500" />}
            color="#3b82f6"
          />
          <SummaryCard
            title="Avg. Session"
            value={formatDuration(avgSessionDuration)}
            icon={<List size={24} className="text-green-500" />}
            color="#10b981"
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Focus Hours</h2>
          <p className={styles.sectionSubtitle}>Track your daily focus trends.</p>
          {processedSessions.length > 0 ? (
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={processedSessions} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatDuration} />
                  <Tooltip formatter={(value) => [formatDuration(value), "Focus Time"]} />
                  <Legend />
                  <Bar dataKey="focusTime" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">No session data available.</p>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Activity Summary</h2>
          <p className={styles.sectionSubtitle}>A log of your completed tasks during this period.</p>
          {filteredTasks.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredTasks.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={styles.taskHeader}>
                    <div>
                      <h3 className="font-medium text-gray-800">{task.name}</h3>
                      <p className="text-xs text-gray-500">
                        {task.project && `${task.project} • `}
                        {formatDate(task.date)} • {task.pomodoros} pomodoro{task.pomodoros > 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className={`${styles.statusBadge} ${task.status === 'completed' ? styles.completed : styles.pending}`}>
                      {task.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">No tasks found for this period.</p>
          )}
        </div>

        <div className={styles.footer}>
          <p>Pomofocus Clone Report UI</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
