import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  LoginPage,
  HomePage,
  UserPage,
  InventoryPage,
  OrderListPage,
  RetrievePage,
  StoreListPage,
  MapPage,
} from "./pages";
import { checkAuth } from "./components/authService";
import { AuthContext, ServerContext } from "./context";
import TopBar from "./components/TopBar"; // Import your TopBar component

const SERVER_URL = "http://192.168.1.48:5001";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await checkAuth(SERVER_URL);
        setIsAuthenticated(response.authenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userInfo, setUserInfo }}
    >
      <ServerContext.Provider value={{ SERVER_URL }}>
        <Router>
          {location.pathname !== "/login" && <TopBar />}
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/home" /> : <LoginPage />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <HomePage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/user"
              element={
                isAuthenticated ? <UserPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/map"
              element={isAuthenticated ? <MapPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/inventory"
              element={
                isAuthenticated ? <InventoryPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/order_list"
              element={
                isAuthenticated ? <OrderListPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/retrieve"
              element={
                isAuthenticated ? <RetrievePage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/store_list"
              element={
                isAuthenticated ? <StoreListPage /> : <Navigate to="/login" />
              }
            />
            {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          </Routes>
        </Router>
      </ServerContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
