import React, { useState } from 'react';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AccountantDashboard } from './components/AccountantDashboard';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeePortal } from './components/EmployeePortal';
import { Plans } from './components/Plans';
import { Billing } from './components/Billing';
import { AccountantList } from './components/AccountantList';
import { AccountantForm } from './components/AccountantForm';
import { ClientList } from './components/ClientList';
import { ClientForm } from './components/ClientForm';
import { AccountantRequests } from './components/AccountantRequests';
import { ClientNotifications } from './components/ClientNotifications';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'provider' | 'accountant' | 'admin' | 'employee' | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login
          onLogin={(role) => {
            setIsAuthenticated(true);
            setUserRole(role);
          }}
        />
        <Plans />
      </>
    );
  }

  if (userRole === 'employee') {
    return <EmployeePortal />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userRole={userRole} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            
            {userRole === 'provider' && (
              <>
                <button
                  onClick={() => setCurrentView('accountants')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'accountants'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Contadores
                </button>
                <button
                  onClick={() => setCurrentView('new-accountant')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'new-accountant'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Novo Contador
                </button>
              </>
            )}

            {userRole === 'accountant' && (
              <>
                <button
                  onClick={() => setCurrentView('clients')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'clients'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Clientes
                </button>
                <button
                  onClick={() => setCurrentView('new-client')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'new-client'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Novo Cliente
                </button>
                <button
                  onClick={() => setCurrentView('requests')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'requests'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Solicitações
                </button>
              </>
            )}

            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentView('employees')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'employees'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Colaboradores
                </button>
                <button
                  onClick={() => setCurrentView('new-employee')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'new-employee'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Novo Colaborador
                </button>
                <button
                  onClick={() => setCurrentView('notifications')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'notifications'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Notificações
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentView('billing')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'billing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Faturamento
            </button>
          </div>
        </div>

        {currentView === 'dashboard' && userRole === 'provider' && <Dashboard userRole={userRole} />}
        {currentView === 'dashboard' && userRole === 'accountant' && <AccountantDashboard />}
        {currentView === 'accountants' && <AccountantList />}
        {currentView === 'new-accountant' && <AccountantForm />}
        {currentView === 'clients' && <ClientList />}
        {currentView === 'new-client' && <ClientForm />}
        {currentView === 'employees' && <EmployeeList />}
        {currentView === 'new-employee' && <EmployeeForm />}
        {currentView === 'billing' && <Billing />}
        {currentView === 'requests' && <AccountantRequests />}
        {currentView === 'notifications' && <ClientNotifications />}
      </main>
    </div>
  );
}