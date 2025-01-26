import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

export const hooksChangeUsername = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const changeUsername = async (newUsername: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/user/change-username", {
                NewUsername: newUsername,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: state.user?.accessToken || "",
                },
            });

            if(response.status !== 200) {
                console.error("Error changing username: ", response);
                throw new Error("Error changing username");
            }
            
            if(state.user) {
                let newUser = state.user;
                newUser.Username = newUsername;
                dispatch({
                    type: "LOGIN",
                    payload: newUser,
                });
            }
            
            setLoading(false);
            navigate("/");
            return true;
        } catch (error : any) {
            console.error("Error changing username: ", error);
            setError(error.response?.data);
            setLoading(false);
            return false;
        }
    }

    return { changeUsername, loading, error };
}
