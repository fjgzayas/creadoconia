import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { Person, Task, TaskStatus, TASK_STATUS_LABELS, TASK_STATUS_COLORS, MAX_TASKS_PER_PERSON } from '@/types';

interface PersonCardProps {
  person: Person;
  onUpdatePerson: (person: Person) => void;
  onDeletePerson: (personId: string) => void;
}

export function PersonCard({ person, onUpdatePerson, onDeletePerson }: PersonCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(person.name);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Filter out completed tasks from personal cards - they should only appear in the history
  const activeTasks = person.tasks.filter(task => task.status !== 'terminada');
  
  const sortedTasks = [...activeTasks].sort((a, b) => {
    const order = { 'por-empezar': 0, 'en-proceso': 1, 'terminada': 2 };
    return order[a.status] - order[b.status];
  });

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdatePerson({ ...person, name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() && person.tasks.length < MAX_TASKS_PER_PERSON) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        status: 'por-empezar',
        createdAt: new Date()
      };
      onUpdatePerson({
        ...person,
        tasks: [...person.tasks, newTask]
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = person.tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    onUpdatePerson({ ...person, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = person.tasks.filter(task => task.id !== taskId);
    onUpdatePerson({ ...person, tasks: updatedTasks });
  };

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
    switch (currentStatus) {
      case 'por-empezar': return 'en-proceso';
      case 'en-proceso': return 'terminada';
      case 'terminada': return 'por-empezar';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1"
                maxLength={50}
              />
              <Button size="sm" onClick={handleSaveName}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <CardTitle className="text-lg truncate">{person.name}</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeletePerson(person.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {activeTasks.length}/{MAX_TASKS_PER_PERSON} tareas activas
          {person.tasks.filter(t => t.status === 'terminada').length > 0 && (
            <span className="ml-2 text-green-600">
              (+{person.tasks.filter(t => t.status === 'terminada').length} completadas)
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between gap-2 p-2 rounded-lg border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{task.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`cursor-pointer text-xs ${TASK_STATUS_COLORS[task.status]}`}
                onClick={() => handleUpdateTaskStatus(task.id, getNextStatus(task.status))}
              >
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {sortedTasks.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            {person.tasks.filter(t => t.status === 'terminada').length > 0 
              ? 'Todas las tareas están completadas' 
              : 'No hay tareas asignadas'
            }
          </div>
        )}

        {isAddingTask ? (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Título de la tarea"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
              maxLength={100}
            />
            <Button size="sm" onClick={handleAddTask}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAddingTask(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsAddingTask(true)}
            disabled={person.tasks.length >= MAX_TASKS_PER_PERSON}
          >
            <Plus className="h-4 w-4 mr-2" />
            {person.tasks.length >= MAX_TASKS_PER_PERSON ? 'Máximo de tareas alcanzado' : 'Agregar tarea'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}