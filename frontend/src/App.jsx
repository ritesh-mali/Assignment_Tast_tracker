import { useState } from 'react';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import AssigneeFilter from './components/AssigneeFilter';
import TaskTable from './components/TaskTable';
import { useTasks } from './hooks/useTasks';
import { useDebounce } from './hooks/useDebounce';

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce query (300ms)
  const debouncedQuery = useDebounce(query, 300);

  const { tasks, total, loading, error } = useTasks(debouncedQuery, status, assignee, page, pageSize);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleQueryChange = (val) => {
    setQuery(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleAssigneeChange = (val) => {
    setAssignee(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setQuery('');
    setStatus('');
    setAssignee('');
    setPage(1);
  };

  const isFiltered = query.trim() !== '' || status !== '' || assignee !== '';

  const startRange = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRange = Math.min(page * pageSize, total);

  const statusTabs = [
    { label: 'All Tasks', value: '' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ];

  return (
    <div className="app-layout">
      {/* Header Banner */}
      <header className="app-header-card">
        <div className="header-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <div>
            <h1>Task Tracker</h1>
            <p className="subtitle">Enterprise Task Management & Activity Dashboard</p>
          </div>
        </div>

        <div className="stats-pill-container">
          <div className="stat-item">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Matching Tasks</span>
          </div>
        </div>
      </header>

      {/* Main Filter Section */}
      <main className="main-content">
        <div className="filter-card">
          {/* Quick Status Tabs */}
          <div className="status-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                className={`tab-btn ${status === tab.value ? 'active' : ''}`}
                onClick={() => handleStatusChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="controls-grid">
            <SearchBar value={query} onChange={handleQueryChange} />

            <div className="dropdown-group">
              <StatusFilter value={status} onChange={handleStatusChange} />
              <AssigneeFilter value={assignee} onChange={handleAssigneeChange} />
              {isFiltered && (
                <button className="clear-btn" onClick={handleClearFilters} title="Reset all filters">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="table-meta-bar">
            <span className="meta-text">
              {total > 0 ? (
                <>Showing <strong>{startRange}–{endRange}</strong> of <strong>{total}</strong> tasks</>
              ) : (
                'No matching records'
              )}
            </span>

            <div className="per-page-group">
              <label htmlFor="pageSizeSelect">Items per page: </label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <TaskTable tasks={tasks} loading={loading} error={error} />

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              className="page-nav-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              &larr; Previous
            </button>

            <span className="page-badge">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              className="page-nav-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
