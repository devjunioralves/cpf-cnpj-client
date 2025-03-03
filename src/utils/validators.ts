export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}

export const isFormValid = (
  username: string,
  email: string,
  password: string
) => {
  if (!username || !email || !password) {
    return { valid: false, message: "Todos os campos são obrigatórios" }
  }

  if (!isValidEmail(email)) {
    return { valid: false, message: "Email inválido" }
  }

  return { valid: true, message: "" }
}
