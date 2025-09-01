import React, { useState } from "react";
import "./AuditLog.css";

const initialLogs = [
  {
    id: 1,
    user: "Admin",
    action: "Import Stock",
    product: "Vitamin D",
    quantity: 100,
    details: "Batch #VITD2025 added, expiry 2026-05-01",
    timestamp: "2025-08-24 12:30:00",
  },
  {
    id: 2,
    user: "Admin",
    action: "Export Stock",
    product: "Vitamin D",
    quantity: 20,
    details: "Removed expired batch of Vitamin D (2000 IU), batch #VITD2024",
    timestamp: "2025-08-24 14:00:00",
  },
  {
    id: 3,
    user: "Khansa",
    action: "Sale",
    product: "Paracetamol",
    quantity: 5,
    details: "Sold 5 units from batch #PCM2025",
    timestamp: "2025-08-24 15:12:00",
  },{
    id: 1,
    user: "Admin",
    action: "Import Stock",
    product: "Vitamin D",
    quantity: 100,
    details: "Batch #VITD2025 added, expiry 2026-05-01",
    timestamp: "2025-08-24 12:30:00",
  },
  {
    id: 2,
    user: "Admin",
    action: "Export Stock",
    product: "Vitamin D",
    quantity: 20,
    details: "Removed expired batch of Vitamin D (2000 IU), batch #VITD2024",
    timestamp: "2025-08-24 14:00:00",
  },
  {
    id: 3,
    user: "Khansa",
    action: "Sale",
    product: "Paracetamol",
    quantity: 5,
    details: "Sold 5 units from batch #PCM2025",
    timestamp: "2025-08-24 15:12:00",
  },
  // 👉 add more demo logs to test pagination
];

function AuditLog() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // latest first
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter + Sort
  const filteredLogs = logs
    .filter((log) =>
      [log.user, log.action, log.product].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="audit-log-container">
      <h2>📑 Audit Log</h2>

      <div className="audit-log-controls">
        <input
          type="text"
          placeholder="Search by user, action, or product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to page 1 on search
          }}
        />
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="desc">Newest → Oldest</option>
          <option value="asc">Oldest → Newest</option>
        </select>
      </div>

      <table className="audit-log-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Action</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.length > 0 ? (
            currentLogs.map((log,index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.product}</td>
                <td>{log.quantity}</td>
                <td>{log.details}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditLog;
