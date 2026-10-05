export default function AssigneeFilter({ value, onChange }) {
  const assignees = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

  return (
    <select className="status-filter" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All assignees</option>
      {assignees.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
