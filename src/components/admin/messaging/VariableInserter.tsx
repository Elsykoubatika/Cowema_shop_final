
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';

interface Variable {
  name: string;
  description: string;
}

interface VariableInserterProps {
  variables: Variable[];
  onInsert: (variable: string) => void;
}

export const VariableInserter: React.FC<VariableInserterProps> = ({
  variables,
  onInsert
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInsert = (variable: string) => {
    onInsert(variable);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Code size={16} className="mr-2" />
          Variables
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Variables disponibles</h4>
          <div className="grid gap-2">
            {variables.map((variable) => (
              <div
                key={variable.name}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => handleInsert(variable.name)}
              >
                <div>
                  <Badge variant="secondary" className="text-xs font-mono">
                    {variable.name}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {variable.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground border-t pt-2">
            Cliquez sur une variable pour l'insérer dans votre message
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
