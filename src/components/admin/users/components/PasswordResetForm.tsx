
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { generatePassword } from '../utils/userTableUtils';

interface PasswordResetFormProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  newPassword,
  setNewPassword,
  showPassword,
  setShowPassword,
  onConfirm,
  onCancel
}) => {
  const handleGeneratePassword = () => {
    const password = generatePassword();
    setNewPassword(password);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border">
      <div className="flex gap-1">
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          className="text-xs border border-gray-300 rounded px-2 py-1 w-32"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPassword(!showPassword)}
          className="px-1"
        >
          {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGeneratePassword}
          className="px-1"
        >
          🎲
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onConfirm}
        disabled={!newPassword}
        className="text-green-600 border-green-600 hover:bg-green-50"
      >
        ✓
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="text-gray-600 border-gray-600 hover:bg-gray-50"
      >
        ✗
      </Button>
    </div>
  );
};

export default PasswordResetForm;
