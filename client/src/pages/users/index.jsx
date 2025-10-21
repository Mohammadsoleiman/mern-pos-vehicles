// client/src/pages/users/index.jsx
import { useState } from "react";
import UsersList from "./UsersList";
import UserCreate from "./UserCreate";
import UserEdit from "./UserEdit";
import "../../styles/users.css";

export default function UsersPage() {
  const [view, setView] = useState("list"); // list | create | edit
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setView("edit");
  };

  const handleBack = () => {
    setSelectedUser(null);
    setView("list");
  };

  return (
    <div className="users-page">
      {view === "list" && (
        <UsersList onCreate={() => setView("create")} onEdit={handleEdit} />
      )}
      {view === "create" && <UserCreate onBack={handleBack} />}
      {view === "edit" && (
        <UserEdit user={selectedUser} onBack={handleBack} />
      )}
    </div>
  );
}
