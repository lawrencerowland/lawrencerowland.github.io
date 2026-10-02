export function Badge({ className = '', ...props }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${className}`} {...props} />
  );
}
