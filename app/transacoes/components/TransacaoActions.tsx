"use client"; // Necessário para usar onClick

export function TransacaoActions({ id, onDelete }: { id: number; onDelete: (id: number) => void }) {
	const handleEdit = () => {
		// Aqui você abriria o modal de edição (podemos usar uma lib como Shadcn/UI ou um simples state)
		alert(`Editar transação ${id}`);
	};

	const handleDelete = async () => {
		if (confirm("Tem certeza que deseja deletar?")) {
			const res = await fetch(`https://finances-control-backend.onrender.com/transacoes/${id}`, {
				method: "DELETE",
			});

			if (res.ok) {
				onDelete(id); // Atualiza a lista na tela
			} else {
				alert("Erro ao deletar");
			}
		}
	};

	return (
		<div className="flex gap-2 mt-2">
			<button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
				Editar
			</button>
			<button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
				Deletar
			</button>
		</div>
	);
}
