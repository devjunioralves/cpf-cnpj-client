import api from "./api"

export interface CpfCnpj {
  id: string
  number: string
  type: "CPF" | "CNPJ"
  blocked: boolean
}

const CpfCnpjService = {
  async getAll(token: string): Promise<CpfCnpj[]> {
    const response = await api.get("/cpf-cnpj/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  async block(id: string, token: string): Promise<void> {
    await api.post(
      `/cpf-cnpj/block`,
      { id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  },

  async create(
    number: string,
    type: "CPF" | "CNPJ",
    token: string
  ): Promise<CpfCnpj> {
    const response = await api.post(
      "/cpf-cnpj/",
      { number, type },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data
  },
}

export default CpfCnpjService
