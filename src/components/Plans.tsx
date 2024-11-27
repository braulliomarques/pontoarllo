import React from 'react';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    price: 'R$ 29,90',
    features: [
      'Até 10 colaboradores',
      'Registro de ponto básico',
      'Relatórios mensais',
      'Suporte por email',
    ],
    recommended: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 49,90',
    features: [
      'Até 50 colaboradores',
      'Registro com foto',
      'Relatórios avançados',
      'Suporte prioritário',
      'Integração com folha',
      'App mobile',
    ],
    recommended: true,
  },
  {
    name: 'Empresarial',
    price: 'R$ 99,90',
    features: [
      'Colaboradores ilimitados',
      'Reconhecimento facial',
      'API completa',
      'Suporte 24/7',
      'Multi-filiais',
      'Personalização completa',
    ],
    recommended: false,
  },
];

export function Plans() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Planos e Preços
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Escolha o plano ideal para sua empresa
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.recommended
                  ? 'border-2 border-blue-500 relative'
                  : 'border border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Star className="w-4 h-4 mr-1" />
                    Recomendado
                  </span>
                </div>
              )}

              <div className="p-6 bg-white rounded-t-lg">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /mês
                  </span>
                </p>
                <button
                  className={`mt-8 w-full rounded-lg px-4 py-2 text-sm font-semibold ${
                    plan.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300'
                  } transition-colors duration-200`}
                >
                  Começar agora
                </button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white rounded-b-lg">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}