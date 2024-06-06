import { CircularProgress, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const LoadingSpinner = ({ text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <CircularProgress size={80} />
      <Box sx={{ width: 500, margin: "10px" }}>
        <Typography variant="h6">{text}</Typography>
      </Box>
    </Box>
  );
};

LoadingSpinner.propTypes = {
  text: PropTypes.string,
};

export default LoadingSpinner;
