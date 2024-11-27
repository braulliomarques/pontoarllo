import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PasswordRecoveryModal } from './PasswordRecoveryModal';

type LoginProps = {
  onLogin: (role: 'provider' | 'accountant' | 'admin' | 'employee') => void;
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { login, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const { userRole } = JSON.parse(authData);
          onLogin(userRole);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Ponto Eletrônico</h2>
          <p className="text-gray-600 mt-2">Sistema Multi-tenant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          {authError && (
            <div className="text-red-500 text-sm text-center">{authError}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowRecovery(true)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Para acessar o sistema, solicite suas credenciais ao:</p>
            <p>Fornecedor (se você é contador)</p>
            <p>Contador (se você é empresa)</p>
            <p>Admin da empresa (se você é funcionário)</p>
          </div>
        </form>
      </div>

      {showRecovery && (
        <PasswordRecoveryModal onClose={() => setShowRecovery(false)} />
      )}
    </div>
  );
}