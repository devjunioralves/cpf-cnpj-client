import api from "./api"

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/login", { username, password })
    return response.data.token
  } catch {
    throw new Error("Erro ao fazer login")
  }
}

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post("/register", { username, email, password })
    return response
  } catch {
    throw new Error("Erro ao registrar usuário")
  }
}
