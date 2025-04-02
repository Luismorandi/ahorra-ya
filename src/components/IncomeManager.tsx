
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, Trash, Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IncomeManager = () => {
  const { incomes, currencies, addIncome, updateIncome, deleteIncome } = useFinance();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD',
  });

  const handleAddSubmit = () => {
    if (!formData.description || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    addIncome({
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
    });
    
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Ingreso añadido",
      description: "El ingreso ha sido registrado correctamente",
    });
  };

  const handleEditSubmit = () => {
    if (!editingId || !formData.description || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    updateIncome(editingId, {
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
    });
    
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Ingreso actualizado",
      description: "El ingreso ha sido actualizado correctamente",
    });
  };

  const handleDelete = (id: string, description: string) => {
    deleteIncome(id);
    toast({
      title: "Ingreso eliminado",
      description: `"${description}" ha sido eliminado correctamente`,
    });
  };

  const startEdit = (income: any) => {
    setEditingId(income.id);
    setFormData({
      description: income.description,
      amount: income.amount.toString(),
      currency: income.currency,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      currency: 'USD',
    });
    setEditingId(null);
  };

  const formatCurrency = (amount: number, code: string) => {
    return `${amount.toFixed(2)} ${code}`;
  };
  
  const getCurrencyRate = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.conversionRate : 1;
  };
  
  const convertToUSD = (amount: number, currencyCode: string): number => {
    const rate = getCurrencyRate(currencyCode);
    return amount * rate;
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Administrar Ingresos
        </CardTitle>
        <CardDescription>
          Registra tus fuentes de ingresos para calcular tus ahorros
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incomes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pl-1">Descripción</th>
                    <th className="text-right py-2">Monto Original</th>
                    <th className="text-right py-2">Equivalente en USD</th>
                    <th className="text-right py-2 pr-1">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pl-1 font-medium">{income.description}</td>
                      <td className="py-3 text-right">{formatCurrency(income.amount, income.currency)}</td>
                      <td className="py-3 text-right">
                        USD {convertToUSD(income.amount, income.currency).toFixed(2)}
                      </td>
                      <td className="py-3 text-right pr-1">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => startEdit(income)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(income.id, income.description)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 font-medium">
                    <td colSpan={2} className="py-3 pl-1 text-right">Total:</td>
                    <td className="py-3 text-right">
                      USD {incomes.reduce((total, income) => 
                        total + convertToUSD(income.amount, income.currency), 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">No hay ingresos registrados</p>
              <p className="text-sm text-gray-400 mt-1">Añade un ingreso usando el botón "Añadir Ingreso"</p>
            </div>
          )}
          
          {/* Dialog for adding/editing incomes */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar Ingreso' : 'Añadir Ingreso'}</DialogTitle>
                <DialogDescription>
                  {editingId 
                    ? 'Modifica los datos del ingreso seleccionado' 
                    : 'Completa el formulario para registrar un nuevo ingreso'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="income-description">Descripción</Label>
                    <Input
                      id="income-description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Salario, Freelance, Inversiones, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="income-amount">Monto</Label>
                      <Input
                        id="income-amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="1000.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="income-currency">Moneda</Label>
                      <Select 
                        value={formData.currency}
                        onValueChange={(value) => setFormData({...formData, currency: value})}
                      >
                        <SelectTrigger id="income-currency">
                          <SelectValue placeholder="Selecciona una moneda" />
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
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }}>
                  Cancelar
                </Button>
                <Button onClick={editingId ? handleEditSubmit : handleAddSubmit}>
                  {editingId ? 'Actualizar' : 'Guardar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" /> Añadir Ingreso
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IncomeManager;
