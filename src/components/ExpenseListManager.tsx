
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Trash, Plus, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ResetDataButton from './ResetDataButton';

const ExpenseListManager = () => {
  const { expenseLists, addExpenseList, updateExpenseList, deleteExpenseList } = useFinance();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [listName, setListName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    addExpenseList(listName);
    setListName('');
    setIsAdding(false);
    
    toast({
      title: "Lista creada",
      description: `La lista "${listName}" ha sido creada correctamente`,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId || !listName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    updateExpenseList(editingId, listName);
    setListName('');
    setEditingId(null);
    
    toast({
      title: "Lista actualizada",
      description: `La lista ha sido renombrada a "${listName}" correctamente`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteExpenseList(id);
    toast({
      title: "Lista eliminada",
      description: `La lista "${name}" ha sido eliminada correctamente`,
    });
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setListName(name);
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <ListChecks className="w-5 h-5 mr-2" />
            Listas de Gastos
          </CardTitle>
          <ResetDataButton type="expenseLists" />
        </div>
        <CardDescription>
          Organiza tus gastos en diferentes listas (ejemplo: gastos Argentina, gastos Europa, etc)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Lists */}
          <div className="overflow-x-auto">
            {expenseLists.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pl-1">Nombre de la Lista</th>
                    <th className="text-right py-2">Cantidad de Gastos</th>
                    <th className="text-right py-2 pr-1">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseLists.map((list) => (
                    <tr key={list.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pl-1 font-medium">{list.name}</td>
                      <td className="py-3 text-right">{list.expenses.length}</td>
                      <td className="py-3 text-right pr-1">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => startEdit(list.id, list.name)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(list.id, list.name)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">No hay listas de gastos creadas</p>
                <p className="text-sm text-gray-400 mt-1">Crea una lista para comenzar a registrar tus gastos</p>
              </div>
            )}
          </div>

          {/* Add Form */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Crear Nueva Lista de Gastos</h3>
              <div>
                <Label htmlFor="listName">Nombre de la Lista</Label>
                <Input 
                  id="listName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Gastos Argentina"
                  required
                />
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
              <h3 className="text-lg font-medium mb-4">Editar Lista de Gastos</h3>
              <div>
                <Label htmlFor="editListName">Nombre de la Lista</Label>
                <Input 
                  id="editListName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Gastos Argentina"
                  required
                />
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
            <Plus className="mr-1 h-4 w-4" /> Crear Lista
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExpenseListManager;
