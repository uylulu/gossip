// import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, orange } from "@mui/material/colors";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import ChangeUsername from "./pages/ChangeUsername";
import ChangePassword from "./pages/changePassword";
import Header from "./components/Header/Header";
import { ThreadProvider } from "./context/ThreadContext";
import ThreadPage from "./pages/ThreadPage";
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#121212',
        },
    },
});

const PrivateRoute: React.FC<{ children : React.ReactElement }> = ({ children }) => {
    const { state, dispatch } = useAuth();
    
    return state.isAuthenticated ? children : <Navigate to="/login" />;
}

const App: React.FC = () => {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <AuthProvider>
                        <ThreadProvider>
                            <Routes>
                                <Route 
                                    path="/" 
                                    element={
                                        <PrivateRoute>
                                            <Home />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/thread/:thread_id" 
                                    element={
                                        <PrivateRoute>
                                            <ThreadPage />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="change-username" 
                                    element={
                                        <PrivateRoute>
                                            <ChangeUsername />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="change-password" 
                                    element={
                                        <PrivateRoute>
                                            <ChangePassword />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route path="login" element={<Login />} />
                                <Route path="signup" element={<Signup />} />
                            </Routes>
                        </ThreadProvider>
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
};

export default App;
