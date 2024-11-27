import React from 'react';
import { Users, Clock, Calendar, AlertTriangle, Building, DollarSign, UserX, UserCheck, FileText, TrendingUp } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';

type DashboardProps = {
  userRole: 'provider' | 'accountant' | 'admin' | 'employee' | null;
};

export function Dashboard({ userRole }: DashboardProps) {
  const { data: accountants, loading: loadingAccountants } = useRealTimeData('accountants');
  const { data: clients, loading: loadingClients } = useRealTimeData('clients');
  const { data: employees, loading: loadingEmployees } = useRealTimeData('employees');

  if (userRole === 'provider') {
    if (loadingAccountants || loadingClients || loadingEmployees) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const totalAccountants = accountants?.length || 0;
    const totalClients = clients?.length || 0;
    const totalEmployees = employees?.length || 0;
    const activeAccountants = accountants?.filter((acc: any) => acc.status === 'active')?.length || 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contadores</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAccountants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-semibold text-gray-900">{totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contadores Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">{activeAccountants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Funcionários</p>
                <p className="text-2xl font-semibold text-gray-900">{totalEmployees}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contadores Recentes</h3>
            <div className="space-y-4">
              {accountants?.slice(0, 5).map((accountant: any) => (
                <div key={accountant.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{accountant.company}</p>
                      <p className="text-xs text-gray-500">{accountant.name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    accountant.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {accountant.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas por Contador</h3>
            <div className="space-y-4">
              {accountants?.slice(0, 5).map((accountant: any) => {
                const accountantClients = clients?.filter((client: any) => 
                  client.accountantId === accountant.id
                )?.length || 0;
                
                const accountantEmployees = employees?.filter((employee: any) => {
                  const employeeClient = clients?.find((client: any) => 
                    client.id === employee.clientId
                  );
                  return employeeClient?.accountantId === accountant.id;
                })?.length || 0;

                return (
                  <div key={accountant.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{accountant.company}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {accountantClients} clientes
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {accountantEmployees} funcionários
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Other dashboard views remain the same...
  return null;
}