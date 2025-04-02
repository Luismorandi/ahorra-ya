
import React from 'react';
import { DollarSign } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';

const Header = () => {
  const { calculateSavings } = useFinance();
  const savings = calculateSavings();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <DollarSign className="w-8 h-8 mr-2 text-finance-blue" />
          <h1 className="text-2xl font-bold text-gray-800">Ahorro en Dólares Fácil</h1>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-sm">
          <div className="text-sm text-gray-500">Ahorro del mes</div>
          <div className={`text-xl font-bold ${savings >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
            USD {savings.toFixed(2)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
