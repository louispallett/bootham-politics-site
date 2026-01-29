"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function AdminControls() {
  const [isPending, setIsPending] = useState(false);

  const handleLogOut = () => {
    setIsPending(true);
    axios
      .post("/api/auth/logout", {})
      .then(() => {})
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <div className="users-container text-center md:text-left">
      <div className="flex flex-col md:flex-row md:justify-between gap-2.5">
        <h4>Admin Controls</h4>

        <div className="flex gap-2.5 justify-between">
          <Link href="/admin/home" className="btn-default">
            Admin Home
          </Link>
          <button onClick={handleLogOut} className="btn-default">
            {isPending ? <div className="spinner h-6 w-6"></div> : <>Log Out</>}
          </button>
        </div>
      </div>
      <p className="mt-2.5">
        Welcome to the administrator page. Here you can create, update, and
        delete posts.
      </p>
    </div>
  );
}

