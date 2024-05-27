// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#192832", // Change this to your primary color
      contrastText: "#EFF1ED",
    },
    secondary: {
      main: "#4ECBFF", // Change this to your secondary color
      contrastText: "#EFF1ED",
    },
    background: {
      default: "#2D465A", // Change this to your desired background color
      contrastText: "#EFF1ED",
      paper: "#192832",
    },
    text: {
      primary: "#EFF1ED", // Change this to your desired primary text color
      secondary: "#EFF1ED", // Change this to your desired secondary text color
    },
  },
});

/*
color palette
black1 = #192832
black2 = #2D465A
blue = #4ECBFF
green = #4CFFBE
white = #EFF1ED
*/

export default theme;
