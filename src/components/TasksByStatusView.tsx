import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Search, Users } from 'lucide-react';
import { Person, Task, TaskStatus, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/types';
import { PersonCardFiltered } from './PersonCardFiltered';

interface TasksByStatusViewProps {
  people: Person[];
  selectedStatus: TaskStatus;
  onUpdatePerson: (person: Person) => void;
  onGoBack: () => void;
}

interface TaskWithOwner extends Task {
  ownerName: string;
  ownerId: string;
}

export function TasksByStatusView({ people, selectedStatus, onUpdatePerson, onGoBack }: TasksByStatusViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'tasks' | 'people'>('tasks');

  // Get all tasks with the selected status and include owner information
  const tasksWithOwners: TaskWithOwner[] = [];
  
  people.forEach(person => {
    person.tasks
      .filter(task => task.status === selectedStatus)
      .forEach(task => {
        tasksWithOwners.push({
          ...task,
          ownerName: person.name,
          ownerId: person.id
        });
      });
  });

  // Sort tasks by creation date (newest first)
  const sortedTasks = tasksWithOwners.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter people for search
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateTaskStatus = (taskId: string, ownerId: string, newStatus: TaskStatus) => {
    const owner = people.find(person => person.id === ownerId);
    if (owner) {
      const updatedTasks = owner.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      onUpdatePerson({ ...owner, tasks: updatedTasks });
    }
  };

  const handleDeleteTask = (taskId: string, ownerId: string) => {
    const owner = people.find(person => person.id === ownerId);
    if (owner) {
      const updatedTasks = owner.tasks.filter(task => task.id !== taskId);
      onUpdatePerson({ ...owner, tasks: updatedTasks });
    }
  };

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
    switch (currentStatus) {
      case 'por-empezar': return 'en-proceso';
      case 'en-proceso': return 'terminada';
      case 'terminada': return 'por-empezar';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tareas: {TASK_STATUS_LABELS[selectedStatus]}
            </h1>
            <p className="text-gray-600">
              {sortedTasks.length} tarea{sortedTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tasks List */}
        {sortedTasks.length > 0 ? (
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <Card key={`${task.ownerId}-${task.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{task.ownerName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        className={`cursor-pointer ${TASK_STATUS_COLORS[task.status]}`}
                        onClick={() => handleUpdateTaskStatus(task.id, task.ownerId, getNextStatus(task.status))}
                      >
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTask(task.id, task.ownerId)}
                      >
                        Eliminar
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
              No hay tareas con estado "{TASK_STATUS_LABELS[selectedStatus]}"
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Las tareas aparecerán aquí cuando cambies su estado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}