import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index } = props;
  return value === index ? <Box p={3}>{children}</Box> : null;
}

export default function App() {
  const [tab, setTab] = useState(0);

  // Dados
  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);

  // Formulários
  const [formLivro, setFormLivro] = useState({ id: 0, nome: "", autor: "" });
  const [formAutor, setFormAutor] = useState({ id: 0, nome: "", obra: "" });
  const [formPedido, setFormPedido] = useState({ id: 0, descricao: "", realizado: false });
  const [formPagamento, setFormPagamento] = useState({
    id: 0,
    cartao: false,
    pix: true,
    dinheiro: false,
  });

  // Loading e alertas
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const handleTabChange = (_, newVal) => setTab(newVal);

  const apiBase = "http://localhost:5156";

  // Fetch data
  const fetchLivros = async () => {
    try {
      const res = await fetch(`${apiBase}/livros`);
      const data = await res.json();
      setLivros(data);
    } catch {
      alertError("Erro ao carregar livros");
    }
  };

  const fetchAutores = async () => {
    try {
      const res = await fetch(`${apiBase}/autores`);
      const data = await res.json();
      setAutores(data);
    } catch {
      alertError("Erro ao carregar autores");
    }
  };

  const fetchPedidos = async () => {
    try {
      const res = await fetch(`${apiBase}/pedidos`);
      const data = await res.json();
      setPedidos(data);
    } catch {
      alertError("Erro ao carregar pedidos");
    }
  };

  const fetchPagamentos = async () => {
    try {
      const res = await fetch(`${apiBase}/pagamentos`);
      const data = await res.json();
      setPagamentos(data);
    } catch {
      alertError("Erro ao carregar pagamentos");
    }
  };

  useEffect(() => {
    switch (tab) {
      case 0:
        fetchLivros();
        break;
      case 1:
        fetchAutores();
        break;
      case 2:
        fetchPedidos();
        break;
      case 3:
        fetchPagamentos();
        break;
      default:
        break;
    }
  }, [tab]);

  function alertError(message) {
    setAlert({ open: true, message, severity: "error" });
  }

  // ------ Funções de Adicionar e Editar ------

  const submitLivro = async (e) => {
    e.preventDefault();
    if (!formLivro.nome || !formLivro.autor) {
      alertError("Preencha título e autor do livro");
      return;
    }
    setLoading(true);
    try {
      const method = formLivro.id === 0 ? "POST" : "PUT";
      const url = formLivro.id === 0 ? `${apiBase}/livros` : `${apiBase}/livros/${formLivro.id}`;

      const payload = {
        id: formLivro.id,
        nome: formLivro.nome,
        autor: formLivro.autor,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erro ao ${method === "POST" ? "adicionar" : "editar"} livro`);
      setFormLivro({ id: 0, nome: "", autor: "" });
      fetchLivros();
      setAlert({ open: true, message: `Livro ${method === "POST" ? "adicionado" : "editado"}!`, severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAutor = async (e) => {
    e.preventDefault();
    if (!formAutor.nome || !formAutor.obra) {
      alertError("Preencha nome e obra do autor");
      return;
    }
    setLoading(true);
    try {
      const method = formAutor.id === 0 ? "POST" : "PUT";
      const url = formAutor.id === 0 ? `${apiBase}/autores` : `${apiBase}/autores/${formAutor.id}`;

      const payload = {
        id: formAutor.id,
        nome: formAutor.nome,
        obra: formAutor.obra,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erro ao ${method === "POST" ? "adicionar" : "editar"} autor`);
      setFormAutor({ id: 0, nome: "", obra: "" });
      fetchAutores();
      setAlert({ open: true, message: `Autor ${method === "POST" ? "adicionado" : "editado"}!`, severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPedido = async (e) => {
    e.preventDefault();
    if (!formPedido.descricao) {
      alertError("Preencha a descrição do pedido");
      return;
    }
    setLoading(true);
    try {
      const method = formPedido.id === 0 ? "POST" : "PUT";
      const url = formPedido.id === 0 ? `${apiBase}/pedidos` : `${apiBase}/pedidos/${formPedido.id}`;

      const payload = {
        id: formPedido.id,
        descricao: formPedido.descricao,
        realizado: formPedido.realizado,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erro ao ${method === "POST" ? "adicionar" : "editar"} pedido`);
      setFormPedido({ id: 0, descricao: "", realizado: false });
      fetchPedidos();
      setAlert({ open: true, message: `Pedido ${method === "POST" ? "adicionado" : "editado"}!`, severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPagamento = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = formPagamento.id === 0 ? "POST" : "PUT";
      const url = formPagamento.id === 0 ? `${apiBase}/pagamentos` : `${apiBase}/pagamentos/${formPagamento.id}`;

      const payload = {
        id: formPagamento.id,
        cartao: formPagamento.cartao,
        pix: formPagamento.pix,
        dinheiro: formPagamento.dinheiro,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erro ao ${method === "POST" ? "adicionar" : "editar"} pagamento`);
      setFormPagamento({ id: 0, cartao: false, pix: true, dinheiro: false });
      fetchPagamentos();
      setAlert({ open: true, message: `Pagamento ${method === "POST" ? "adicionado" : "editado"}!`, severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------ Funções de Excluir ------

  const deleteLivro = async (id) => {
    if (!window.confirm("Deseja realmente excluir este livro?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/livros/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir livro");
      fetchLivros();
      setAlert({ open: true, message: "Livro excluído!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAutor = async (id) => {
    if (!window.confirm("Deseja realmente excluir este autor?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/autores/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir autor");
      fetchAutores();
      setAlert({ open: true, message: "Autor excluído!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePedido = async (id) => {
    if (!window.confirm("Deseja realmente excluir este pedido?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/pedidos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir pedido");
      fetchPedidos();
      setAlert({ open: true, message: "Pedido excluído!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePagamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este pagamento?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/pagamentos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir pagamento");
      fetchPagamentos();
      setAlert({ open: true, message: "Pagamento excluído!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------ Funções para preencher formulário na edição ------

  const editLivro = (livro) => setFormLivro(livro);
  const editAutor = (autor) => setFormAutor(autor);
  const editPedido = (pedido) => setFormPedido(pedido);
  const editPagamento = (pagamento) => setFormPagamento(pagamento);

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Livros" />
          <Tab label="Autores" />
          <Tab label="Pedidos" />
          <Tab label="Pagamentos" />
        </Tabs>
      </AppBar>

      {/* Livros */}
      <TabPanel value={tab} index={0}>
        <Typography variant="h5">Cadastro de Livros</Typography>
        <Box component="form" onSubmit={submitLivro} sx={{ mb: 2 }}>
          <TextField
            label="Título"
            value={formLivro.nome}
            onChange={(e) => setFormLivro({ ...formLivro, nome: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Autor"
            value={formLivro.autor}
            onChange={(e) => setFormLivro({ ...formLivro, autor: e.target.value })}
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {formLivro.id === 0 ? "Adicionar" : "Editar"}
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {livros.map((livro) => (
                <TableRow key={livro.id}>
                  <TableCell>{livro.id}</TableCell>
                  <TableCell>{livro.nome}</TableCell>
                  <TableCell>{livro.autor}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => editLivro(livro)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => deleteLivro(livro.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!livros.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum livro cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Autores */}
      <TabPanel value={tab} index={1}>
        <Typography variant="h5">Cadastro de Autores</Typography>
        <Box component="form" onSubmit={submitAutor} sx={{ mb: 2 }}>
          <TextField
            label="Nome"
            value={formAutor.nome}
            onChange={(e) => setFormAutor({ ...formAutor, nome: e.target.value })}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Obra"
            value={formAutor.obra}
            onChange={(e) => setFormAutor({ ...formAutor, obra: e.target.value })}
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {formAutor.id === 0 ? "Adicionar" : "Editar"}
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Obra</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {autores.map((autor) => (
                <TableRow key={autor.id}>
                  <TableCell>{autor.id}</TableCell>
                  <TableCell>{autor.nome}</TableCell>
                  <TableCell>{autor.obra}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => editAutor(autor)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => deleteAutor(autor.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!autores.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum autor cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pedidos */}
      <TabPanel value={tab} index={2}>
        <Typography variant="h5">Cadastro de Pedidos</Typography>
        <Box component="form" onSubmit={submitPedido} sx={{ mb: 2 }}>
          <TextField
            label="Descrição"
            value={formPedido.descricao}
            onChange={(e) => setFormPedido({ ...formPedido, descricao: e.target.value })}
            sx={{ mr: 2, width: 300 }}
          />
          <label>
            Realizado?{" "}
            <input
              type="checkbox"
              checked={formPedido.realizado}
              onChange={(e) => setFormPedido({ ...formPedido, realizado: e.target.checked })}
            />
          </label>
          <Button type="submit" variant="contained" disabled={loading} sx={{ ml: 2 }}>
            {formPedido.id === 0 ? "Adicionar" : "Editar"}
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Realizado</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>{pedido.descricao}</TableCell>
                  <TableCell>{pedido.realizado ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => editPedido(pedido)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => deletePedido(pedido.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!pedidos.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum pedido cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pagamentos */}
      <TabPanel value={tab} index={3}>
        <Typography variant="h5">Cadastro de Pagamentos</Typography>
        <Box component="form" onSubmit={submitPagamento} sx={{ mb: 2 }}>
          <label>
            Cartão{" "}
            <input
              type="checkbox"
              checked={formPagamento.cartao}
              onChange={(e) => setFormPagamento({ ...formPagamento, cartao: e.target.checked })}
            />
          </label>
          <label style={{ marginLeft: 20 }}>
            Pix{" "}
            <input
              type="checkbox"
              checked={formPagamento.pix}
                            onChange={(e) => setFormPagamento({ ...formPagamento, pix: e.target.checked })}
            />
          </label>
          <label style={{ marginLeft: 20 }}>
            Dinheiro{" "}
            <input
              type="checkbox"
              checked={formPagamento.dinheiro}
              onChange={(e) => setFormPagamento({ ...formPagamento, dinheiro: e.target.checked })}
            />
          </label>
          <Button type="submit" variant="contained" disabled={loading} sx={{ ml: 2 }}>
            {formPagamento.id === 0 ? "Adicionar" : "Editar"}
          </Button>
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cartão</TableCell>
                <TableCell>Pix</TableCell>
                <TableCell>Dinheiro</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell>{pagamento.id}</TableCell>
                  <TableCell>{pagamento.cartao ? "Sim" : "Não"}</TableCell>
                  <TableCell>{pagamento.pix ? "Sim" : "Não"}</TableCell>
                  <TableCell>{pagamento.dinheiro ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => editPagamento(pagamento)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => deletePagamento(pagamento.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!pagamentos.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum pagamento cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
