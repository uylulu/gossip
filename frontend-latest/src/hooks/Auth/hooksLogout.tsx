import React from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";


export const hooksLogout = () => {
    const { state, dispatch } = useAuth();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    const logout = async () => {

        try {
            const response = await api.post("/auth/logout", {}, {
                withCredentials: true,
            })
            if(response.status !== 200) {
                console.error("Error logging out: ", response);
                throw new Error("Error logging out");
            }
            dispatch({
                type: "LOGOUT",
                payload: null,
            });
            return true;
        } catch (error: any) {
            console.error("Error logging out: ", error);
            setError(error.response?.data);
            return false;
        }
    };

    return { logout };
};