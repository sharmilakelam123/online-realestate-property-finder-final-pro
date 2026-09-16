import React, { useEffect, useState } from "react";
import "./UsersTable.css";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);

        // Demo users from properties
        const response = await fetch(
          "http://localhost:5000/api/properties?limit=60&page=1"
        );

        if (!response.ok) {
          throw new Error("Unable to load users");
        }

        const data = await response.json();

        const properties = Array.isArray(data)
          ? data
          : data.items || [];

        const userMap = new Map();

        properties.forEach((property) => {
          if (property.user?._id) {
            userMap.set(property.user._id, property.user);
          }
        });

        setUsers(Array.from(userMap.values()));
      } catch (error) {
        console.error(error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="users-table-card">
      <div className="users-table-header">
        <div>
          <h2>Registered Users</h2>
          <p>Users associated with properties on RealFinder</p>
        </div>

        <div className="users-count">
          {users.length} Users
        </div>
      </div>

      {loading ? (
        <div className="users-loading">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="users-empty">
          <div className="users-empty-icon">👤</div>
          <h3>No Users Found</h3>
          <p>
            User information will appear here when available.
          </p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || index}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {user.name || "User"}
                        </strong>

                        <span>
                          User ID:{" "}
                          {user._id
                            ? user._id.slice(-6)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    {user.email || "Not available"}
                  </td>

                  <td>
                    <span className="user-role">
                      {user.role || "User"}
                    </span>
                  </td>

                  <td>
                    <span className="user-status">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}