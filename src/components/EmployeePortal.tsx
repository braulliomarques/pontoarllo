import React, { useState } from 'react';
import { Header } from './Header';
import { TimeCard } from './TimeCard';
import { Calendar, Clock, FileText } from 'lucide-react';

export function EmployeePortal() {
  const [currentView, setCurrentView] = useState<'timecard' | 'history' | 'requests'>('timecard');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userRole="employee" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('timecard')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentView === 'timecard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              Registrar Ponto
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentView === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Histórico
            </button>
            <button
              onClick={() => setCurrentView('requests')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentView === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Solicitações
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          {currentView === 'timecard' && <TimeCard />}
          {currentView === 'history' && (
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Pontos</h2>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">Segunda-feira, 12 de Março</p>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Entrada</p>
                            <p className="font-medium">08:00</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Saída Almoço</p>
                            <p className="font-medium">12:00</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Retorno Almoço</p>
                            <p className="font-medium">13:00</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Saída</p>
                            <p className="font-medium">17:00</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          Regular
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentView === 'requests' && (
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitações</h2>
              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Nova Solicitação
                </button>
                <div className="border-t pt-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b pb-4 mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">Ajuste de Ponto</p>
                          <p className="text-sm text-gray-600">10/03/2024</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Motivo: Esquecimento de registro
                          </p>
                        </div>
                        <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                          Pendente
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}