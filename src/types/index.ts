export type TaskStatus = 'por-empezar' | 'en-proceso' | 'terminada';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
}

export interface Person {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: Date;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  'por-empezar': 'Por empezar',
  'en-proceso': 'En proceso',
  'terminada': 'Terminada'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  'por-empezar': 'bg-gray-100 text-gray-800 border-gray-200',
  'en-proceso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'terminada': 'bg-green-100 text-green-800 border-green-200'
};

export const MAX_PEOPLE = 200;
export const MAX_TASKS_PER_PERSON = 5;