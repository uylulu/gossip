import api from "../../api/api";
import React, { useState } from "react";
import { AuthResponse } from "../../types/Auth";

export const hooksRegister = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const register = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<AuthResponse>("/auth/register", {
                Username: username,
                Password: password,
            });
            
            if(response.status !== 200) {
                console.error("Error registering: ", response);
                throw new Error("Error registering");
            }
            setLoading(false);
            return true;
        } catch (error: any) {
            setError(error.response?.data);
            setLoading(false);
            return false;
        }
    }

    return { register, loading, error };
}