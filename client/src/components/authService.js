import axios from "axios";

export const login = async (username, password, SERVER_URL) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/login`,
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    // throw new Error("Login failed");
    return error.response.data;
  }
};

export const checkAuth = async (SERVER_URL) => {
  try {
    const response = await axios.get(`${SERVER_URL}/checkAuth`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Auth check failed");
  }
};

export const logout = async (SERVER_URL) => {
  try {
    const response = await axios.get(`${SERVER_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Logout failed");
  }
};
