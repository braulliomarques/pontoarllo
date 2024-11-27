import React, { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { sendWelcomeEmail } from '../services/emailService';
import { ref, get, update } from 'firebase/database';
import { db } from '../lib/firebase';

type PasswordRecoveryModalProps = {
  onClose: () => void;
};

export function PasswordRecoveryModal({ onClose }: PasswordRecoveryModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verifica se o email existe em alguma das coleções
      const collections = ['accountants', 'clients', 'employees'];
      let userData = null;
      let userType: 'accountant' | 'client' | 'employee' | null = null;
      let userId = null;

      for (const collection of collections) {
        const dbRef = ref(db, collection);
        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
          const users = snapshot.val();
          const entries = Object.entries(users);
          const [id, user] = entries.find(([_, u]: [string, any]) => u.email === email) || [];
          
          if (user) {
            userData = user;
            userId = id;
            userType = collection.slice(0, -1) as 'accountant' | 'client' | 'employee';
            break;
          }
        }
      }

      if (!userData || !userType || !userId) {
        throw new Error('Email não encontrado');
      }

      // Gera nova senha temporária
      const temporaryPassword = Math.random().toString(36).slice(-8);

      // Atualiza o histórico de senhas no Firebase
      const passwordHistory = userData.passwordHistory || [];
      passwordHistory.push({
        password: temporaryPassword,
        createdAt: new Date().toISOString()
      });

      await update(ref(db, `${userType}s/${userId}`), {
        passwordHistory,
        updatedAt: new Date().toISOString()
      });

      // Envia email com a nova senha
      await sendWelcomeEmail({
        name: userData.name || userData.companyName,
        email: userData.email,
        company: userData.company || userData.companyName,
        temporaryPassword,
        userType
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recuperar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recuperar Senha</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="p-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
              Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email cadastrado
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Email de Recuperação
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}