import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import "./custom.css";
import { SocketProvider } from "./context/SocketContext";

document.documentElement.classList.remove('dark');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);