import {
  Alert,
  Box,
  Button,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import CpfCnpjService, { CpfCnpj } from "../services/cpfCnpjService"

const applyMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, "")

  if (cleanValue.length <= 11) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  if (cleanValue.length <= 14) {
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    )
  }

  return value
}

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
  const [feedbackMessage, setFeedbackMessage] = useState<string>("")
  const [feedbackSeverity, setFeedbackSeverity] = useState<"success" | "error">(
    "success"
  )
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(() => {
    const cleanNumber = number.replace(/\D/g, "")
    if (cleanNumber.length === 11) {
      setType("CPF")
    } else if (cleanNumber.length === 14) {
      setType("CNPJ")
    }
  }, [number])

  const handleSubmit = async () => {
    try {
      if (token) {
        await CpfCnpjService.create(number, type, token)

        const updatedCpfs = await CpfCnpjService.getAll(token)

        setCpfCnpjs(updatedCpfs)

        setFeedbackMessage("Cadastro realizado com sucesso!")
        setFeedbackSeverity("success")
      } else {
        setFeedbackMessage("Erro: Token inválido.")
        setFeedbackSeverity("error")
      }
    } catch {
      setFeedbackMessage("Erro ao cadastrar CPF/CNPJ.")
      setFeedbackSeverity("error")
    } finally {
      setOpenSnackbar(true)
      setNumber("")
      onClose()
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 14) {
      setNumber(applyMask(value))
    }
  }

  return (
    <>
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
            onChange={handleNumberChange}
          />

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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={feedbackSeverity}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AddCpfCnpjModal
