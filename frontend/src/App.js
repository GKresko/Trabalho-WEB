import React, { useState, useEffect } from "react";

const estiloContainer = {
  maxWidth: "900px",
  margin: "20px auto",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "10px",
  backgroundColor: "#f4f6f8",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const estiloTitulo = {
  color: "#2c3e50",
  borderBottom: "3px solid #3498db",
  paddingBottom: "5px",
  marginBottom: "15px",
};

const estiloSecao = {
  backgroundColor: "white",
  borderRadius: "6px",
  padding: "15px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const estiloLista = {
  listStyle: "none",
  paddingLeft: 0,
};

const estiloItem = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const estiloBotao = {
  marginLeft: "10px",
  border: "none",
  borderRadius: "4px",
  padding: "5px 10px",
  cursor: "pointer",
};

const estiloBotaoExcluir = {
  ...estiloBotao,
  backgroundColor: "#e74c3c",
  color: "white",
};

const estiloBotaoEditar = {
  ...estiloBotao,
  backgroundColor: "#f39c12",
  color: "white",
};

const estiloBotaoAdicionar = {
  backgroundColor: "#3498db",
  border: "none",
  color: "white",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};

const estiloInput = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginRight: "10px",
  marginTop: "5px",
  width: "200px",
};

function App() {
  // Estados
  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);

  // Estados para inputs/formulários e edição
  const [novoLivroNome, setNovoLivroNome] = useState("");
  const [novoLivroAutor, setNovoLivroAutor] = useState("");
  const [editLivroId, setEditLivroId] = useState(null);

  const [novoAutorNome, setNovoAutorNome] = useState("");
  const [editAutorId, setEditAutorId] = useState(null);

  const [novoPedidoLivroId, setNovoPedidoLivroId] = useState("");
  const [novoPedidoQuantidade, setNovoPedidoQuantidade] = useState(1);
  const [editPedidoId, setEditPedidoId] = useState(null);

  const [novoPagamentoPedidoId, setNovoPagamentoPedidoId] = useState("");
  const [novoPagamentoMetodo, setNovoPagamentoMetodo] = useState("");
  const [editPagamentoId, setEditPagamentoId] = useState(null);

  // Função para carregar todos dados ao montar o componente
  useEffect(() => {
    carregarLivros();
    carregarAutores();
    carregarPedidos();
    carregarPagamentos();
  }, []);

  function carregarLivros() {
    fetch("http://localhost:5156/livros")
      .then((res) => res.json())
      .then(setLivros)
      .catch((err) => alert("Erro ao carregar livros: " + err.message));
  }

  function carregarAutores() {
    fetch("http://localhost:5156/autores")
      .then((res) => res.json())
      .then(setAutores)
      .catch((err) => alert("Erro ao carregar autores: " + err.message));
  }

  function carregarPedidos() {
    fetch("http://localhost:5156/pedidos")
      .then((res) => res.json())
      .then(setPedidos)
      .catch((err) => alert("Erro ao carregar pedidos: " + err.message));
  }

  function carregarPagamentos() {
    fetch("http://localhost:5156/pagamentos")
      .then((res) => res.json())
      .then(setPagamentos)
      .catch((err) => alert("Erro ao carregar pagamentos: " + err.message));
  }

  // CRUD livros
  function salvarLivro() {
    if (!novoLivroNome.trim() || !novoLivroAutor.trim()) {
      alert("Preencha nome e autor do livro");
      return;
    }

    const metodo = editLivroId ? "PUT" : "POST";
    const url = editLivroId
    ? `http://localhost:5156/livros/${editLivroId}`
    : "http://localhost:5156/livros";


    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoLivroNome, autor: novoLivroAutor }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar livro");
        return res.json();
      })
      .then(() => {
        carregarLivros();
        limparFormularioLivro();
      })
      .catch((err) => alert(err.message));
  }

  function limparFormularioLivro() {
    setNovoLivroNome("");
    setNovoLivroAutor("");
    setEditLivroId(null);
  }

  function editarLivro(livro) {
    setNovoLivroNome(livro.nome);
    setNovoLivroAutor(livro.autor);
    setEditLivroId(livro.id);
  }

  function excluirLivro(id) {
    if (!window.confirm("Confirma exclusão do livro?")) return;
    fetch(`http://localhost:5156/livros/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir livro");
        carregarLivros();
      })
      .catch((err) => alert(err.message));
  }

  // CRUD autores
  function salvarAutor() {
    if (!novoAutorNome.trim()) {
      alert("Preencha nome do autor");
      return;
    }

    const metodo = editAutorId ? "PUT" : "POST";
    const url = editAutorId
      ? `http://localhost:5156/autores/${editAutorId}`
      : "http://localhost:5156/autores";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoAutorNome }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar autor");
        return res.json();
      })
      .then(() => {
        carregarAutores();
        limparFormularioAutor();
      })
      .catch((err) => alert(err.message));
  }

  function limparFormularioAutor() {
    setNovoAutorNome("");
    setEditAutorId(null);
  }

  function editarAutor(autor) {
    setNovoAutorNome(autor.nome);
    setEditAutorId(autor.id);
  }

  function excluirAutor(id) {
    if (!window.confirm("Confirma exclusão do autor?")) return;
    fetch(`http://localhost:5156/autores/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir autor");
        carregarAutores();
      })
      .catch((err) => alert(err.message));
  }

  // CRUD pedidos
  function salvarPedido() {
    if (!novoPedidoLivroId || novoPedidoQuantidade <= 0) {
      alert("Escolha um livro e quantidade válida");
      return;
    }

    const metodo = editPedidoId ? "PUT" : "POST";
    const url = editPedidoId
      ? `http://localhost:5156/pedidos/${editPedidoId}`
      : "http://localhost:5156/pedidos";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        livroId: Number(novoPedidoLivroId),
        quantidade: Number(novoPedidoQuantidade),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar pedido");
        return res.json();
      })
      .then(() => {
        carregarPedidos();
        limparFormularioPedido();
      })
      .catch((err) => alert(err.message));
  }

  function limparFormularioPedido() {
    setNovoPedidoLivroId("");
    setNovoPedidoQuantidade(1);
    setEditPedidoId(null);
  }

  function editarPedido(pedido) {
    setNovoPedidoLivroId(String(pedido.livroId));
    setNovoPedidoQuantidade(pedido.quantidade);
    setEditPedidoId(pedido.id);
  }

  function excluirPedido(id) {
    if (!window.confirm("Confirma exclusão do pedido?")) return;
    fetch(`http://localhost:5156/pedidos/${id}`, { method: "DELETE" })

      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir pedido");
        carregarPedidos();
      })
      .catch((err) => alert(err.message));
  }

  // CRUD pagamentos
  function salvarPagamento() {
    if (!novoPagamentoPedidoId || !novoPagamentoMetodo.trim()) {
      alert("Escolha pedido e informe método de pagamento");
      return;
    }

    const metodo = editPagamentoId ? "PUT" : "POST";
    const url = editPagamentoId
      ? `http://localhost:5156/pagamentos/${editPagamentoId}`
      : "http://localhost:5156/pagamentos";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pedidoId: Number(novoPagamentoPedidoId),
        metodoPagamento: novoPagamentoMetodo.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar pagamento");
        return res.json();
      })
      .then(() => {
        carregarPagamentos();
        limparFormularioPagamento();
      })
      .catch((err) => alert(err.message));
  }

  function limparFormularioPagamento() {
    setNovoPagamentoPedidoId("");
    setNovoPagamentoMetodo("");
    setEditPagamentoId(null);
  }

  function editarPagamento(pagamento) {
    setNovoPagamentoPedidoId(String(pagamento.pedidoId));
    setNovoPagamentoMetodo(pagamento.metodoPagamento);
    setEditPagamentoId(pagamento.id);
  }

  function excluirPagamento(id) {
    if (!window.confirm("Confirma exclusão do pagamento?")) return;
    fetch(`http://localhost:5156/pagamentos/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir pagamento");
        carregarPagamentos();
      })
      .catch((err) => alert(err.message));
  }

  // Função para buscar nome do livro pelo id (para mostrar em pedidos)
  function nomeLivroPorId(id) {
    const livro = livros.find((l) => l.id === id);
    return livro ? livro.nome : "(Livro não encontrado)";
  }

  // Função para mostrar pedido detalhado em pagamento
  function infoPedidoPorId(id) {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return "(Pedido não encontrado)";
    return `${nomeLivroPorId(pedido.livroId)} - Qtde: ${pedido.quantidade}`;
  }

  return (
    <div style={estiloContainer}>
      <h1 style={estiloTitulo}>Sistema Completo de Livros, Pedidos e Pagamentos</h1>

      {/* Livros */}
      <section style={estiloSecao}>
        <h2 style={{ color: "#2980b9" }}>Livros</h2>
        <input
          style={estiloInput}
          placeholder="Nome do livro"
          value={novoLivroNome}
          onChange={(e) => setNovoLivroNome(e.target.value)}
        />
        <input
          style={estiloInput}
          placeholder="Autor do livro"
          value={novoLivroAutor}
          onChange={(e) => setNovoLivroAutor(e.target.value)}
        />
        <button style={estiloBotaoAdicionar} onClick={salvarLivro}>
          {editLivroId ? "Salvar alteração" : "Adicionar livro"}
        </button>

        <ul style={estiloLista}>
          {livros.map((livro) => (
            <li key={livro.id} style={estiloItem}>
              <span>
                <b>{livro.nome}</b> - {livro.autor}
              </span>
              <span>
                <button
                  style={estiloBotaoEditar}
                  onClick={() => editarLivro(livro)}
                >
                  Editar
                </button>
                <button
                  style={estiloBotaoExcluir}
                  onClick={() => excluirLivro(livro.id)}
                >
                  Excluir
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Autores */}
      <section style={estiloSecao}>
        <h2 style={{ color: "#27ae60" }}>Autores</h2>
        <input
          style={estiloInput}
          placeholder="Nome do autor"
          value={novoAutorNome}
          onChange={(e) => setNovoAutorNome(e.target.value)}
        />
        <button style={estiloBotaoAdicionar} onClick={salvarAutor}>
          {editAutorId ? "Salvar alteração" : "Adicionar autor"}
        </button>

        <ul style={estiloLista}>
          {autores.map((autor) => (
            <li key={autor.id} style={estiloItem}>
              <span>{autor.nome}</span>
              <span>
                <button
                  style={estiloBotaoEditar}
                  onClick={() => editarAutor(autor)}
                >
                  Editar
                </button>
                <button
                  style={estiloBotaoExcluir}
                  onClick={() => excluirAutor(autor.id)}
                >
                  Excluir
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pedidos */}
      <section style={estiloSecao}>
        <h2 style={{ color: "#8e44ad" }}>Pedidos</h2>
        <select
          style={estiloInput}
          value={novoPedidoLivroId}
          onChange={(e) => setNovoPedidoLivroId(e.target.value)}
        >
          <option value="">-- Escolha um livro --</option>
          {livros.map((livro) => (
            <option key={livro.id} value={livro.id}>
              {livro.nome}
            </option>
          ))}
        </select>
        <input
          style={{ ...estiloInput, width: "100px" }}
          type="number"
          min="1"
          placeholder="Quantidade"
          value={novoPedidoQuantidade}
          onChange={(e) => setNovoPedidoQuantidade(Number(e.target.value))}
        />
        <button style={estiloBotaoAdicionar} onClick={salvarPedido}>
          {editPedidoId ? "Salvar alteração" : "Adicionar pedido"}
        </button>

        <ul style={estiloLista}>
          {pedidos.map((pedido) => (
            <li key={pedido.id} style={estiloItem}>
              <span>
                <b>{nomeLivroPorId(pedido.livroId)}</b> - Qtde: {pedido.quantidade}
              </span>
              <span>
                <button
                  style={estiloBotaoEditar}
                  onClick={() => editarPedido(pedido)}
                >
                  Editar
                </button>
                <button
                  style={estiloBotaoExcluir}
                  onClick={() => excluirPedido(pedido.id)}
                >
                  Excluir
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pagamentos */}
      <section style={estiloSecao}>
        <h2 style={{ color: "#c0392b" }}>Pagamentos</h2>
        <select
          style={estiloInput}
          value={novoPagamentoPedidoId}
          onChange={(e) => setNovoPagamentoPedidoId(e.target.value)}
        >
          <option value="">-- Escolha um pedido --</option>
          {pedidos.map((pedido) => (
            <option key={pedido.id} value={pedido.id}>
              {infoPedidoPorId(pedido.id)}
            </option>
          ))}
        </select>
        <input
          style={estiloInput}
          placeholder="Método de pagamento"
          value={novoPagamentoMetodo}
          onChange={(e) => setNovoPagamentoMetodo(e.target.value)}
        />
        <button style={estiloBotaoAdicionar} onClick={salvarPagamento}>
          {editPagamentoId ? "Salvar alteração" : "Adicionar pagamento"}
        </button>

        <ul style={estiloLista}>
          {pagamentos.map((pag) => (
            <li key={pag.id} style={estiloItem}>
              <span>
                Pedido: <b>{infoPedidoPorId(pag.pedidoId)}</b> | Método: {pag.metodoPagamento}
              </span>
              <span>
                <button
                  style={estiloBotaoEditar}
                  onClick={() => editarPagamento(pag)}
                >
                  Editar
                </button>
                <button
                  style={estiloBotaoExcluir}
                  onClick={() => excluirPagamento(pag.id)}
                >
                  Excluir
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;