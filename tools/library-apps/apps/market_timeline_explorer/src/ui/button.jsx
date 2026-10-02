export function Button({ className = '', variant, size, ...props }) {
  const variantClass =
    variant === 'outline'
      ? 'border'
      : variant === 'secondary'
      ? 'bg-gray-200'
      : 'bg-blue-500 text-white';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-4 py-2';
  return (
    <button className={`${variantClass} ${sizeClass} rounded ${className}`} {...props} />
  );
}
