import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { login } from "../components/authService";
import { AuthContext, ServerContext } from "../context";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // success or error
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserInfo } = useContext(AuthContext);
  const { SERVER_URL } = useContext(ServerContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password, SERVER_URL);
      if (response.success) {
        navigate("/");
        setUserInfo(response.user);
        setIsAuthenticated(true);
      } else {
        console.log(response.message); // Log the message
        setMessage(response.message.toString());
        setAlertType("error");
      }
    } catch (error) {
      console.log(error); // Log any network errors
      setMessage(error);
      setAlertType("error");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={2}
        sx={{
          marginTop: "20vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: 2,
          width: "500px",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="text"
            label="Username"
            name="text"
            autoComplete="text"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 8, mb: 2 }}
          >
            Sign In
          </Button>
          {message && (
            <Alert severity={alertType} sx={{ width: "100%", mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
