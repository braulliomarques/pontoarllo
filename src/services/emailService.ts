import emailjs from '@emailjs/browser';

type EmailData = {
  name: string;
  email: string;
  company: string;
  temporaryPassword: string;
  userType: 'accountant' | 'client' | 'employee';
};

export const sendWelcomeEmail = async (data: EmailData) => {
  try {
    const templateParams = {
      to_name: data.name,
      to_email: data.email,
      company_name: data.company,
      temp_password: data.temporaryPassword,
      system_url: 'https://controledeponto.web.app',
      support_phone: '(11) 99999-9999',
      support_email: 'braullio@arllo.io',
      user_type: data.userType === 'accountant' 
        ? 'Contador' 
        : data.userType === 'client' 
        ? 'Empresa' 
        : 'Colaborador'
    };

    // Inicializa o EmailJS com sua chave pública
    emailjs.init({
      publicKey: 'rDfIGEZV1DR7l_Po8',
    });

    const response = await emailjs.send(
      'service_yngfsuh',
      'template_zx9tvjd',
      templateParams,
      'rDfIGEZV1DR7l_Po8'
    );

    if (response.status === 200) {
      console.log('Email enviado com sucesso para:', data.email);
      return true;
    } else {
      throw new Error(`Falha ao enviar email: Status ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de boas-vindas');
  }
};