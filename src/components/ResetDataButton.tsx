
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFinance } from '@/contexts/FinanceContext';

type ResetDataButtonProps = {
  type: 'all' | 'expenses' | 'incomes' | 'currencies' | 'expenseLists';
  className?: string;
};

const ResetDataButton = ({ type, className = '' }: ResetDataButtonProps) => {
  const { toast } = useToast();
  const finance = useFinance();

  const handleReset = () => {
    if (type === 'all') {
      localStorage.removeItem('currencies');
      localStorage.removeItem('expenseLists');
      localStorage.removeItem('incomes');
      // Reload the page to apply changes from localStorage
      window.location.reload();
      return;
    }

    if (type === 'currencies') {
      localStorage.removeItem('currencies');
      window.location.reload();
    }
    else if (type === 'expenses' || type === 'expenseLists') {
      localStorage.removeItem('expenseLists');
      window.location.reload();
    }
    else if (type === 'incomes') {
      localStorage.removeItem('incomes');
      window.location.reload();
    }

    toast({
      title: "Datos reseteados",
      description: "Se han borrado todos los datos seleccionados correctamente",
    });
  };

  const getButtonLabel = () => {
    switch(type) {
      case 'all': return 'Reiniciar todos los datos';
      case 'expenses': return 'Reiniciar gastos';
      case 'incomes': return 'Reiniciar ingresos';
      case 'currencies': return 'Reiniciar monedas';
      case 'expenseLists': return 'Reiniciar listas';
      default: return 'Reiniciar';
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`text-red-500 hover:bg-red-50 hover:text-red-600 ${className}`}
      onClick={handleReset}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {getButtonLabel()}
    </Button>
  );
};

export default ResetDataButton;
