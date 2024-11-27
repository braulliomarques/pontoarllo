import { ref, set, get, update, remove, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { sendWelcomeEmail } from './emailService';
import { sendWelcomeWhatsApp } from './whatsappService';

function generateTemporaryPassword() {
  return Math.random().toString(36).slice(-8);
}

export const createAccountant = async (accountantData: any) => {
  const id = uuidv4();
  const temporaryPassword = generateTemporaryPassword();

  const accountantWithMetadata = {
    ...accountantData,
    id,
    status: 'active',
    passwordHistory: [{
      password: temporaryPassword,
      createdAt: new Date().toISOString()
    }],
    clientCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await set(ref(db, `accountants/${id}`), accountantWithMetadata);
    
    try {
      await sendWelcomeEmail({
        name: accountantData.name,
        email: accountantData.email,
        company: accountantData.company,
        temporaryPassword,
        userType: 'accountant'
      });
    } catch (emailError) {
      console.warn('Erro ao enviar email:', emailError);
    }

    try {
      await sendWelcomeWhatsApp({
        phone: accountantData.phone,
        userType: 'contador',
        name: accountantData.name
      });
    } catch (whatsappError) {
      console.warn('Erro ao enviar WhatsApp:', whatsappError);
    }

    return id;
  } catch (error) {
    console.error('Erro ao criar contador:', error);
    throw new Error('Falha ao criar contador');
  }
};

export const updateAccountant = async (id: string, data: any) => {
  try {
    const updates = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await update(ref(db, `accountants/${id}`), updates);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar contador:', error);
    throw new Error('Falha ao atualizar contador');
  }
};

export const deleteAccountant = async (id: string) => {
  try {
    await remove(ref(db, `accountants/${id}`));
    return true;
  } catch (error) {
    console.error('Erro ao excluir contador:', error);
    throw new Error('Falha ao excluir contador');
  }
};

export const updateAccountantStatus = async (id: string, status: string) => {
  try {
    await update(ref(db, `accountants/${id}`), {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status do contador:', error);
    throw new Error('Falha ao atualizar status');
  }
};

export const createClient = async (clientData: any, accountantId: string) => {
  const id = uuidv4();
  const temporaryPassword = generateTemporaryPassword();

  const clientWithMetadata = {
    ...clientData,
    id,
    accountantId,
    status: 'active',
    passwordHistory: [{
      password: temporaryPassword,
      createdAt: new Date().toISOString()
    }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await set(ref(db, `clients/${id}`), clientWithMetadata);

    try {
      await sendWelcomeEmail({
        name: clientData.companyName,
        email: clientData.email,
        company: clientData.companyName,
        temporaryPassword,
        userType: 'client'
      });
    } catch (emailError) {
      console.warn('Erro ao enviar email:', emailError);
    }

    try {
      await sendWelcomeWhatsApp({
        phone: clientData.phone,
        userType: 'cliente',
        name: clientData.companyName
      });
    } catch (whatsappError) {
      console.warn('Erro ao enviar WhatsApp:', whatsappError);
    }

    // Atualiza o contador de clientes do contador
    const accountantRef = ref(db, `accountants/${accountantId}`);
    const accountantSnapshot = await get(accountantRef);
    if (accountantSnapshot.exists()) {
      const accountant = accountantSnapshot.val();
      await update(accountantRef, {
        clientCount: (accountant.clientCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }

    return id;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error('Falha ao criar cliente');
  }
};

export const updateClient = async (id: string, data: any) => {
  try {
    const updates = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await update(ref(db, `clients/${id}`), updates);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw new Error('Falha ao atualizar cliente');
  }
};

export const deleteClient = async (id: string, accountantId: string) => {
  try {
    await remove(ref(db, `clients/${id}`));

    // Atualiza o contador de clientes do contador
    const accountantRef = ref(db, `accountants/${accountantId}`);
    const accountantSnapshot = await get(accountantRef);
    if (accountantSnapshot.exists()) {
      const accountant = accountantSnapshot.val();
      await update(accountantRef, {
        clientCount: Math.max((accountant.clientCount || 1) - 1, 0),
        updatedAt: serverTimestamp()
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw new Error('Falha ao excluir cliente');
  }
};

export const createEmployee = async (employeeData: any, clientId: string) => {
  const id = uuidv4();
  const temporaryPassword = generateTemporaryPassword();

  const employeeWithMetadata = {
    ...employeeData,
    id,
    clientId,
    status: 'active',
    passwordHistory: [{
      password: temporaryPassword,
      createdAt: new Date().toISOString()
    }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await set(ref(db, `employees/${id}`), employeeWithMetadata);

    try {
      await sendWelcomeEmail({
        name: employeeData.name,
        email: employeeData.email,
        company: employeeData.company,
        temporaryPassword,
        userType: 'employee'
      });
    } catch (emailError) {
      console.warn('Erro ao enviar email:', emailError);
    }

    try {
      await sendWelcomeWhatsApp({
        phone: employeeData.phone,
        userType: 'funcionário',
        name: employeeData.name
      });
    } catch (whatsappError) {
      console.warn('Erro ao enviar WhatsApp:', whatsappError);
    }

    return id;
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    throw new Error('Falha ao criar funcionário');
  }
};

export const updateEmployee = async (id: string, data: any) => {
  try {
    const updates = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await update(ref(db, `employees/${id}`), updates);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw new Error('Falha ao atualizar funcionário');
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await remove(ref(db, `employees/${id}`));
    return true;
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    throw new Error('Falha ao excluir funcionário');
  }
};

export const resendWelcomeEmail = async (userType: string, userId: string) => {
  try {
    const userRef = ref(db, `${userType}s/${userId}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      throw new Error('Usuário não encontrado');
    }

    const userData = snapshot.val();
    const temporaryPassword = generateTemporaryPassword();

    // Adiciona nova senha ao histórico
    const passwordHistory = userData.passwordHistory || [];
    passwordHistory.push({
      password: temporaryPassword,
      createdAt: new Date().toISOString()
    });

    // Atualiza o histórico no Firebase
    await update(userRef, {
      passwordHistory,
      updatedAt: serverTimestamp()
    });

    // Envia novo email
    await sendWelcomeEmail({
      name: userData.name || userData.companyName,
      email: userData.email,
      company: userData.company || userData.companyName,
      temporaryPassword,
      userType: userType === 'accountant' ? 'accountant' : 
                userType === 'client' ? 'client' : 'employee'
    });

    return true;
  } catch (error) {
    console.error('Erro ao reenviar email:', error);
    throw new Error('Falha ao reenviar email');
  }
};