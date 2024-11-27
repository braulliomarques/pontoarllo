import { useState, useEffect } from 'react';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../lib/firebase';

type UserRole = 'provider' | 'accountant' | 'admin' | 'employee' | null;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLatestPassword = (passwordHistory: any[]) => {
    if (!passwordHistory || passwordHistory.length === 0) return null;
    return passwordHistory.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0].password;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Provider login
      if (email === 'braullio@arllo.io' && password === '@Arllo.io9314') {
        const authData = {
          isAuthenticated: true,
          userRole: 'provider' as UserRole,
          userId: 'provider-1'
        };
        
        setIsAuthenticated(true);
        setUserRole('provider');
        setUserId('provider-1');
        localStorage.setItem('auth', JSON.stringify(authData));
        return true;
      }

      // Accountant login
      const accountantsRef = ref(db, 'accountants');
      const accountantsSnapshot = await get(accountantsRef);
      
      if (accountantsSnapshot.exists()) {
        const accountants = accountantsSnapshot.val();
        const accountant = Object.values(accountants).find((acc: any) => {
          const latestPassword = getLatestPassword(acc.passwordHistory);
          return acc.email === email && latestPassword === password;
        });
        
        if (accountant) {
          const authData = {
            isAuthenticated: true,
            userRole: 'accountant' as UserRole,
            userId: accountant.id,
            userData: accountant
          };
          
          setIsAuthenticated(true);
          setUserRole('accountant');
          setUserId(accountant.id);
          localStorage.setItem('auth', JSON.stringify(authData));
          return true;
        }
      }

      // Client login
      const clientsRef = ref(db, 'clients');
      const clientsSnapshot = await get(clientsRef);
      
      if (clientsSnapshot.exists()) {
        const clients = clientsSnapshot.val();
        const client = Object.values(clients).find((c: any) => {
          const latestPassword = getLatestPassword(c.passwordHistory);
          return c.email === email && latestPassword === password;
        });
        
        if (client) {
          const authData = {
            isAuthenticated: true,
            userRole: 'admin' as UserRole,
            userId: client.id,
            userData: client
          };
          
          setIsAuthenticated(true);
          setUserRole('admin');
          setUserId(client.id);
          localStorage.setItem('auth', JSON.stringify(authData));
          return true;
        }
      }

      // Employee login
      const employeesRef = ref(db, 'employees');
      const employeesSnapshot = await get(employeesRef);
      
      if (employeesSnapshot.exists()) {
        const employees = employeesSnapshot.val();
        const employee = Object.values(employees).find((emp: any) => {
          const latestPassword = getLatestPassword(emp.passwordHistory);
          return emp.email === email && latestPassword === password;
        });
        
        if (employee) {
          const authData = {
            isAuthenticated: true,
            userRole: 'employee' as UserRole,
            userId: employee.id,
            userData: employee
          };
          
          setIsAuthenticated(true);
          setUserRole('employee');
          setUserId(employee.id);
          localStorage.setItem('auth', JSON.stringify(authData));
          return true;
        }
      }

      setError('Email ou senha inválidos');
      return false;
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      setError('Erro ao realizar login. Por favor, tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem('auth');
  };

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { isAuthenticated: storedAuth, userRole: storedRole, userId: storedId } = JSON.parse(authData);
      setIsAuthenticated(storedAuth);
      setUserRole(storedRole);
      setUserId(storedId);
    }
    setLoading(false);
  }, []);
  
  return {
    isAuthenticated,
    userRole,
    userId,
    loading,
    error,
    login,
    logout
  };
}