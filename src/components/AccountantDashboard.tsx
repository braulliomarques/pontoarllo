import React from 'react';
import { Users, Clock, Calendar, AlertTriangle, Building, DollarSign, UserX, UserCheck, FileText, TrendingUp } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DashboardMetrics = {
  totalClients: number;
  totalEmployees: number;
  totalOvertime: number;
  totalAbsences: number;
  pendingPayroll: {
    overtime: number;
    deductions: number;
    byClient: Array<{
      name: string;
      overtime: number;
      deductions: number;
    }>;
  };
  recentRecords: Array<{
    id: string;
    employeeName: string;
    clientName: string;
    type: string;
    timestamp: string;
  }>;
};

export function AccountantDashboard() {
  // Obtém o ID do contador do localStorage
  const authData = localStorage.getItem('auth');
  const accountantId = authData ? JSON.parse(authData).userId : null;

  // Busca dados em tempo real
  const { data: clients, loading: loadingClients } = useRealTimeData(
    'clients',
    (client) => client.accountantId === accountantId
  );

  const { data: employees, loading: loadingEmployees } = useRealTimeData(
    'employees',
    (employee) => {
      const employeeClient = clients?.find((client: any) => client.id === employee.clientId);
      return employeeClient?.accountantId === accountantId;
    }
  );

  const { data: timeRecords, loading: loadingRecords } = useRealTimeData(
    'timeRecords',
    (record) => {
      const employee = employees?.find((emp: any) => emp.id === record.employeeId);
      return employee !== undefined;
    }
  );

  const calculateMetrics = (): DashboardMetrics => {
    if (!clients || !employees || !timeRecords) {
      return {
        totalClients: 0,
        totalEmployees: 0,
        totalOvertime: 0,
        totalAbsences: 0,
        pendingPayroll: {
          overtime: 0,
          deductions: 0,
          byClient: []
        },
        recentRecords: []
      };
    }

    // Calcula métricas gerais
    const metrics: DashboardMetrics = {
      totalClients: clients.length,
      totalEmployees: employees.length,
      totalOvertime: timeRecords.reduce((acc: number, record: any) => {
        return acc + (record.overtime || 0);
      }, 0),
      totalAbsences: timeRecords.reduce((acc: number, record: any) => {
        return acc + (record.isAbsent ? 1 : 0);
      }, 0),
      pendingPayroll: {
        overtime: 0,
        deductions: 0,
        byClient: []
      },
      recentRecords: []
    };

    // Calcula dados de folha por cliente
    const payrollByClient = clients.map((client: any) => {
      const clientEmployees = employees.filter((emp: any) => emp.clientId === client.id);
      const clientRecords = timeRecords.filter((record: any) => 
        clientEmployees.some((emp: any) => emp.id === record.employeeId)
      );

      const overtime = clientRecords.reduce((acc: number, record: any) => acc + (record.overtime || 0), 0);
      const deductions = clientRecords.reduce((acc: number, record: any) => acc + (record.deductions || 0), 0);

      return {
        name: client.companyName,
        overtime,
        deductions
      };
    });

    metrics.pendingPayroll = {
      overtime: payrollByClient.reduce((acc, client) => acc + client.overtime, 0),
      deductions: payrollByClient.reduce((acc, client) => acc + client.deductions, 0),
      byClient: payrollByClient
    };

    // Registros recentes
    metrics.recentRecords = timeRecords
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map((record: any) => {
        const employee = employees.find((emp: any) => emp.id === record.employeeId);
        const client = clients.find((c: any) => c.id === employee?.clientId);
        return {
          id: record.id,
          employeeName: employee?.name || 'Funcionário',
          clientName: client?.companyName || 'Empresa',
          type: record.type,
          timestamp: record.timestamp
        };
      });

    return metrics;
  };

  const metrics = calculateMetrics();

  if (loadingClients || loadingEmployees || loadingRecords) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Funcionários</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Horas Extras</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalOvertime}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faltas Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalAbsences}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de dados detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registros recentes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Registros Recentes
          </h3>
          <div className="space-y-4">
            {metrics.recentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
                  <p className="text-xs text-gray-500">{record.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {record.type === 'entry' ? 'Entrada' : 'Saída'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(record.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dados de folha por cliente */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Folha de Pagamento por Cliente
          </h3>
          <div className="space-y-4">
            {metrics.pendingPayroll.byClient.map((client) => (
              <div key={client.name} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-gray-500 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        Horas extras: {client.overtime}h
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                        Descontos: {client.deductions}h
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}