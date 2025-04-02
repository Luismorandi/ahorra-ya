
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2, Trash, Plus, DollarSign, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ResetDataButton from './ResetDataButton';

const ExpenseManager = () => {
  const { expenseLists, currencies, addExpense, updateExpense, deleteExpense } = useFinance();
  const { toast } = useToast();
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddSubmit = () => {
    if (!selectedListId || !formData.description || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    addExpense(selectedListId, {
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: formData.date,
    });
    
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Gasto añadido",
      description: "El gasto ha sido registrado correctamente",
    });
  };

  const handleEditSubmit = () => {
    if (!selectedListId || !editingId || !formData.description || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    updateExpense(selectedListId, editingId, {
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: formData.date,
    });
    
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Gasto actualizado",
      description: "El gasto ha sido actualizado correctamente",
    });
  };

  const handleDelete = (id: string, description: string) => {
    if (!selectedListId) return;
    
    deleteExpense(selectedListId, id);
    toast({
      title: "Gasto eliminado",
      description: `"${description}" ha sido eliminado correctamente`,
    });
  };

  const startEdit = (expense: any) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      date: expense.date,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
  };

  const getSelectedList = () => {
    return expenseLists.find((list) => list.id === selectedListId);
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const selectedList = getSelectedList();

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Administrar Gastos
          </CardTitle>
          <ResetDataButton type="expenses" />
        </div>
        <CardDescription>
          Registra los gastos en las listas que hayas creado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenseLists.length > 0 ? (
          <div className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="list-select">Selecciona una Lista</Label>
              <Select 
                value={selectedListId}
                onValueChange={setSelectedListId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una lista de gastos" />
                </SelectTrigger>
                <SelectContent>
                  {expenseLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedList ? (
              <>
                {selectedList.expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pl-1">Descripción</th>
                          <th className="text-right py-2">Fecha</th>
                          <th className="text-right py-2">Monto Original</th>
                          <th className="text-right py-2">Equivalente en USD</th>
                          <th className="text-right py-2 pr-1">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedList.expenses.map((expense) => (
                          <tr key={expense.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 pl-1 font-medium">{expense.description}</td>
                            <td className="py-3 text-right">{formatDate(expense.date)}</td>
                            <td className="py-3 text-right">{formatCurrency(expense.amount, expense.currency)}</td>
                            <td className="py-3 text-right">
                              USD {convertToUSD(expense.amount, expense.currency).toFixed(2)}
                            </td>
                            <td className="py-3 text-right pr-1">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => startEdit(expense)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(expense.id, expense.description)}
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
                          <td colSpan={3} className="py-3 pl-1 text-right">Total:</td>
                          <td className="py-3 text-right">
                            USD {selectedList.expenses.reduce((total, expense) => 
                              total + convertToUSD(expense.amount, expense.currency), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No hay gastos registrados en esta lista</p>
                    <p className="text-sm text-gray-400 mt-1">Añade un gasto usando el botón "Añadir Gasto"</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">Selecciona una lista para ver sus gastos</p>
              </div>
            )}
            
            {/* Dialog for adding/editing expenses */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Editar Gasto' : 'Añadir Gasto'}</DialogTitle>
                  <DialogDescription>
                    {editingId 
                      ? 'Modifica los datos del gasto seleccionado' 
                      : 'Completa el formulario para registrar un nuevo gasto'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="expense-description">Descripción</Label>
                      <Input
                        id="expense-description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Alquiler, Comida, Transporte, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expense-amount">Monto</Label>
                        <Input
                          id="expense-amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          placeholder="100.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expense-currency">Moneda</Label>
                        <Select 
                          value={formData.currency}
                          onValueChange={(value) => setFormData({...formData, currency: value})}
                        >
                          <SelectTrigger id="expense-currency">
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
                    <div>
                      <Label htmlFor="expense-date">Fecha</Label>
                      <Input
                        id="expense-date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
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
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <p className="text-gray-500">No hay listas de gastos disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Crea una lista de gastos primero para poder registrar tus gastos</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {selectedListId && (
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="flex items-center"
            disabled={!selectedListId}
          >
            <Plus className="mr-1 h-4 w-4" /> Añadir Gasto
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExpenseManager;
