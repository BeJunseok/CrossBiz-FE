export const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-600 text-sm">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-9 py-4 text-sm text-black bg-transparent rounded-none border-b border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
        />
      </div>
    </div>
  );
};
