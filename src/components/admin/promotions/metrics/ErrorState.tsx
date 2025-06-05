
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface ErrorStateProps {
  errorMessage: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Métriques des promotions</CardTitle>
        <CardDescription>
          {errorMessage}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ErrorState;
