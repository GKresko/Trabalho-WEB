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

  // Formulários (ajustados para os campos corretos)
  const [formLivro, setFormLivro] = useState({ nome: "", autor: "" });
  const [formAutor, setFormAutor] = useState({ nome: "", obra: "" });
  const [formPedido, setFormPedido] = useState({ descricao: "", realizado: false });
  const [formPagamento, setFormPagamento] = useState({
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

  // Submits

  const submitLivro = async (e) => {
    e.preventDefault();
    if (!formLivro.nome || !formLivro.autor) {
      alertError("Preencha titulo e autor do livro");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        id: 0,
        nome: formLivro.nome,
        autor: formLivro.autor,
      };
      const res = await fetch(`${apiBase}/livros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao adicionar livro");
      setFormLivro({ nome: "", autor: "" });
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
    if (!formAutor.nome || !formAutor.obra) {
      alertError("Preencha nome e obra do autor");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        id: 0,
        nome: formAutor.nome,
        obra: formAutor.obra,
      };
      const res = await fetch(`${apiBase}/autores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao adicionar autor");
      setFormAutor({ nome: "", obra: "" });
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
    if (!formPedido.descricao) {
      alertError("Preencha a descrição do pedido");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        id: 0,
        descricao: formPedido.descricao,
        realizado: formPedido.realizado,
      };
      const res = await fetch(`${apiBase}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao adicionar pedido");
      setFormPedido({ descricao: "", realizado: false });
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
    // Não há inputs no seu form original para cartao, pix, dinheiro, então não tem como validar melhor
    setLoading(true);
    try {
      const payload = {
        id: 0,
        cartao: formPagamento.cartao,
        pix: formPagamento.pix,
        dinheiro: formPagamento.dinheiro,
      };
      const res = await fetch(`${apiBase}/pagamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao adicionar pagamento");
      setFormPagamento({ cartao: false, pix: true, dinheiro: false });
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
                  <TableCell>Titulo</TableCell>
                  <TableCell>Autor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {livros.map((livro) => (
                  <TableRow key={livro.id}>
                    <TableCell>{livro.id}</TableCell>
                    <TableCell>{livro.nome}</TableCell>
                    <TableCell>{livro.autor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitLivro} sx={{ marginTop: 3, maxWidth: 400 }}>
          <TextField
            label="Titulo"
            fullWidth
            value={formLivro.nome}
            onChange={(e) => setFormLivro({ ...formLivro, nome: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Autor"
            fullWidth
            value={formLivro.autor}
            onChange={(e) => setFormLivro({ ...formLivro, autor: e.target.value })}
            margin="normal"
          />
          <Button type="submit" variant="contained" disabled={loading}>
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
                  <TableCell>Obra</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {autores.map((autor) => (
                  <TableRow key={autor.id}>
                    <TableCell>{autor.id}</TableCell>
                    <TableCell>{autor.nome}</TableCell>
                    <TableCell>{autor.obra}</TableCell>
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
            onChange={(e) => setFormAutor({ ...formAutor, nome: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Obra"
            fullWidth
            value={formAutor.obra}
            onChange={(e) => setFormAutor({ ...formAutor, obra: e.target.value })}
            margin="normal"
          />
          <Button type="submit" variant="contained" disabled={loading}>
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
                  <TableCell>Descrição</TableCell>
                  <TableCell>Realizado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>{pedido.descricao}</TableCell>
                    <TableCell>{pedido.realizado ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitPedido} sx={{ marginTop: 3, maxWidth: 400 }}>
          <TextField
            label="Descrição"
            fullWidth
            value={formPedido.descricao}
            onChange={(e) => setFormPedido({ ...formPedido, descricao: e.target.value })}
            margin="normal"
          />
          <label>
            <input
              type="checkbox"
              checked={formPedido.realizado}
              onChange={(e) => setFormPedido({ ...formPedido, realizado: e.target.checked })}
            />
            Realizado
          </label>
          <Box mt={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              Adicionar Pedido
            </Button>
          </Box>
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
                  <TableCell>Cartão</TableCell>
                  <TableCell>Pix</TableCell>
                  <TableCell>Dinheiro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagamentos.map((pag) => (
                  <TableRow key={pag.id}>
                    <TableCell>{pag.id}</TableCell>
                    <TableCell>{pag.cartao ? "Sim" : "Não"}</TableCell>
                    <TableCell>{pag.pix ? "Sim" : "Não"}</TableCell>
                    <TableCell>{pag.dinheiro ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box component="form" onSubmit={submitPagamento} sx={{ marginTop: 3, maxWidth: 400 }}>
          <label>
            <input
              type="checkbox"
              checked={formPagamento.cartao}
              onChange={(e) => setFormPagamento({ ...formPagamento, cartao: e.target.checked })}
            />
            Cartão
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={formPagamento.pix}
              onChange={(e) => setFormPagamento({ ...formPagamento, pix: e.target.checked })}
            />
            Pix
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={formPagamento.dinheiro}
              onChange={(e) => setFormPagamento({ ...formPagamento, dinheiro: e.target.checked })}
            />
            Dinheiro
          </label>
          <Box mt={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              Adicionar Pagamento
            </Button>
          </Box>
        </Box>
      </TabPanel>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
