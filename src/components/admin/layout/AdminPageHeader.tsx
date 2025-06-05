
import React, { ReactNode } from 'react';
import { Separator } from "@/components/ui/separator";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  icon,
  actions
}) => {
  return (
    <div className="py-8 px-8 bg-white border-b shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {icon && <div className="text-primary text-2xl">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2 text-lg">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-3">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
