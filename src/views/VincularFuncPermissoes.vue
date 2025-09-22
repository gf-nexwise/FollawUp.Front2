<template>
  <div>
    <MasterDetailPanel
      :items="funcionalidades"
      :selected-item="selectedFunc"
      master-title="Funcionalidades"
      master-icon="fas fa-puzzle-piece"
      detail-title="Permissões"
      detail-icon="fas fa-shield-alt"
      title-field="nome"
      description-field="descricao"
      add-button-text="Vincular Permissão"
      empty-state-title="Selecione uma Funcionalidade"
      empty-state-description="Escolha uma funcionalidade à esquerda para gerenciar suas permissões."
      detail-header-title="Gerenciar Permissões"
      @select="selectFuncionalidade"
      @add="showAddItemModal"
    >
      <template #detail-content>
        <div v-if="!funcionalidadePermissoes?.length" class="empty-state">
          <i class="fas fa-shield-alt"></i>
          <h3>Nenhuma permissão vinculada</h3>
          <p>Use o botão acima para vincular permissões a esta funcionalidade.</p>
        </div>

        <div v-else class="items-list">
          <div
            v-for="permissao in funcionalidadePermissoes"
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
import { FuncionalidadePermissaoService } from '@/modules/subscricao/planos/services/FuncionalidadePermissaoService'
import type { 
  IFuncionalidadeSelection, 
  IFuncionalidadeDetalhe,
  IFuncionalidadePermissao 
} from '@/modules/subscricao/planos/types/funcionalidade-permissao'

const { showNotification } = useNotification()
const funcionalidadePermissaoService = FuncionalidadePermissaoService.getInstance()

// Estado do componente
const funcionalidades = ref<IFuncionalidadeSelection[]>([])
const selectedFunc = ref<IFuncionalidadeDetalhe | null>(null)
const permissoes = ref<IFuncionalidadePermissao[]>([])
const showModal = ref(false)
const loading = ref(false)

const funcionalidadePermissoes = computed(() => 
  selectedFunc.value?.permissions || []
)

const availablePermissoes = computed(() => {
  if (!selectedFunc.value) return []
  const vinculadas = new Set(funcionalidadePermissoes.value.map(p => p.id))
  return permissoes.value.filter(p => !vinculadas.has(p.id))
})

const loadFuncionalidades = async () => {
  try {
    loading.value = true
    const response = await funcionalidadePermissaoService.listarSelection()
    funcionalidades.value = response.data
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

const selectFuncionalidade = async (funcionalidade: IFuncionalidadeSelection) => {
  try {
    loading.value = true
    const response = await funcionalidadePermissaoService.buscarPorId(funcionalidade.id)
    selectedFunc.value = response.data
  } catch (error) {
    console.error('Erro ao carregar detalhes da funcionalidade:', error)
    showNotification({
      type: 'error',
      message: 'Erro ao carregar detalhes da funcionalidade. Tente novamente mais tarde.'
    })
  } finally {
    loading.value = false
  }
}

const showAddItemModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAddPermissao = async (permissao: IFuncionalidadePermissao) => {
  if (selectedFunc.value) {
    try {
      await funcionalidadePermissaoService.vincularPermissao(selectedFunc.value.id, permissao.id)
      await selectFuncionalidade(selectedFunc.value)
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

const desvincularPermissao = async (permissaoId: string) => {
  if (selectedFunc.value && confirm('Tem certeza que deseja desvincular esta permissão?')) {
    try {
      await funcionalidadePermissaoService.desvincularPermissao(selectedFunc.value.id, permissaoId)
      await selectFuncionalidade(selectedFunc.value)
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

onMounted(loadFuncionalidades)
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