import axios from 'axios';

type WhatsAppMessage = {
  phone: string;
  userType: 'contador' | 'cliente' | 'funcionario';
  name: string;
};

export const sendWelcomeWhatsApp = async ({ phone, userType, name }: WhatsAppMessage) => {
  try {
    // Remove caracteres não numéricos do telefone
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Adiciona 55 se não começar com ele
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    if (formattedPhone.length < 12 || formattedPhone.length > 13) {
      throw new Error('Número de telefone inválido');
    }

    const message = `Olá ${name}! Seja bem-vindo ao Sistema de Ponto Eletrônico como ${userType}. Em breve você receberá um email com suas credenciais de acesso.`;

    const response = await axios.post(
      'https://apievolution.arllo.io/message/sendText/556196942713',
      {
        number: formattedPhone,
        text: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': '8bb01f121c871ad392c360f39fc509d7'
        },
        timeout: 10000 // 10 segundos de timeout
      }
    );

    if (response.status === 200) {
      console.log('Mensagem WhatsApp enviada com sucesso para:', formattedPhone);
      return true;
    }

    throw new Error(`Falha ao enviar mensagem: Status ${response.status}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao enviar mensagem WhatsApp:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`Falha ao enviar mensagem WhatsApp: ${error.message}`);
    }
    
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    if (error instanceof Error) {
      throw new Error(`Falha ao enviar mensagem WhatsApp: ${error.message}`);
    }
    throw new Error('Falha ao enviar mensagem WhatsApp');
  }
};