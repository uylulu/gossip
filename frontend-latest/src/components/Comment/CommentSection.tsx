import React from "react";
import { Thread } from "../../types/Thread";
import { useThreadContext } from "../../context/ThreadContext";
import IndividualComment from "./IndividualCommen";

interface CommentProps {
    MainThread: Thread;
}

const CommentSection = ({ MainThread }: CommentProps) => {
    const { threads } = useThreadContext();

    const renderReplies = (parentId: number): JSX.Element[] => {
        const childThreads = threads.filter(thread => thread.Parent_thread_id === parentId);

        return childThreads.map(child => (
            <IndividualComment Comment={child}/>
        ));
    };

    return (
        <div style={{ marginTop: "20px" }}>
            {MainThread.Thread_id !== undefined && renderReplies(MainThread.Thread_id)} 
        </div>
    );
};

export default CommentSection;
