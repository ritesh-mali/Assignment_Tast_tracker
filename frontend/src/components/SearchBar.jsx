export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-container">
      <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="search-clear-btn"
          onClick={() => onChange('')}
          title="Clear search"
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}
