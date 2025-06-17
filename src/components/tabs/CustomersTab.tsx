
import React from 'react';
import { CustomerMap } from '../../types/delivery';
import CustomerList from '../CustomerList';

interface CustomersTabProps {
  customers: CustomerMap;
}

const CustomersTab: React.FC<CustomersTabProps> = ({ customers }) => {
  return <CustomerList customers={customers} />;
};

export default CustomersTab;
