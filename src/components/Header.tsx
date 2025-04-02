
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { calculateSavings, currencies } = useFinance();
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const isMobile = useIsMobile();
  
  const savings = calculateSavings(displayCurrency);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between mb-4 md:mb-0">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 mr-2 text-finance-blue" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {isMobile ? 'Ahorro Fácil' : 'Ahorro en Dólares Fácil'}
            </h1>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 w-40">
            <Select 
              value={displayCurrency}
              onValueChange={setDisplayCurrency}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Moneda" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-sm">
            <div className="text-sm text-gray-500">Ahorro del mes</div>
            <div className={`text-xl font-bold ${savings >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
              {displayCurrency} {savings.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
