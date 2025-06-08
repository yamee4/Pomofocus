import React, {useState, useEffect} from "react";
import styles from '../css/Settings.module.css';
import Button from "./Button";
import { updateSettings } from "../utils/settingsUtils";

const Settings = ({ initialSettings, onSave, onClose, isLogin}) => {
    const [settings, setSettings] = useState(initialSettings);

    useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === "checkbox" ? checked : Math.max(1, parseInt(value, 10) || 1);

        setSettings(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // Send to backend
                const response = await updateSettings(settings);
                if (response.error) {
                    console.error("Error updating settings:", response.error);
                    alert("Failed to save settings. Please try again.");
                    return;
                }
            } 

        } catch (error) {
            console.error("Error saving settings:", error);
            alert("An error occurred while saving settings. Please try again.");    
        }

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
                                         <div className={styles.settingItem}>
                        <label>
                            <input
                                type="checkbox"
                                name="auto_start_breaks"
                                checked={settings.auto_start_breaks}
                                onChange={handleChange}
                            />
                            Auto-start Breaks
                        </label>
                    </div>
                    <div className={styles.settingItem}>
                        <label>
                            <input
                                type="checkbox"
                                name="auto_start_pomodoros"
                                checked={settings.auto_start_pomodoros}
                                onChange={handleChange}
                            />
                            Auto-start Pomodoros
                        </label>
                    </div>
                    <div className={styles.settingItem}>
                        <label>
                            <input
                                type="checkbox"
                                name="notifications_enabled"
                                checked={settings.notifications_enabled}
                                onChange={handleChange}
                            />
                            Enable Notifications
                        </label>
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