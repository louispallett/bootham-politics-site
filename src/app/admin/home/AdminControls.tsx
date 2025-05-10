'use client'

import axios from "axios";
import { useState } from "react";

export default function AdminControls() {
    const [isPending, setIsPending] = useState(false);

    const handleLogOut = () => {
        setIsPending(true);
        axios.post("/api/auth/logout", {})
            .then(() => {})
            .finally(() => {
                window.location.reload();
            })
    }

    return (
        <div className="users-container">
            <div className="flex flex-col md:flex-row md:justify-between gap-2.5">
                <h4>Admin Controls</h4>
                <button onClick={handleLogOut}
                    className="btn-default"
                >
                { isPending ? (
                    <div className="spinner h-6 ws-6"></div>
                ) : (
                        <>Log Out</>
                    )}
                </button>
            </div>
            <p>Welcome to the administrator page. Here you can create, update, and delete posts. Click <a>here</a> for help.</p>
        </div>
    )
}