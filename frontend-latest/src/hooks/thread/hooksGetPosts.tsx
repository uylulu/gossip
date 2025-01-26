import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { ThreadResponse } from "../../types/Thread";

export const hooksGetPosts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function getPosts() {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<ThreadResponse>("/threads");
            return response;
        } catch (error) {
            console.error("Error getting posts: ", error);
            setError("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    }

    return { getPosts, error, loading };
};
