
import React, { memo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  helpText?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
}

const FormField: React.FC<FormFieldProps> = memo(({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  success = false,
  helpText,
  disabled = false,
  options = []
}) => {
  console.log(`[FormField ${id}] Rendering - value:`, value);

  // Memoize input change handler to prevent recreation on each render
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.log(`[FormField ${id}] Input changed to:`, newValue);
    onChange(newValue);
  }, [id, onChange]);

  // Memoize select change handler to prevent recreation on each render
  const handleSelectChange = useCallback((newValue: string) => {
    console.log(`[FormField ${id}] Select changed to:`, newValue);
    onChange(newValue);
  }, [id, onChange]);

  // Memoize input className to prevent recreation on each render
  const inputClassName = React.useMemo(() => {
    let baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors";
    
    if (error) {
      return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    
    if (success) {
      return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  }, [error, success]);

  // Memoize the input rendering to prevent unnecessary re-renders
  const renderInput = React.useMemo(() => {
    if (type === 'select') {
      return (
        <Select value={value} onValueChange={handleSelectChange} disabled={disabled}>
          <SelectTrigger className={inputClassName}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (type === 'textarea') {
      return (
        <Textarea
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClassName}
          rows={3}
        />
      );
    }

    return (
      <Input
        id={id}
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
      />
    );
  }, [type, value, placeholder, disabled, inputClassName, id, handleInputChange, handleSelectChange, options]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {success && <CheckCircle size={16} className="text-green-500" />}
        {error && <AlertCircle size={16} className="text-red-500" />}
      </div>
      
      {renderInput}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
