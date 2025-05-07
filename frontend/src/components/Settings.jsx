import React, {useState, useEffect} from "react";
import styles from '../css/Settings.module.css';
import Button from "./Button";

const Settings = ({ initialSettings, onSave, onClose }) => {
    const [settings, setSettings] = useState(initialSettings);

    useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        const numValue = Math.max(1, parseInt(value, 10) || 1);
        setSettings(prev => ({ ...prev, [name]: numValue }));
    };

    const handleSave = () => {
        // Validate settings if needed
        event.preventDefault();
        onSave(settings);
        onClose();
    };

    return (
        <div className={styles.settingsOverlay}>
            <div className={styles.settingsModal}>
                <h2>Settings</h2>
                <form onSubmit={handleSave}>
                    <div className={styles.settingItem}>
                        <label htmlFor="workMinutes">Work (minutes):</label>
                        <input
                            type="number"
                            id="workMinutes"
                            name="workMinutes"
                            value={settings.workMinutes}
                            onChange={handleChange}
                            min="1"
                        />
                    </div>
                    <div className={styles.settingItem}>
                        <label htmlFor="shortBreakMinutes">Short Break (minutes):</label>
                        <input
                            type="number"
                            id="shortBreakMinutes"
                            name="shortBreakMinutes"
                            value={settings.shortBreakMinutes}
                            onChange={handleChange}
                            min="1"
                        />
                    </div>
                    <div className={styles.settingItem}>
                        <label htmlFor="longBreakMinutes">Long Break (minutes):</label>
                        <input
                            type="number"
                            id="longBreakMinutes"
                            name="longBreakMinutes"
                            value={settings.longBreakMinutes}
                            onChange={handleChange}
                            min="1"
                        />
                    </div>
                     <div className={styles.settingItem}>
                        <label htmlFor="longBreakInterval">Long Break Interval:</label>
                        <input
                            type="number"
                            id="longBreakInterval"
                            name="longBreakInterval"
                            value={settings.longBreakInterval}
                            onChange={handleChange}
                            min="1"
                            step="1"
                        />
                     </div>
                    <div className={styles.actions}>
                        <Button type="submit" variant="primary">Save</Button>
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;