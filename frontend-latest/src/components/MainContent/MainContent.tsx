import React, { useContext } from "react";
import { useThreadContext } from "../../context/ThreadContext";
import Thread from "../Thread/ThreadHeader";
import ThreadComponent from "../Thread/ThreadHeader";
import ThreadHeader from "../Thread/ThreadHeader";

const MainContent = () => {
    const { threads } = useThreadContext();

    return (
        <div>
            {threads.map((thread) => (
                <div key={thread.Thread_id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
                    {thread && <ThreadHeader thread={thread} />} 
                </div>
            ))}
        </div>
    );
}

export default MainContent;