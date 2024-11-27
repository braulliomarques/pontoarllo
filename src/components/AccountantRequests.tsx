import React, { useState } from 'react';
import { Send, Clock, FileText, AlertCircle } from 'lucide-react';

type Request = {
  id: number;
  clientId: number;
  clientName: string;
  type: 'document' | 'information' | 'approval';
  subject: string;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  deadline: string;
  createdAt: string;
};

export function AccountantRequests() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      clientId: 1,
      clientName: 'Empresa ABC',
      type: 'document',
      subject: 'Documentos Admissionais',
      description: 'Necessário enviar documentos do novo funcionário João Silva',
      status: 'pending',
      deadline: '2024-03-20',
      createdAt: '2024-03-15',
    },
    // More mock data...
  ]);

  const [newRequest, setNewRequest] = useState({
    clientId: '',
    type: 'document',
    subject: '',
    description: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for sending request
    console.log('New request:', newRequest);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nova Solicitação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={newRequest.clientId}
                onChange={(e) => setNewRequest({ ...newRequest, clientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione um cliente...</option>
                <option value="1">Empresa ABC</option>
                <option value="2">Comércio XYZ</option>
                <option value="3">Indústria 123</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Solicitação
              </label>
              <select
                value={newRequest.type}
                onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="document">Documentos</option>
                <option value="information">Informações</option>
                <option value="approval">Aprovação</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assunto
              </label>
              <input
                type="text"
                value={newRequest.subject}
                onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo
              </label>
              <input
                type="date"
                value={newRequest.deadline}
                onChange={(e) => setNewRequest({ ...newRequest, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar Solicitação
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitações Enviadas</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{request.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Prazo: {new Date(request.deadline).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {request.clientName}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : request.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {request.status === 'completed'
                    ? 'Concluído'
                    : request.status === 'rejected'
                    ? 'Rejeitado'
                    : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}