import React, { useState } from 'react';
import { X, Building, Mail, Phone, CreditCard, Send } from 'lucide-react';
import { sendWelcomeEmail } from '../services/emailService';
import { GeofenceMap } from './GeofenceMap';

type ClientEditModalProps = {
  client: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
};

export function ClientEditModal({ client, onClose, onSave }: ClientEditModalProps) {
  const [formData, setFormData] = useState({
    companyName: client.companyName || '',
    email: client.email || '',
    phone: client.phone || '',
    address: client.address || '',
    cnpj: client.cnpj || '',
    employeeCount: client.employeeCount || '',
    geofence: client.geofence || {
      center: [-23.5505, -46.6333] as [number, number],
      radius: 100
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendWelcomeEmail({
        name: formData.companyName,
        email: formData.email,
        company: formData.companyName,
        temporaryPassword: Math.random().toString(36).slice(-8),
        userType: 'client'
      });
      setSuccess('Email de boas-vindas reenviado com sucesso!');
    } catch (err) {
      setError('Erro ao reenviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeofenceChange = (center: [number, number], radius: number) => {
    setFormData({
      ...formData,
      geofence: { center, radius }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Editar Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campos do formulário permanecem os mesmos */}
            {/* ... */}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área Permitida para Registro de Ponto
            </label>
            <GeofenceMap
              center={formData.geofence.center}
              radius={formData.geofence.radius}
              onGeofenceChange={handleGeofenceChange}
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={handleResendEmail}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              disabled={loading}
            >
              <Send className="h-5 w-5 mr-2" />
              {loading ? 'Enviando...' : 'Reenviar Email de Boas-vindas'}
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}