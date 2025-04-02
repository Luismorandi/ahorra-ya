
import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const { calculateExpenseTotals, calculateIncomeTotals, calculateSavings, expenseLists } = useFinance();
  
  const expenses = calculateExpenseTotals();
  const incomes = calculateIncomeTotals();
  const savings = calculateSavings();
  
  const expensesByList = expenseLists.map(list => {
    const listTotal = list.expenses.reduce((total, expense) => {
      const currency = expense.currency;
      const conversionRate = 1; // You would get the actual conversion rate here
      return total + (expense.amount * conversionRate);
    }, 0);
    
    return {
      name: list.name,
      value: listTotal
    };
  }).filter(item => item.value > 0);
  
  // For the Pie Chart
  const data = [
    { name: 'Ingresos', value: incomes.totalInUSD },
    { name: 'Gastos', value: expenses.totalInUSD }
  ];
  
  const COLORS = ['#10b981', '#ef4444'];
  
  const formatCurrency = (value: number) => {
    return `USD ${value.toFixed(2)}`;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-finance-green" />
            Ingresos Totales
          </CardTitle>
          <CardDescription>
            Total de ingresos en USD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finance-green">
            USD {incomes.totalInUSD.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-finance-red" />
            Gastos Totales
          </CardTitle>
          <CardDescription>
            Total de todos los gastos en USD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finance-red">
            USD {expenses.totalInUSD.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-finance-blue" />
            Ahorro
          </CardTitle>
          <CardDescription>
            Ingresos menos gastos en USD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${savings >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
            USD {savings.toFixed(2)}
          </div>
          {savings >= 0 ? (
            <p className="text-sm text-gray-500 mt-2">¡Buen trabajo! Tienes un balance positivo.</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Cuidado, tus gastos superan tus ingresos.</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Distribución de Ingresos y Gastos</CardTitle>
          <CardDescription>
            Comparación visual de ingresos vs gastos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
