import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Thread } from '../types/Thread';
import { hooksGetPosts } from '../hooks/thread/hooksGetPosts';

interface ThreadContextType {
    threads: Thread[];
    sortThreadsByQuery: (query: string) => void;
    refreshThreads: () => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export const ThreadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const { getPosts } = hooksGetPosts();

    const levenshteinDistance = (a: string, b: string): number => {
        const dp: number[][] = Array(a.length + 1)
            .fill(null)
            .map(() => Array(b.length + 1).fill(0));
    
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + 1 
                    );
                }
            }
        }
        return dp[a.length][b.length];
    };


    const sortThreadsByQuery = (query: string) => {
        const newThreads = threads .map(thread => ({
                                        ...thread,
                                        distance: levenshteinDistance(thread.Tag_content.toLowerCase(), query.toLowerCase()),
                                    }))
                                    .sort((a, b) => a.distance - b.distance) 
                                    .map(({ distance, ...thread }) => thread); 
        setThreads(newThreads);
    }

    const refreshThreads = async () => {
        try {
            const response = await getPosts();
            if (response && response.data && response.data.payload) {
                setThreads(response.data.payload.data);
            } else {
                console.error("Invalid response structure: ", response);
            }
        } catch (error) {
            console.error("Error getting threads: ", error);
        }
    }

    useEffect(() => {
        refreshThreads();
    }, []);

    return (
        <ThreadContext.Provider value={{ threads, sortThreadsByQuery, refreshThreads }}>
            {children}
        </ThreadContext.Provider>
    );
};

export const useThreadContext = (): ThreadContextType => {
    const context = useContext(ThreadContext);
    if (!context) {
        throw new Error('useThreadContext must be used within a ThreadProvider');
    }
    return context;
};