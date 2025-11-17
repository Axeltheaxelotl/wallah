import React from 'react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'number' | 'url';
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'red' | 'indigo';
  min?: number;
}

const colorClasses = {
  blue: 'focus:ring-blue-400 focus:border-blue-400',
  green: 'focus:ring-green-400 focus:border-green-400',
  purple: 'focus:ring-purple-400 focus:border-purple-400',
  yellow: 'focus:ring-yellow-400 focus:border-yellow-400',
  orange: 'focus:ring-orange-400 focus:border-orange-400',
  red: 'focus:ring-red-400 focus:border-red-400',
  indigo: 'focus:ring-indigo-400 focus:border-indigo-400',
};

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  color = 'blue',
  min
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
        className={`
          w-full px-4 py-3 
          border-2 border-gray-200 rounded-xl
          bg-white/50
          transition-all duration-200
          hover:border-gray-300
          focus:outline-none focus:ring-2 
          ${colorClasses[color]}
          placeholder-gray-400
        `}
        placeholder={placeholder}
        min={min}
      />
    </div>
  );
};

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'red' | 'indigo';
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 4,
  color = 'blue'
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 
          border-2 border-gray-200 rounded-xl
          bg-white/50
          transition-all duration-200
          hover:border-gray-300
          focus:outline-none focus:ring-2 
          ${colorClasses[color]}
          placeholder-gray-400
          resize-none
        `}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
};

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'red' | 'indigo';
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options,
  color = 'blue'
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 
          border-2 border-gray-200 rounded-xl
          bg-white/50
          transition-all duration-200
          hover:border-gray-300
          focus:outline-none focus:ring-2 
          ${colorClasses[color]}
          cursor-pointer
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};
