<template>
  <div>
    <MasterDetailPanel
      :items="papeis"
      :selected-item="selectedPapel"
      :loading="loading"
      master-title="Papéis"
      master-icon="fas fa-user-tag"
      detail-title="Permissões"
      detail-icon="fas fa-shield-alt"

      add-button-text="Vincular Permissão"
      empty-state-title="Selecione um Papel"
      empty-state-description="Escolha um papel à esquerda para gerenciar suas permissões."
      detail-header-title="Gerenciar Permissões"
      :show-add-button="true"
      @select="selectPapel"
      @add="showAddItemModal"
    >
      <template #detail-content>
        <div v-if="!papelPermissoes?.length" class="empty-state">
          <i class="fas fa-shield-alt"></i>
          <h3>Nenhuma permissão vinculada</h3>
          <p>Use o botão acima para vincular permissões a este papel.</p>
        </div>
        
        <div v-else class="items-list">
          <div
            v-for="permissao in papelPermissoes"
            :key="permissao.id"
            class="item-row"
          >
            <div class="item-info">
              <div class="item-title">{{ permissao.nome }}</div>
              <div class="item-subtitle">{{ permissao.key }}</div>
              <div v-if="permissao.descricao" class="item-description">
                {{ permissao.descricao }}
              </div>
            </div>
            <div class="item-actions">
              <button
                class="btn btn-danger btn-sm"
                @click="desvincularPermissao(permissao.id)"
              >
                <i class="fas fa-unlink"></i>
              </button>
            </div>
          </div>
        </div>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotification } from '@/composables/useNotification'
import MasterDetailPanel from '@/components/ui/MasterDetail/MasterDetailPanel.vue'
import AddItemModal from '@/components/modals/AddItemModal.vue'
import { PapeisService } from '@/modules/controle-acesso/papeis/services/PapeisService'
import type { IPapelSelection, IPapelDetalhe } from '@/modules/controle-acesso/papeis/types'
import type { IPermissao } from '@/modules/controle-acesso/permissoes/types'

type ListItem = {
  id: string | number
  [key: string]: any
}

// Interface local para permissões vinculadas ao papel
interface IPapelPermissao {
  id: string
  nome: string
  descricao: string
  key: string
}

const { showNotification } = useNotification()
const papeisService = PapeisService.getInstance()

// Estado do componente
const papeis = ref<IPapelSelection[]>() // Inicializa como array vazio
const selectedPapel = ref<IPapelDetalhe | null>(null)
const permissoes = ref<IPapelPermissao[]>([])
const showModal = ref(false)
const loading = ref(true) // Começa como true para mostrar loading inicial
const loadingDetails = ref(false)

// Computed properties
const papelPermissoes = computed(() => 
  selectedPapel.value?.permissions || []
)

const availablePermissoes = computed(() => {
  if (!selectedPapel.value) return []
  const vinculadas = new Set(papelPermissoes.value.map(p => p.id))
  return permissoes.value.filter(p => !vinculadas.has(p.id))
})

// Carrega a lista inicial de papéis (apenas ID, Nome e Descrição)
const loadPapeis = async () => {
  try {
    loading.value = true
    const papeisList = await papeisService.listarSelection()
    papeis.value = papeisList
  } catch (error) {
    console.error('Erro ao carregar papéis:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar papéis. Tente novamente mais tarde.'
    })
  } finally {
    loading.value = false
  }
}

// Carrega os detalhes completos de um papel específico
const selectPapel = async (papel: ListItem) => {
  if (!papel?.id) return
  
  try {
    loadingDetails.value = true
    const response = await papeisService.buscarPorId(papel.id.toString())
    selectedPapel.value = response.data
  } catch (error) {
    console.error('Erro ao carregar detalhes do papel:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar detalhes do papel. Tente novamente mais tarde.'
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

// Vincula uma permissão a um papel
const handleAddPermissao = async (permissao: IPapelPermissao) => {
  if (selectedPapel.value) {
    try {
      await papeisService.vincularPermissao(selectedPapel.value.id, permissao.id)
      
      // Recarrega os detalhes do papel para atualizar a lista
      await selectPapel(selectedPapel.value)
      
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
    }
  }
  closeModal()
}

// Remove uma permissão de um papel
const desvincularPermissao = async (permissaoId: string) => {
  if (selectedPapel.value && confirm('Tem certeza que deseja desvincular esta permissão?')) {
    try {
      await papeisService.desvincularPermissao(selectedPapel.value.id, permissaoId)
      
      // Recarrega os detalhes do papel para atualizar a lista
      await selectPapel(selectedPapel.value)
      
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
    }
  }
}

onMounted(loadPapeis)
</script>

<style scoped>
.item-description {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}
</style>