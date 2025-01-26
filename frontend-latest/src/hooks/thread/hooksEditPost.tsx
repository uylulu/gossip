import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

export const hooksEditPost = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useAuth();

    const editPost = async (title: string, content: string, tag: string, thread_id: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/threads/edit", {
                Title: title,
                Content: content,
                Tag_content: tag,
                User_id: state.user?.User_id,
                Thread_id: thread_id,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: state.user?.accessToken || "",
                },
            });

            if(response.status !== 200) {
                throw new Error("Error editing post");
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

    return { editPost, loading, error };
};