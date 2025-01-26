import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

export const hooksDeletePost = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useAuth();

    const deletePost = async (thread_id: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/threads/delete", {
                Thread_id: thread_id,
                User_id: state.user?.User_id,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: state.user?.accessToken || "",
                },
            });
            console.log(state);

            if(response.status !== 200) {
                throw new Error("Error deleting thread");
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

    return { deletePost, loading, error };
}