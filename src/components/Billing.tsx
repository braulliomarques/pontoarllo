import React from 'react';
import { CreditCard, Download, Clock } from 'lucide-react';

export function Billing() {
  const invoices = [
    {
      id: 1,
      date: '01/03/2024',
      amount: 'R$ 49,90',
      status: 'Pago',
      downloadUrl: '#',
    },
    {
      id: 2,
      date: '01/02/2024',
      amount: 'R$ 49,90',
      status: 'Pago',
      downloadUrl: '#',
    },
    {
      id: 3,
      date: '01/01/2024',
      amount: 'R$ 49,90',
      status: 'Pago',
      downloadUrl: '#',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Faturamento</h2>

      <div className="mb-8">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Método de Pagamento
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Alterar
            </button>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">
                Cartão de Crédito
              </p>
              <p className="text-sm text-gray-600">
                Mastercard terminando em 4242
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Próxima Cobrança
              </h3>
              <p className="text-sm text-gray-600">
                R$ 49,90 será cobrado em 01/04/2024
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Histórico de Faturas
        </h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Data
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Valor
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                    {invoice.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {invoice.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}