import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductData {
  name: string;
  revenue: number;
}

interface ProductChartProps {
  data: ProductData[];
}

const ProductChart: React.FC<ProductChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart 
        data={data} 
        layout="horizontal"
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          type="number"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
          tickFormatter={formatCurrency}
        />
        <YAxis 
          type="category"
          dataKey="name" 
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
          width={80}
        />
        <Tooltip 
          formatter={(value) => [formatCurrency(Number(value) || 0), 'Revenue']}
          labelStyle={{ color: '#111827' }}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem'
          }}
        />
        <Bar 
          dataKey="revenue" 
          fill="#8b5cf6" 
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductChart;
