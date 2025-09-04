import { Card, CardContent } from '@/components/ui/card';
import { Person, TaskStatus, TASK_STATUS_LABELS } from '@/types';

interface TaskStatsProps {
  people: Person[];
  onStatusClick?: (status: TaskStatus) => void;
}

export function TaskStats({ people, onStatusClick }: TaskStatsProps) {
  const totalTasks = people.reduce((sum, person) => sum + person.tasks.length, 0);
  
  const tasksByStatus = people.reduce((acc, person) => {
    person.tasks.forEach(task => {
      acc[task.status] = (acc[task.status] || 0) + 1;
    });
    return acc;
  }, {} as Record<TaskStatus, number>);

  const stats = [
    { 
      status: 'por-empezar' as TaskStatus,
      label: TASK_STATUS_LABELS['por-empezar'], 
      count: tasksByStatus['por-empezar'] || 0,
      color: 'text-gray-600'
    },
    { 
      status: 'en-proceso' as TaskStatus,
      label: TASK_STATUS_LABELS['en-proceso'], 
      count: tasksByStatus['en-proceso'] || 0,
      color: 'text-yellow-600'
    },
    { 
      status: 'terminada' as TaskStatus,
      label: TASK_STATUS_LABELS['terminada'], 
      count: tasksByStatus['terminada'] || 0,
      color: 'text-green-600'
    }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{people.length}</div>
            <div className="text-sm text-muted-foreground">Personas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-sm text-muted-foreground">Tareas totales</div>
          </div>
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className={onStatusClick ? 'cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors' : ''}
              onClick={() => onStatusClick && onStatusClick(stat.status)}
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              {onStatusClick && stat.count > 0 && (
                <div className="text-xs text-blue-600 mt-1">Ver todas</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}