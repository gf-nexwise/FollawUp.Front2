import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const user = ref(authService.getCurrentUser())
const isLoading = ref(false)
const error = ref(null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)

  const login = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null
      const result = await authService.login(email, password)
      user.value = result.user
      router.push('/')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      await authService.logout()
      user.value = null
      router.push('/login')
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const requestPasswordReset = async (email) => {
    try {
      isLoading.value = true
      error.value = null
      const result = await authService.requestPasswordReset(email)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      isLoading.value = true
      error.value = null
      const result = await authService.resetPassword(token, newPassword)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const validateResetToken = async (token) => {
    try {
      isLoading.value = true
      error.value = null
      return await authService.validateResetToken(token)
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    validateResetToken
  }
}