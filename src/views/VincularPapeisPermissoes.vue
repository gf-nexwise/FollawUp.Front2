<template>
  <div>
    <div class="master-detail">
      <div class="master-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-user-tag"></i> Papéis
          </h3>
        </div>
        <div class="panel-body">
          <ul class="plan-list">
            <li
              v-for="papel in papeis"
              :key="papel.id"
              :class="['plan-item', { active: selectedPapel && selectedPapel.id === papel.id }]"
              @click="selectPapel(papel)"
            >
              <div class="plan-info">
                <h4>{{ papel.nome }}</h4>
                <p>{{ papel.descricao }}</p>
              </div>
              <span :class="['status-badge', papel.ativo ? 'active' : 'inactive']">
                {{ papel.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="detail-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-shield-alt"></i> Permissões
          </h3>
          <button
            v-if="selectedPapel"
            class="btn btn-primary btn-sm"
            @click="showAddItemModal"
          >
            <i class="fas fa-plus"></i> Vincular Permissão
          </button>
        </div>
        <div class="panel-body">
          <div v-if="!selectedPapel" class="empty-state">
            <i class="fas fa-mouse-pointer"></i>
            <h3>Selecione um Papel</h3>
            <p>Escolha um papel à esquerda para gerenciar suas permissões.</p>
          </div>
          
          <div v-else>
            <div class="detail-header">
              <div>
                <div class="breadcrumb">
                  <span>{{ selectedPapel.nome }}</span>
                  <i class="fas fa-chevron-right"></i>
                  <span>Permissões</span>
                </div>
                <h2 class="detail-title">Gerenciar Permissões</h2>
              </div>
            </div>
            
            <div v-if="!papelPermissoes?.length" class="empty-state">
              <i class="fas fa-shield-alt"></i>
              <h3>Nenhuma permissão vinculada.</h3>
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
          </div>
        </div>
      </div>
    </div>

    <AddItemModal
      v-if="showModal"
      title="Vincular Permissão"
      :available-items="availablePermissoes"
      @save="handleAddPermissao"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AddItemModal from '@/components/modals/AddItemModal.vue'

// Lista de papéis (mockada por enquanto)
const papeis = ref([
  {
    id: 1,
    nome: 'Advogado(a) Gestor(a)',
    descricao: 'Supervisiona uma equipe...',
    ativo: true,
    permissoesIds: [2, 4, 6, 8]
  },
  {
    id: 2,
    nome: 'Advogado(a) Parceiro(a)',
    descricao: 'Atua em casos específicos.',
    ativo: true,
    permissoesIds: [2, 4]
  }
])

// Lista de todas as permissões disponíveis
const permissoes = ref([
  { id: 1, nome: 'Adicionar Assunto', key: 'processos:adicionar-assunto', descricao: '...', ativo: true },
  { id: 2, nome: 'Listar Processos', key: 'processos:listar', descricao: '...', ativo: true },
  { id: 4, nome: 'Criar Caso', key: 'casos:criar', descricao: '...', ativo: true },
  { id: 6, nome: 'Desvincular Processo', key: 'casos:desvincular-processo', descricao: '...', ativo: true },
  { id: 8, nome: 'Criar Acesso', key: 'acesso:criar', descricao: '...', ativo: true },
  { id: 9, nome: 'Obter Acesso', key: 'acesso:obter', descricao: '...', ativo: true }
])

const selectedPapel = ref(null)
const showModal = ref(false)

// Permissões vinculadas ao papel selecionado
const papelPermissoes = computed(() => {
  if (!selectedPapel.value) return []
  return permissoes.value.filter(p => 
    selectedPapel.value.permissoesIds.includes(p.id)
  )
})

// Permissões disponíveis para vincular (não vinculadas ainda)
const availablePermissoes = computed(() => {
  if (!selectedPapel.value) return []
  return permissoes.value.filter(p => 
    !selectedPapel.value.permissoesIds.includes(p.id)
  )
})

const selectPapel = (papel) => {
  selectedPapel.value = papel
}

const showAddItemModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAddPermissao = (permissao) => {
  if (selectedPapel.value) {
    selectedPapel.value.permissoesIds.push(permissao.id)
  }
  closeModal()
}

const desvincularPermissao = (permissaoId) => {
  if (selectedPapel.value && confirm('Desvincular esta permissão?')) {
    selectedPapel.value.permissoesIds = selectedPapel.value.permissoesIds.filter(id => id !== permissaoId)
  }
}
</script>