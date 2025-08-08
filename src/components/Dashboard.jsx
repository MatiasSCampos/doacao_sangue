import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, LogOut, Heart, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoacao, setEditingDoacao] = useState(null);
  const [formData, setFormData] = useState({
    dataDoacao: '',
    volume: '',
    tipoSanguineo: '',
    pessoaEmail: '',
    senha: 'senha123'
  });

  useEffect(() => {
    fetchDoacoes();
  }, []);

  const fetchDoacoes = async () => {
    try {
      const response = await fetch('http://localhost:3000/doacao', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar doações');
      }

      const data = await response.json();
      setDoacoes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingDoacao 
        ? `http://localhost:3000/doacao/${editingDoacao.id}`
        : 'http://localhost:3000/doacao';
      
      const method = editingDoacao ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          volume: parseFloat(formData.volume),
          dataDoacao: new Date(formData.dataDoacao).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar doação');
      }

      await fetchDoacoes();
      setIsDialogOpen(false);
      setEditingDoacao(null);
      setFormData({
        dataDoacao: '',
        volume: '',
        tipoSanguineo: '',
        pessoaEmail: '',
        senha: 'senha123'
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doacao) => {
    setEditingDoacao(doacao);
    setFormData({
      dataDoacao: new Date(doacao.dataDoacao).toISOString().split('T')[0],
      volume: doacao.volume.toString(),
      tipoSanguineo: doacao.tipoSanguineo,
      pessoaEmail: doacao.pessoaEmail,
      senha: 'senha123'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta doação?')) return;

    try {
      const response = await fetch(`http://localhost:3000/doacao/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir doação');
      }

      await fetchDoacoes();
    } catch (error) {
      setError(error.message);
    }
  };

  const openNewDialog = () => {
    setEditingDoacao(null);
    setFormData({
      dataDoacao: '',
      volume: '',
      tipoSanguineo: '',
      pessoaEmail: '',
      senha: 'senha123'
    });
    setIsDialogOpen(true);
  };

  if (loading && doacoes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Doação de Sangue
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {user?.nome}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gerenciar Doações</CardTitle>
                  <CardDescription>
                    Visualize, adicione, edite e remova doações de sangue
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openNewDialog} className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Doação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingDoacao ? 'Editar Doação' : 'Nova Doação'}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha os dados da doação de sangue
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataDoacao">Data da Doação</Label>
                        <Input
                          id="dataDoacao"
                          type="date"
                          value={formData.dataDoacao}
                          onChange={(e) => setFormData({...formData, dataDoacao: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="volume">Volume (ml)</Label>
                        <Input
                          id="volume"
                          type="number"
                          step="0.1"
                          placeholder="450.0"
                          value={formData.volume}
                          onChange={(e) => setFormData({...formData, volume: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                        <Input
                          id="tipoSanguineo"
                          placeholder="A+, B-, O+, etc."
                          value={formData.tipoSanguineo}
                          onChange={(e) => setFormData({...formData, tipoSanguineo: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pessoaEmail">Email da Pessoa</Label>
                        <Input
                          id="pessoaEmail"
                          type="email"
                          placeholder="pessoa@email.com"
                          value={formData.pessoaEmail}
                          onChange={(e) => setFormData({...formData, pessoaEmail: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-red-600 hover:bg-red-700"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            editingDoacao ? 'Atualizar' : 'Criar'
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Tipo Sanguíneo</TableHead>
                    <TableHead>Doador</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doacoes.map((doacao) => (
                    <TableRow key={doacao.id}>
                      <TableCell>{doacao.id}</TableCell>
                      <TableCell>
                        {new Date(doacao.dataDoacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{doacao.volume} ml</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doacao.tipoSanguineo}</Badge>
                      </TableCell>
                      <TableCell>
                        {doacao.pessoa?.nome || doacao.pessoaEmail}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(doacao)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doacao.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {doacoes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma doação encontrada. Clique em "Nova Doação" para adicionar.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

