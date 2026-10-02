export function Alert({ className = '', ...props }) {
  return (
    <div className={`border-l-4 border-blue-500 bg-blue-50 p-4 rounded-md flex gap-2 ${className}`} {...props} />
  );
}

export function AlertTitle({ className = '', ...props }) {
  return <h4 className={`font-semibold ${className}`} {...props} />;
}

export function AlertDescription({ className = '', ...props }) {
  return <div className={`text-sm ${className}`} {...props} />;
}
