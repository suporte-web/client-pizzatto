import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Rotas from "./Rotas.tsx";
import { ToastProvider } from "./components/Toast.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF4D00",
    },
    secondary: {
      main: "#dee7e9",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <React.StrictMode>
        <ToastProvider>
          <Rotas />
        </ToastProvider>
      </React.StrictMode>
    </BrowserRouter>
  </ThemeProvider>
);
