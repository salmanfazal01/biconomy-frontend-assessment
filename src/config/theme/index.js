import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF4E17",
      light: "#eb7350",
      border1: grey[300],
    },
    text: {
      invert: "#f8f8f8",
    },
  },
});

export default theme;
