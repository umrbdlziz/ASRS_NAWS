import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../components/authService";
import { AuthContext } from "../context";

const HomePage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    console.log("Logging out");
    await logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to the ASRS Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default HomePage;
