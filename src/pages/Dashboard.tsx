import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AddCpfCnpjModal from "../components/AddCpfCnpjModal"
import { useAuth } from "../context/AuthContext"
import CpfCnpjService, { CpfCnpj } from "../services/cpfCnpjService"

const Dashboard = () => {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [cpfCnpjs, setCpfCnpjs] = useState<CpfCnpj[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [filter, setFilter] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortField, setSortField] = useState<"number" | "type">("number")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await CpfCnpjService.getAll(token)
          setCpfCnpjs(data)
        } else {
          console.error("Token is null")
        }
      } catch (error) {
        console.error("Erro ao buscar CPF/CNPJ", error)
      }
    }
    fetchData()
  }, [token])

  const handleBlock = async (id: string) => {
    try {
      if (token) {
        await CpfCnpjService.block(id, token)
        setCpfCnpjs((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, blocked: true } : item
          )
        )
      } else {
        console.error("Token is null")
      }
    } catch (error) {
      console.error("Erro ao bloquear CPF/CNPJ", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const filteredCpfCnpjs = cpfCnpjs.filter(
    (item) => item.number.includes(filter) || item.type.includes(filter)
  )

  const sortedCpfCnpjs = filteredCpfCnpjs.sort((a, b) => {
    if (sortField === "number") {
      return sortOrder === "asc"
        ? a.number.localeCompare(b.number)
        : b.number.localeCompare(a.number)
    }
    if (sortField === "type") {
      return sortOrder === "asc"
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type)
    }
    return 0
  })

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de CPF/CNPJ
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Cadastrar CPF/CNPJ
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Pesquisar CPF/CNPJ"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortField}
              onChange={(e) =>
                setSortField(e.target.value as "number" | "type")
              }
              label="Ordenar por"
            >
              <MenuItem value="number">Número</MenuItem>
              <MenuItem value="type">Tipo</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Ordem</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              label="Ordem"
            >
              <MenuItem value="asc">Ascendente</MenuItem>
              <MenuItem value="desc">Descendente</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCpfCnpjs.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={item.blocked}
                    onClick={() => handleBlock(item.id)}
                  >
                    {item.blocked ? "Bloqueado" : "Bloquear"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Sair
      </Button>

      <AddCpfCnpjModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        setCpfCnpjs={setCpfCnpjs}
      />
    </Container>
  )
}

export default Dashboard
