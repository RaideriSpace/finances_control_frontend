import { AddTransacaoButton } from "./components/AddTransacaoButton";
import { ListaTransacoes } from "./components/ListaTransacoes";


export default async function TransacoesPage() {
  // O ideal é passar os dados iniciais do servidor para um componente cliente
  const res = await fetch('https://finances-control-backend.onrender.com/transacoes', { cache: 'no-store' });
  const initialData = await res.json();

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Finanças</h1>
        <AddTransacaoButton />
      </div>
      
      {/* Crie este componente para gerenciar a lista e as deleções em tempo real */}
      <ListaTransacoes initialData={initialData} />
    </main>
  );
}