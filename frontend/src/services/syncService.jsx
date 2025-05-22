import axios from "axios";

export async function syncData() {
    const apiURL = import.meta.env.VITE_API_URL;

    if (!authToken) {
        console.warn("No auth token provided");
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
    };

    try {
        const response = await axios.post(`${apiURL}/api/sync`, {}, { headers });
        if (response.status === 200) {
            console.log('Sync successful:', response.data);
            return response.data;
        } else {
            console.error('Sync failed:', response.status, response.statusText);
            return null;
        }
    } catch (e) {
        console.error('Sync failed:', e);
        return null;
    }
}