import React from 'react';
import { Bell, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

type Notification = {
  id: number;
  type: 'request' | 'reminder' | 'alert';
  title: string;
  description: string;
  deadline?: string;
  status: 'unread' | 'read';
  createdAt: string;
};

export function ClientNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 1,
      type: 'request',
      title: 'Nova solicitação do contador',
      description: 'Documentos Admissionais - João Silva',
      deadline: '2024-03-20',
      status: 'unread',
      createdAt: '2024-03-15',
    },
    // More notifications...
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, status: 'read' } : notif
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {notifications.filter((n) => n.status === 'unread').length} não lidas
        </span>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 ${
              notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-blue-100 mr-4">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  {notification.deadline && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Prazo: {new Date(notification.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Marcar como concluído"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Rejeitar"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}