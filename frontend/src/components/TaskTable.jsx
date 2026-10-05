export default function TaskTable({ tasks, loading, error }) {
  if (loading) {
    return (
      <div className="state-card loading-state">
        <div className="spinner-ring">
          <div></div><div></div><div></div><div></div>
        </div>
        <p className="loading-text">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-card error-state">
        <div className="error-badge-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div>
          <h3>Failed to load tasks</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="state-card empty-state">
        <div className="empty-illustration">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
            <path d="M11 8v6M8 11h6" strokeLinecap="round"></path>
          </svg>
        </div>
        <h3>No matching tasks found</h3>
        <p>Try adjusting your search query, status, or assignee filter.</p>
      </div>
    );
  }

  const getAvatarColor = (name) => {
    if (!name) return 'avatar-default';
    const colors = ['avatar-indigo', 'avatar-emerald', 'avatar-amber', 'avatar-rose', 'avatar-sky'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: '70px' }}>ID</th>
            <th>Task & Description</th>
            <th style={{ width: '140px' }}>Status</th>
            <th style={{ width: '110px' }}>Priority</th>
            <th style={{ width: '150px' }}>Assignee</th>
            <th style={{ width: '130px' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="task-row">
              <td className="task-id">#{task.id}</td>
              <td className="task-info-cell">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-desc">{task.description}</div>}
              </td>
              <td>
                <span className={`status-badge ${(task.status || '').toLowerCase()}`}>
                  <span className="status-dot"></span>
                  {task.status ? task.status.replace('_', ' ') : 'UNKNOWN'}
                </span>
              </td>
              <td>
                <span className={`priority-badge ${(task.priority || '').toLowerCase()}`}>
                  {task.priority || 'MEDIUM'}
                </span>
              </td>
              <td>
                <div className="assignee-wrapper">
                  {task.assignee ? (
                    <>
                      <div className={`avatar ${getAvatarColor(task.assignee)}`}>
                        {task.assignee.charAt(0).toUpperCase()}
                      </div>
                      <span className="assignee-name">{task.assignee}</span>
                    </>
                  ) : (
                    <span className="unassigned-text">— Unassigned</span>
                  )}
                </div>
              </td>
              <td className="created-cell">
                {formatDate(task.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
