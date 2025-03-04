import {
  Alert,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"
import { isFormValid } from "../utils/validators"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState<string>("")
  const [feedbackSeverity, setFeedbackSeverity] = useState<"success" | "error">(
    "error"
  )
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const navigate = useNavigate()

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedUsername = e.target.value.replace(/[^a-zA-Z0-9_]/g, "")
    setUsername(formattedUsername)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { valid, message } = isFormValid(username, email, password)
    if (!valid) {
      setError(message)
      return
    }

    try {
      await registerUser(username, email, password)

      setFeedbackMessage("Registro realizado com sucesso!")
      setFeedbackSeverity("success")
      setOpenSnackbar(true)

      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFeedbackMessage(err.message)
      } else {
        setFeedbackMessage("Ocorreu um erro desconhecido.")
      }
      setFeedbackSeverity("error")
      setOpenSnackbar(true)
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro de Usuário
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nome de Usuário"
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                fullWidth
                required
                margin="normal"
                error={!!error}
                helperText={error && "Nome de usuário é obrigatório"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                error={!!error}
                helperText={error && "Email inválido"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                error={!!error}
                helperText={error && "Senha é obrigatória"}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={feedbackSeverity}
          sx={{ width: "100%" }}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Register
