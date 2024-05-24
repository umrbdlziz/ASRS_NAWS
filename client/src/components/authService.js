import axios from "axios";

const API_URL = "http://localhost:5001";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw new Error("Logout failed");
  }
};
