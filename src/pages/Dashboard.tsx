import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
            {cpfCnpjs.map((item) => (
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
