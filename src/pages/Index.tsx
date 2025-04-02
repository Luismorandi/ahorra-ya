
import React, { useState } from 'react';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import CurrencyManager from '@/components/CurrencyManager';
import ExpenseListManager from '@/components/ExpenseListManager';
import ExpenseManager from '@/components/ExpenseManager';
import IncomeManager from '@/components/IncomeManager';
import { LayoutGrid, DollarSign, ListChecks, Receipt, Wallet } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <FinanceProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
              <TabsTrigger value="dashboard" className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="currencies" className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Monedas</span>
              </TabsTrigger>
              <TabsTrigger value="expenseLists" className="flex items-center">
                <ListChecks className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Listas</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center">
                <Receipt className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Gastos</span>
              </TabsTrigger>
              <TabsTrigger value="incomes" className="flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Ingresos</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="currencies" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Administrar Monedas</h2>
              <CurrencyManager />
            </TabsContent>
            
            <TabsContent value="expenseLists" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Listas de Gastos</h2>
              <ExpenseListManager />
            </TabsContent>
            
            <TabsContent value="expenses" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Administrar Gastos</h2>
              <ExpenseManager />
            </TabsContent>
            
            <TabsContent value="incomes" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Administrar Ingresos</h2>
              <IncomeManager />
            </TabsContent>
          </Tabs>
        </main>
        <footer className="bg-white py-4 border-t">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            © 2023 Ahorro en Dólares Fácil - Controla tus gastos y maximiza tus ahorros
          </div>
        </footer>
      </div>
    </FinanceProvider>
  );
};

export default Index;
