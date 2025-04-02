
import React, { useState } from 'react';
import { useFinance, Currency } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Trash, Plus, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CurrencyManager = () => {
  const { currencies, addCurrency, updateCurrency, deleteCurrency } = useFinance();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Currency, 'id'>>({
    code: '',
    name: '',
    conversionRate: 1,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || formData.conversionRate <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    addCurrency(formData);
    setFormData({ code: '', name: '', conversionRate: 1 });
    setIsAdding(false);
    
    toast({
      title: "Moneda añadida",
      description: `${formData.name} (${formData.code}) ha sido añadido correctamente`,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId || !formData.code || !formData.name || formData.conversionRate <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    updateCurrency(editingId, formData);
    setFormData({ code: '', name: '', conversionRate: 1 });
    setEditingId(null);
    
    toast({
      title: "Moneda actualizada",
      description: `${formData.name} (${formData.code}) ha sido actualizada correctamente`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteCurrency(id);
    toast({
      title: "Moneda eliminada",
      description: `${name} ha sido eliminada correctamente`,
    });
  };

  const startEdit = (currency: Currency) => {
    setEditingId(currency.id);
    setFormData({
      code: currency.code,
      name: currency.name,
      conversionRate: currency.conversionRate,
    });
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Administrar Monedas
        </CardTitle>
        <CardDescription>
          Configura las monedas y sus tasas de conversión a USD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Currency List */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pl-1">Código</th>
                  <th className="text-left py-2">Nombre</th>
                  <th className="text-right py-2">Tasa de Conversión a USD</th>
                  <th className="text-right py-2 pr-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => (
                  <tr key={currency.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 pl-1 font-medium">{currency.code}</td>
                    <td className="py-3">{currency.name}</td>
                    <td className="py-3 text-right">
                      {currency.conversionRate.toFixed(6)}
                    </td>
                    <td className="py-3 text-right pr-1">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => startEdit(currency)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(currency.id, currency.name)}
                          disabled={currency.code === 'USD'} // Prevent deleting USD
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Form */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Añadir Nueva Moneda</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="code">Código</Label>
                  <Input 
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="USD"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="US Dollar"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Tasa de Conversión a USD</Label>
                  <Input 
                    id="rate"
                    type="number"
                    step="0.000001"
                    value={formData.conversionRate}
                    onChange={(e) => setFormData({...formData, conversionRate: parseFloat(e.target.value)})}
                    placeholder="1.0"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          )}

          {/* Edit Form */}
          {editingId && (
            <form onSubmit={handleEditSubmit} className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Editar Moneda</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-code">Código</Label>
                  <Input 
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="USD"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input 
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="US Dollar"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rate">Tasa de Conversión a USD</Label>
                  <Input 
                    id="edit-rate"
                    type="number"
                    step="0.000001"
                    value={formData.conversionRate}
                    onChange={(e) => setFormData({...formData, conversionRate: parseFloat(e.target.value)})}
                    placeholder="1.0"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Actualizar
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isAdding && !editingId && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Añadir Moneda
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CurrencyManager;
