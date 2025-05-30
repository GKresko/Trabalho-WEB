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

  // Estados dos dados
  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);

  // Estados dos formulários
  const [formLivro, setFormLivro] = useState({ titulo: "", autorId: "" });
  const [formAutor, setFormAutor] = useState({ nome: "" });
  const [formPedido, setFormPedido] = useState({ livroId: "", quantidade: 1 });
  const [formPagamento, setFormPagamento] = useState({ pedidoId: "", valor: "" });

  // Loading e notificações
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const handleTabChange = (_, newVal) => setTab(newVal);

  const apiBase = "http://localhost:5156";

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

  const submitLivro = async (e) => {
    e.preventDefault();
    if (!formLivro.titulo || !formLivro.autorId) {
      alertError("Preencha título e autor");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/livros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formLivro),
      });
      if (!res.ok) throw new Error("Erro ao adicionar livro");
      setFormLivro({ titulo: "", autorId: "" });
      fetchLivros();
      setAlert({ open: true, message: "Livro adicionado!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAutor = async (e) => {
    e.preventDefault();
    if (!formAutor.nome) {
      alertError("Preencha o nome do autor");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/autores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formAutor),
      });
      if (!res.ok) throw new Error("Erro ao adicionar autor");
      setFormAutor({ nome: "" });
      fetchAutores();
      setAlert({ open: true, message: "Autor adicionado!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPedido = async (e) => {
    e.preventDefault();
    if (!formPedido.livroId || formPedido.quantidade < 1) {
      alertError("Selecione um livro e quantidade válida");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPedido),
      });
      if (!res.ok) throw new Error("Erro ao adicionar pedido");
      setFormPedido({ livroId: "", quantidade: 1 });
      fetchPedidos();
      setAlert({ open: true, message: "Pedido adicionado!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitPagamento = async (e) => {
    e.preventDefault();
    if (!formPagamento.pedidoId || !formPagamento.valor) {
      alertError("Selecione pedido e informe valor");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/pagamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPagamento),
      });
      if (!res.ok) throw new Error("Erro ao adicionar pagamento");
      setFormPagamento({ pedidoId: "", valor: "" });
      fetchPagamentos();
      setAlert({ open: true, message: "Pagamento adicionado!", severity: "success" });
    } catch (err) {
      alertError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "20px auto" }}>
      <AppBar position="static">
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Livros" />
          <Tab label="Autores" />
          <Tab label="Pedidos" />
          <Tab label="Pagamentos" />
        </Tabs>
      </AppBar>

      <TabPanel value={tab} index={0}>
        <Typography variant="h5" gutterBottom>
          Livros
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Autor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {livros.map((livro) => {
                  const autorNome = autores.find((a) => a.id === livro.autorId)?.nome || "—";
                  return (
                    <TableRow key={livro.id}>
                      <TableCell>{livro.id}</TableCell>
                      <TableCell>{livro.titulo}</TableCell>
                      <TableCell>{autorNome}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitLivro} sx={{ marginTop: 3, maxWidth: 400 }}>
          <TextField
            label="Título"
            fullWidth
            value={formLivro.titulo}
            onChange={(e) => setFormLivro({ ...formLivro, titulo: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            select
            label="Autor"
            fullWidth
            SelectProps={{ native: true }}
            value={formLivro.autorId}
            onChange={(e) => setFormLivro({ ...formLivro, autorId: e.target.value })}
            margin="normal"
            required
          >
            <option value="">Selecione um autor</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </TextField>
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            Adicionar Livro
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Typography variant="h5" gutterBottom>
          Autores
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {autores.map((autor) => (
                  <TableRow key={autor.id}>
                    <TableCell>{autor.id}</TableCell>
                    <TableCell>{autor.nome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitAutor} sx={{ marginTop: 3, maxWidth: 400 }}>
          <TextField
            label="Nome"
            fullWidth
            value={formAutor.nome}
            onChange={(e) => setFormAutor({ nome: e.target.value })}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            Adicionar Autor
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Typography variant="h5" gutterBottom>
          Pedidos
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Livro</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.map((pedido) => {
                  const livroTitulo = livros.find((l) => l.id === pedido.livroId)?.titulo || "—";
                  return (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{livroTitulo}</TableCell>
                      <TableCell>{pedido.quantidade}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitPedido} sx={{ marginTop: 3, maxWidth: 400 }}>
          <TextField
            select
            label="Livro"
            fullWidth
            SelectProps={{ native: true }}
            value={formPedido.livroId}
            onChange={(e) => setFormPedido({ ...formPedido, livroId: e.target.value })}
            margin="normal"
            required
          >
            <option value="">Selecione um livro</option>
            {livros.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titulo}
              </option>
            ))}
          </TextField>
          <TextField
            label="Quantidade"
            type="number"
            fullWidth
            value={formPedido.quantidade}
            onChange={(e) => setFormPedido({ ...formPedido, quantidade: Number(e.target.value) })}
            margin="normal"
            inputProps={{ min: 1 }}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            Adicionar Pedido
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <Typography variant="h5" gutterBottom>
          Pagamentos
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Pedido</TableCell>
                  <TableCell>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagamentos.map((pagamento) => {
                  const pedidoInfo = pedidos.find((p) => p.id === pagamento.pedidoId);
                  const livroTitulo = pedidoInfo
                    ? livros.find((l) => l.id === pedidoInfo.livroId)?.titulo
                    : "—";
                  return (
                    <TableRow key={pagamento.id}>
                      <TableCell>{pagamento.id}</TableCell>
                      <TableCell>{pedidoInfo ? `Pedido ${pedidoInfo.id} - ${livroTitulo}` : "—"}</TableCell>
                      <TableCell>{pagamento.valor}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitPagamento} sx={{ marginTop: 3, maxWidth: 400 }}>
          <TextField
            select
            label="Pedido"
            fullWidth
            SelectProps={{ native: true }}
            value={formPagamento.pedidoId}
            onChange={(e) => setFormPagamento({ ...formPagamento, pedidoId: e.target.value })}
            margin="normal"
            required
          >
            <option value="">Selecione um pedido</option>
            {pedidos.map((p) => (
              <option key={p.id} value={p.id}>
                Pedido {p.id}
              </option>
            ))}
          </TextField>
          <TextField
            label="Valor"
            type="number"
            fullWidth
            value={formPagamento.valor}
            onChange={(e) => setFormPagamento({ ...formPagamento, valor: e.target.value })}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
            Adicionar Pagamento
          </Button>
        </Box>
      </TabPanel>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
