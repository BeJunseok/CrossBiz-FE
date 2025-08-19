export default function IconButton({ children, className="", ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}