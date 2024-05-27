import axios from "axios";

const API_URL = "http://192.168.1.48:5001";

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // throw new Error("Login failed");
    return error.response.data;
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/checkAuth`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Auth check failed");
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Logout failed");
  }
};
