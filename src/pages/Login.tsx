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
import { useAuth } from "../context/AuthContext"
import { loginUser } from "../services/authService"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState<string>("")
  const [feedbackSeverity, setFeedbackSeverity] = useState<"success" | "error">(
    "error"
  )
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Todos os campos são obrigatórios")
      return
    }

    try {
      const token = await loginUser(username, password)
      login(token)

      setFeedbackMessage("Login realizado com sucesso!")
      setFeedbackSeverity("success")
      setOpenSnackbar(true)

      setTimeout(() => {
        navigate("/")
      }, 3000)
    } catch {
      setFeedbackMessage("Email ou senha incorretos")
      setFeedbackSeverity("error")
      setOpenSnackbar(true)
    }
  }

  const handleRegisterRedirect = () => {
    navigate("/register")
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
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nome de usuário"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                margin="normal"
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
                Entrar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="text"
                sx={{ backgroundColor: "secondary.main", color: "white" }}
                fullWidth
                onClick={handleRegisterRedirect}
              >
                Não tem uma conta? Cadastre-se
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

export default Login
