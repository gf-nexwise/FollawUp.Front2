import { ref, computed } from 'vue'
import type { User, AuthState } from '@/types/auth'

// Estado inicial da autenticação
const authState = ref<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false
})

export function useAuth() {
  // Por enquanto, vamos apenas simular um usuário logado
  if (!authState.value.user) {
    authState.value = {
      user: {
        id: 1,
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        perfil: 'admin'
      },
      token: 'fake-token',
      isAuthenticated: true
    }
  }

  const user = computed(() => authState.value.user)
  const isAuthenticated = computed(() => authState.value.isAuthenticated)

  const logout = async () => {
    authState.value = {
      user: null,
      token: null,
      isAuthenticated: false
    }
    // TODO: Implementar lógica de logout
  }

  return {
    user,
    isAuthenticated,
    logout
  }
}