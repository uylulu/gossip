import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { AuthAction, AuthContextType, AuthProviderProps, AuthResponse, AuthState } from "../types/Auth";
import { User } from "../types/User";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return {
                isAuthenticated: true,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children } : AuthProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: null,
    } as AuthState);
    const navigate = useNavigate();

    const refreshAccessToken = async () => {
        try {
            const response = await api.post<AuthResponse>("auth/refresh", {
                withCredentials: true,
            });
            dispatch({
                type: "LOGIN",
                payload: response.data.payload.data,
            });
            navigate("/");

        } catch (error) {
            console.error("Error refreshing access token: ", error);
            dispatch({
                type: "LOGOUT",
                payload: null,
            })
        }
    }

    useEffect(() => {
        if(!state.isAuthenticated) {
            refreshAccessToken();
        }
    }, [state.isAuthenticated]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
