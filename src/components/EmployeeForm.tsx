import React, { useState } from 'react';
import { User, Mail, Phone, Building, Calendar } from 'lucide-react';
import { GeofenceMap } from './GeofenceMap';
import { createEmployee } from '../services/api';

export function EmployeeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    startDate: '',
    role: '',
    document: '',
    geofence: {
      enabled: false,
      center: [-23.5505, -46.6333] as [number, number],
      radius: 100
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get clientId from current user context/session
      const clientId = 'current-client-id'; // This should come from auth context
      await createEmployee(formData, clientId);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        startDate: '',
        role: '',
        document: '',
        geofence: {
          enabled: false,
          center: [-23.5505, -46.6333],
          radius: 100
        }
      });
    } catch (err) {
      setError('Erro ao cadastrar funcionário. Tente novamente.');
      console.error('Error creating employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeofenceChange = (center: [number, number], radius: number) => {
    setFormData({
      ...formData,
      geofence: { ...formData.geofence, center, radius }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Colaborador</h2>

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
          Funcionário cadastrado com sucesso!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione...</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Admissão
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Restrição de Área para Registro de Ponto
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="geofenceEnabled"
                  checked={formData.geofence.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    geofence: { ...formData.geofence, enabled: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="geofenceEnabled" className="ml-2 text-sm text-gray-600">
                  Habilitar restrição de área
                </label>
              </div>
            </div>

            {formData.geofence.enabled && (
              <div className="space-y-4">
                <GeofenceMap
                  center={formData.geofence.center}
                  radius={formData.geofence.radius}
                  onGeofenceChange={handleGeofenceChange}
                />
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm text-gray-600">Raio (metros)</label>
                    <input
                      type="number"
                      value={formData.geofence.radius}
                      onChange={(e) => handleGeofenceChange(
                        formData.geofence.center,
                        parseInt(e.target.value)
                      )}
                      className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      min="50"
                      max="1000"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Clique no mapa para definir o centro da área permitida. 
                      Ajuste o raio para determinar a distância máxima permitida para registro de ponto.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
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
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}