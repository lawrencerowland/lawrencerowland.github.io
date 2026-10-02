export function Card({ className = '', ...props }) {
  return <div className={`border rounded shadow p-4 ${className}`} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h1 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`text-sm text-gray-600 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`space-y-2 ${className}`} {...props} />;
}
