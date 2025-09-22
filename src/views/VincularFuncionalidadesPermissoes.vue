<template>
  <div>
    <MasterDetailPanel
      :items="funcionalidades"
      :selected-item="selectedFuncionalidade"
      :loading="loading"
      master-title="Funcionalidades"
      master-icon="fas fa-cogs"
      detail-title="Permissões"
      detail-icon="fas fa-shield-alt"
      add-button-text="Vincular Permissão"
      empty-state-title="Selecione uma Funcionalidade"
      empty-state-description="Escolha uma funcionalidade à esquerda para gerenciar suas permissões."
      detail-header-title="Gerenciar Permissões"
      :show-add-button="true"
      @select="selectFuncionalidade"
      @add="showAddItemModal"
    >
      <template #detail-content>
        <DetailContent
          :loading="loadingDetails"
          :items="funcionalidadePermissoes"
          :action-loading="loadingAction"
          empty-state-title="Nenhuma permissão vinculada"
          empty-state-description="Use o botão acima para vincular permissões a esta funcionalidade."
          empty-state-icon="fas fa-shield-alt"
          @desvincular="desvincularPermissao"
        />
      </template>
    </MasterDetailPanel>

    <AddItemModal
      v-if="showModal"
      title="Vincular Permissão"
      :available-items="availablePermissoes"
      @save="handleAddPermissao"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VincularFuncionalidadesPermissoes'
})
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotification } from '@/composables/useNotification'
import MasterDetailPanel from '@/components/ui/MasterDetail/MasterDetailPanel.vue'
import DetailContent from '@/components/ui/MasterDetail/DetailContent.vue'
import AddItemModal from '@/components/modals/AddItemModal.vue'
import { FuncionalidadePermissaoService } from '@/modules/subscricao/planos/services/FuncionalidadePermissaoService'
import type { 
  IFuncionalidadeSelection, 
  IFuncionalidadeDetalhe,
  IFuncionalidadePermissao 
} from '@/modules/subscricao/planos/types/funcionalidade-permissao'

type ListItem = {
  id: string | number
  [key: string]: any
}

const { showNotification } = useNotification()
const funcionalidadeService = FuncionalidadePermissaoService.getInstance()

// Estado do componente
const funcionalidades = ref<IFuncionalidadeSelection[]>([])
const selectedFuncionalidade = ref<IFuncionalidadeDetalhe | null>(null)
const permissoes = ref<IFuncionalidadePermissao[]>([])
const showModal = ref(false)
const loading = ref(true)
const loadingDetails = ref(false)
const loadingAction = ref(false)

// Computed properties
const funcionalidadePermissoes = computed(() => 
  selectedFuncionalidade.value?.permissions || []
)

const availablePermissoes = computed(() => {
  if (!selectedFuncionalidade.value) return []
  const vinculadas = new Set(funcionalidadePermissoes.value.map((p: IFuncionalidadePermissao) => p.id))
  return permissoes.value.filter((p: IFuncionalidadePermissao) => !vinculadas.has(p.id))
})

// Carrega todas as permissões disponíveis
const loadPermissoes = async () => {
  try {
    const permissoesList = await funcionalidadeService.listarPermissoesDisponiveis()
    permissoes.value = permissoesList
  } catch (error) {
    console.error('Erro ao carregar permissões:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar permissões. Tente novamente mais tarde.'
    })
  }
}

// Carrega a lista inicial de funcionalidades
const loadFuncionalidades = async () => {
  try {
    loading.value = true
    const response = await funcionalidadeService.listarSelection()
    funcionalidades.value = response.data || response
  } catch (error) {
    console.error('Erro ao carregar funcionalidades:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar funcionalidades. Tente novamente mais tarde.'
    })
  } finally {
    loading.value = false
  }
}

// Carrega os detalhes completos de uma funcionalidade específica
const selectFuncionalidade = async (funcionalidade: ListItem) => {
  if (!funcionalidade?.id) return
  
  try {
    loadingDetails.value = true
    const response = await funcionalidadeService.buscarPorId(funcionalidade.id.toString())
    selectedFuncionalidade.value = response.data || response
  } catch (error) {
    console.error('Erro ao carregar detalhes da funcionalidade:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar detalhes da funcionalidade. Tente novamente mais tarde.'
    })
  } finally {
    loadingDetails.value = false
  }
}

const showAddItemModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Vincula uma permissão a uma funcionalidade
const handleAddPermissao = async (permissao: IFuncionalidadePermissao) => {
  if (selectedFuncionalidade.value) {
    try {
      loadingAction.value = true
      await funcionalidadeService.vincularPermissao(selectedFuncionalidade.value.id, permissao.id)
      
      // Recarrega os detalhes da funcionalidade para atualizar a lista
      await selectFuncionalidade(selectedFuncionalidade.value)
      
      showNotification({
        type: 'success',
        message: 'Permissão vinculada com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao vincular permissão:', error)
      showNotification({
        type: 'error',
        message: 'Erro ao vincular permissão. Tente novamente mais tarde.'
      })
    } finally {
      loadingAction.value = false
    }
  }
  closeModal()
}

// Remove uma permissão de uma funcionalidade
const desvincularPermissao = async (permissaoId: string) => {
  if (selectedFuncionalidade.value && confirm('Tem certeza que deseja desvincular esta permissão?')) {
    try {
      loadingAction.value = true
      await funcionalidadeService.desvincularPermissao(selectedFuncionalidade.value.id, permissaoId)
      
      // Recarrega os detalhes da funcionalidade para atualizar a lista
      await selectFuncionalidade(selectedFuncionalidade.value)
      
      showNotification({
        type: 'success',
        message: 'Permissão desvinculada com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao desvincular permissão:', error)
      showNotification({
        type: 'error',
        message: 'Erro ao desvincular permissão. Tente novamente mais tarde.'
      })
    } finally {
      loadingAction.value = false
    }
  }
}

onMounted(async () => {
  await Promise.all([
    loadFuncionalidades(),
    loadPermissoes()
  ])
})
</script>

<style scoped>
/* Estilos específicos da view, se necessário */
</style>