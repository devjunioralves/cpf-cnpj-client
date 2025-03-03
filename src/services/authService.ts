import api from "./api"

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post("/api/register", {
      username,
      email,
      password,
    })
    return response
  } catch {
    throw new Error("Erro ao registrar usuário")
  }
}
