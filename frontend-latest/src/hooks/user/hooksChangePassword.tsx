import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import axios from 'axios';

export const hooksChangePassword = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        setLoading(true);
        setError(null);

        try {
            if(newPassword !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            const response = await api.post("/user/change-password", {
                OldPassword: oldPassword,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: state.user?.accessToken || "",
                },
            });

            if(response.status !== 200) {
                throw new Error("Error changing password");
            }

            setLoading(false);
            return true;
        } catch (error: any) {
            console.error(error.response?.data);
            setError(error.response?.data);
            setLoading(false);
            return false;
        }
    }

    return { changePassword, loading, error };
};