import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import "./custom.css";
<<<<<<< HEAD

import { SocketProvider } from "./context/SocketContext";

import axios from "axios";

// Configure Axios defaults globally
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000/api/v1/rtcds";



=======
import { SocketProvider } from "./context/SocketContext";

>>>>>>> wind-breathing
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