import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, User, Calendar, Trash2 } from 'lucide-react';
import { Person, Task, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/types';

interface CompletedTasksHistoryProps {
  people: Person[];
  onUpdatePerson: (person: Person) => void;
  onGoBack: () => void;
}

interface CompletedTaskWithOwner extends Task {
  ownerName: string;
  ownerId: string;
}

export function CompletedTasksHistory({ people, onUpdatePerson, onGoBack }: CompletedTasksHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Get all completed tasks with owner information
  const completedTasksWithOwners: CompletedTaskWithOwner[] = [];
  
  people.forEach(person => {
    person.tasks
      .filter(task => task.status === 'terminada')
      .forEach(task => {
        completedTasksWithOwners.push({
          ...task,
          ownerName: person.name,
          ownerId: person.id
        });
      });
  });

  // Sort tasks by completion date (newest first)
  const sortedCompletedTasks = completedTasksWithOwners.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter tasks based on search term and selected person
  const filteredTasks = sortedCompletedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPerson = !selectedPerson || task.ownerId === selectedPerson;
    return matchesSearch && matchesPerson;
  });

  // Get people with completed tasks for the filter
  const peopleWithCompletedTasks = people.filter(person => 
    person.tasks.some(task => task.status === 'terminada')
  );

  // Statistics
  const totalCompletedTasks = completedTasksWithOwners.length;
  const tasksByPerson = people.map(person => ({
    name: person.name,
    id: person.id,
    completedCount: person.tasks.filter(task => task.status === 'terminada').length
  })).filter(p => p.completedCount > 0).sort((a, b) => b.completedCount - a.completedCount);

  const handleDeleteCompletedTask = (taskId: string, ownerId: string) => {
    const owner = people.find(person => person.id === ownerId);
    if (owner) {
      const updatedTasks = owner.tasks.filter(task => task.id !== taskId);
      onUpdatePerson({ ...owner, tasks: updatedTasks });
    }
  };

  const handleRestoreTask = (taskId: string, ownerId: string) => {
    const owner = people.find(person => person.id === ownerId);
    if (owner) {
      const updatedTasks = owner.tasks.map(task =>
        task.id === taskId ? { ...task, status: 'por-empezar' as const } : task
      );
      onUpdatePerson({ ...owner, tasks: updatedTasks });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              📋 Historial de Tareas Finalizadas
            </h1>
            <p className="text-gray-600">
              {totalCompletedTasks} tarea{totalCompletedTasks !== 1 ? 's' : ''} completada{totalCompletedTasks !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {tasksByPerson.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasksByPerson.map((person) => (
              <Card 
                key={person.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPerson === person.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedPerson(selectedPerson === person.id ? null : person.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm truncate">{person.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {person.completedCount}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar tareas o personas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedPerson && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedPerson(null)}
              className="whitespace-nowrap"
            >
              Mostrar todas las personas
            </Button>
          )}
        </div>

        {/* Completed Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={`${task.ownerId}-${task.id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{task.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Completada: {formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={TASK_STATUS_COLORS[task.status]}>
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreTask(task.id, task.ownerId)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Restaurar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCompletedTask(task.id, task.ownerId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {totalCompletedTasks === 0 
                ? 'No hay tareas completadas aún' 
                : searchTerm || selectedPerson
                ? 'No se encontraron tareas que coincidan con los filtros'
                : 'No hay tareas completadas'
              }
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {totalCompletedTasks === 0 
                ? 'Las tareas aparecerán aquí cuando las marques como terminadas'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}