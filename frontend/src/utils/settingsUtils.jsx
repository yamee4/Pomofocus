import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const syncSettings = async (setting) => {
  try {
    const response = await axios.post(`${apiURL}/api/sync/settings`, { setting },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // send cookies (JWT in HttpOnly cookie)
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error syncing setting:", error);
    throw error;
  }
}

export const getSettings = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/user/settings`, {
        withCredentials: true, // send cookies (JWT in HttpOnly cookie)
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
}

export const updateSettings = async (settings) => {
  try {
    const res = await axios.put(`${apiURL}/api/user/update_settings`, settings, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating setting:", error);
    throw error;
  }
}