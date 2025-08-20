const RadioButton = ({ checked, onChange, label, name, value }) => {
  return (
    <label className="flex items-center gap-1 cursor-pointer">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded-full border ${
            checked ? 'border-gray-400' : 'border-gray-300'
          } flex items-center justify-center`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
        </div>
      </div>
      <span className="text-gray-600 text-sm">{label}</span>
    </label>
  );
};

export const RadioGroup = ({ label, name, value, onChange, options }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <label className="text-gray-600 text-sm w-40 flex-shrink-0">
          {label}
        </label>
        <div className="flex gap-6">
          {options.map((option) => (
            <RadioButton
              key={option.value}
              checked={value === option.value}
              onChange={onChange}
              label={option.label}
              name={name}
              value={option.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
