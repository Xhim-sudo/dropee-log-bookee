
import React from 'react';
import { Delivery, CustomerMap, MonthlyData } from '../../types/delivery';
import DataExport from '../DataExport';

interface ExportTabProps {
  deliveries: Delivery[];
  customers: CustomerMap;
  monthlyData: { [key: string]: MonthlyData };
  onStartNewMonth: () => void;
}

const ExportTab: React.FC<ExportTabProps> = ({
  deliveries,
  customers,
  monthlyData,
  onStartNewMonth
}) => {
  return (
    <DataExport
      deliveries={deliveries}
      customers={customers}
      monthlyData={monthlyData}
      onStartNewMonth={onStartNewMonth}
    />
  );
};

export default ExportTab;
