const jwt = require("jsonwebtoken")

const isAuthenticated = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any
) => {
  try {
    if (!context.token) throw new Error("Token não informado")
    const authenticated = await verifyAuthenticated(context.token, context)
    if (!authenticated) throw new Error("Usuário não autenticado")
    try {
      const result = await resolve(root, args, context, info)
      return result
    } catch (err: any) {
      throw new Error(err)
    }
  } catch (err: any) {
    console.log(err)
    throw new Error(err)
  }
}
const verifyAuthenticated = async (token: string, context: any) => {
  try {
    if (!token) throw new Error("Token não informado")

    const loggedUser = await jwt.verify(
      token.replace("Bearer ", ""),
      "privatekey"
    )
    if (!loggedUser) throw new Error("Usuário não autenticado")
    context.role = loggedUser.role
    return true
  } catch (err) {
    return false
  }
}
const generateToken = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any
) => {
  try {
    const { email, senha } = args
    if (!email || !senha) {
      throw new Error("Email, Senha e Regra são campos obrigatórios")
    }
    const token = await jwt.sign({ email }, "privatekey", {
      expiresIn: "24h"
    })
    const result = await resolve(root, args, context, info)
    if (!result)
      throw new Error("Usuário não encontrado")
    result.token = token
    return result
  } catch (err: any) {
    throw new Error(err)
  }
}

export { generateToken, isAuthenticated }
