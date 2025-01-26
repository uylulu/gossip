export interface Thread {
    Thread_id?: number;
    Parent_thread_id?: number;
    Title: string;
    Content: string;
    User_id?: number;
    Username: string;
    Tag_content: string;
    Likes: number | 0; 
    Created_at?: string;
    Is_edited?: boolean;
    Is_deleted?: boolean;
}

export interface ThreadResponse {
    payload: {
        data: Thread[];
    }
}