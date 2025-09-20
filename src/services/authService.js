// Dados mock para testes
const mockUsers = [
  {
    id: 1,
    email: 'admin@follawup.com',
    password: '123456',
    nome: 'Administrador',
    papel: 'admin'
  },
  {
    id: 2,
    email: 'gestor@follawup.com',
    password: '123456',
    nome: 'Gestor',
    papel: 'gestor'
  }
]

// Simula um delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  // Login
  async login(email, password) {
    await delay(800) // Simula delay de rede
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const { password: _, ...userWithoutPassword } = user
    const token = `mock-jwt-token-${Date.now()}`
    
    // Salva no localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword))
    
    return { user: userWithoutPassword, token }
  },

  // Logout
  async logout() {
    await delay(300)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },

  // Verifica se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  // Recupera usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Solicita redefinição de senha
  async requestPasswordReset(email) {
    await delay(1000)
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error('E-mail não encontrado')
    }
    // Em um caso real, enviaria um e-mail com o token
    return { message: 'E-mail de recuperação enviado com sucesso' }
  },

  // Valida token de redefinição
  async validateResetToken(token) {
    await delay(500)
    // Em um caso real, validaria o token no backend
    return token.startsWith('valid-token-')
  },

  // Redefine a senha
  async resetPassword(token, newPassword) {
    await delay(800)
    if (!token.startsWith('valid-token-')) {
      throw new Error('Token inválido ou expirado')
    }
    // Em um caso real, salvaria a nova senha no backend
    return { message: 'Senha alterada com sucesso' }
  }
}