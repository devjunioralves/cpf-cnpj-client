import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import CpfCnpjService, { CpfCnpj } from "../services/cpfCnpjService"

interface AddCpfCnpjModalProps {
  open: boolean
  onClose: () => void
  setCpfCnpjs: React.Dispatch<React.SetStateAction<CpfCnpj[]>>
}

const AddCpfCnpjModal = ({
  open,
  onClose,
  setCpfCnpjs,
}: AddCpfCnpjModalProps) => {
  const { token } = useAuth()
  const [number, setNumber] = useState("")
  const [type, setType] = useState<"CPF" | "CNPJ">("CPF")

  const handleSubmit = async () => {
    try {
      if (token) {
        const newEntry = await CpfCnpjService.create(number, type, token)
        setCpfCnpjs((prev) => [...prev, newEntry])
        onClose()
      } else {
        console.error("Token is null")
      }
    } catch (error) {
      console.error("Erro ao cadastrar CPF/CNPJ", error)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
          minWidth: 300,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Cadastrar CPF/CNPJ
        </Typography>

        <TextField
          label="Número"
          variant="outlined"
          fullWidth
          margin="normal"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <TextField
          label="Tipo"
          select
          fullWidth
          margin="normal"
          value={type}
          onChange={(e) => setType(e.target.value as "CPF" | "CNPJ")}
        >
          <MenuItem value="CPF">CPF</MenuItem>
          <MenuItem value="CNPJ">CNPJ</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Cadastrar
        </Button>
      </Box>
    </Modal>
  )
}

export default AddCpfCnpjModal
