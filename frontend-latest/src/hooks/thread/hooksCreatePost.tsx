import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

export const hooksCreatePost = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useAuth();

    const createPost = async (title: string, content: string, tag: string, Parent_thread_id: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/threads/create", {
                Title: title,
                Content: content,
                Tag_content: tag,
                User_id: state.user?.User_id,
                Parent_thread_id: Parent_thread_id,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: state.user?.accessToken || "",
                },
            });

            if(response.status !== 200) {
                throw new Error("Error creating post");
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

    return { createPost, loading, error };
}