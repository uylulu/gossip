import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { AuthResponse } from "../../types/Auth";
import { useNavigate } from "react-router-dom";

export const hooksLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<AuthResponse>("/auth/login", {
                Username: username,
                Password: password,
            }, {
                withCredentials: true,
            })

            if(response.status !== 200) {
                console.error("Error logging in: ", response);
                throw new Error("Error logging in");
            }

            dispatch({
                type: "LOGIN",
                payload: response.data.payload.data,
            });
            
            setLoading(false);
            navigate("/");
        } catch (error: any) {
            console.error("Error logging in: ", error);
            setError(error.response?.data);
            setLoading(false);
        }
    };
    return { login, loading, error };
}