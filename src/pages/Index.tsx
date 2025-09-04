import { useState } from 'react';
import { Person, TaskStatus, MAX_PEOPLE } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useStationsData } from '@/hooks/useStationsData';
import { PersonCard } from '@/components/PersonCard';
import { AddPersonDialog } from '@/components/AddPersonDialog';
import { TaskStats } from '@/components/TaskStats';
import { TasksByStatusView } from '@/components/TasksByStatusView';
import { CompletedTasksHistory } from '@/components/CompletedTasksHistory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, History } from 'lucide-react';

export default function Index() {
  const [people, setPeople] = useLocalStorage<Person[]>('task-manager-people', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [showCompletedHistory, setShowCompletedHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 stations per page

  // Initialize stations data on first load
  useStationsData(people, setPeople);

  // Pagination and search logic
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPeople = filteredPeople.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAddPerson = (newPerson: Person) => {
    setPeople([...people, newPerson]);
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    setPeople(people.map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    ));
  };

  const handleDeletePerson = (personId: string) => {
    setPeople(people.filter(person => person.id !== personId));
  };

  const handleStatusClick = (status: TaskStatus) => {
    setSelectedStatus(status);
  };

  const handleGoBack = () => {
    setSelectedStatus(null);
  };

  // If a status is selected, show the TasksByStatusView
  if (selectedStatus) {
    return (
      <TasksByStatusView
        people={people}
        selectedStatus={selectedStatus}
        onUpdatePerson={handleUpdatePerson}
        onGoBack={handleGoBack}
      />
    );
  }

  // If history is selected, show the CompletedTasksHistory
  if (showCompletedHistory) {
    return (
      <CompletedTasksHistory
        people={people}
        onUpdatePerson={handleUpdatePerson}
        onGoBack={() => setShowCompletedHistory(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestión de Estaciones</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowCompletedHistory(true)}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Historial
            </Button>
          </div>
          <p className="text-gray-600">
            Gestión de tareas para estaciones de agua y saneamiento
          </p>
        </div>

        {/* Stats */}
        <TaskStats people={people} onStatusClick={handleStatusClick} />

        {/* Add Person Button */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <AddPersonDialog 
              onAddPerson={handleAddPerson}
              disabled={people.length >= MAX_PEOPLE}
            />
          </div>
        </div>

        {/* Search */}
        {people.length > 0 && (
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar estaciones..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Results summary and pagination info */}
        {people.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPeople.length)} de {filteredPeople.length} estaciones
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  (filtrado por "{searchTerm}")
                </span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        )}

        {/* People Grid */}
        {filteredPeople.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onUpdatePerson={handleUpdatePerson}
                  onDeletePerson={handleDeletePerson}
                />
              ))}
            </div>

            {/* Bottom pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    Primera
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Última
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : people.length > 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No se encontraron estaciones que coincidan con "{searchTerm}"
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-gray-500 text-lg">
              Cargando estaciones del sistema...
            </div>
            <div className="text-sm text-gray-400">
              Se están inicializando todas las estaciones de agua y saneamiento
            </div>
          </div>
        )}
      </div>
    </div>
  );
}