import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from "@mui/material";
import { login } from "../components/authService";
import { AuthContext } from "../context";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // success or error
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.success) {
        navigate("/");
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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {message && (
            <Alert severity={alertType} sx={{ width: "100%", mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
