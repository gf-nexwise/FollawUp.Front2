<template>
  <div>
    <div class="master-detail">
      <div class="master-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-puzzle-piece"></i> Funcionalidades
          </h3>
        </div>
        <div class="panel-body">
          <ul class="plan-list">
            <li
              v-for="funcionalidade in funcionalidades"
              :key="funcionalidade.id"
              :class="['plan-item', { active: selectedFunc && selectedFunc.id === funcionalidade.id }]"
              @click="selectFuncionalidade(funcionalidade)"
            >
              <div class="plan-info">
                <h4>{{ funcionalidade.nome }}</h4>
                <p v-if="funcionalidade.descricao">{{ funcionalidade.descricao }}</p>
              </div>
              <span :class="['status-badge', funcionalidade.ativo ? 'active' : 'inactive']">
                {{ funcionalidade.ativo ? 'Ativo' : 'Inativo' }}
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
            v-if="selectedFunc"
            class="btn btn-primary btn-sm"
            @click="showAddItemModal"
          >
            <i class="fas fa-plus"></i> Vincular Permissão
          </button>
        </div>
        <div class="panel-body">
          <div v-if="!selectedFunc" class="empty-state">
            <i class="fas fa-mouse-pointer"></i>
            <h3>Selecione uma Funcionalidade</h3>
            <p>Escolha uma funcionalidade à esquerda para gerenciar suas permissões.</p>
          </div>
          
          <div v-else>
            <div class="detail-header">
              <div>
                <div class="breadcrumb">
                  <span>{{ selectedFunc.nome }}</span>
                  <i class="fas fa-chevron-right"></i>
                  <span>Permissões</span>
                </div>
                <h2 class="detail-title">Gerenciar Permissões</h2>
              </div>
            </div>
            
            <div v-if="!funcPermissoes?.length" class="empty-state">
              <i class="fas fa-shield-alt"></i>
              <h3>Nenhuma permissão vinculada.</h3>
              <p>Use o botão acima para vincular permissões a esta funcionalidade.</p>
            </div>
            
            <div v-else class="items-list">
              <div
                v-for="permissao in funcPermissoes"
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

// Lista de funcionalidades (mockada por enquanto)
const funcionalidades = ref([
  { id: 1, nome: "Incluir processo", ativo: true },
  { id: 2, nome: "Alterar processo", ativo: true },
  { id: 3, nome: "Excluir processo", ativo: true },
  { id: 4, nome: "Gerar relatórios", ativo: true },
  { id: 5, nome: "Gerenciar usuários", ativo: true },
  { id: 6, nome: "Adicionar partes (autores, réus)", ativo: true },
  { id: 7, nome: "Alterar situação do processo", ativo: true },
  { id: 8, nome: "Integração API", ativo: true },
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

const selectedFunc = ref(null)
const showModal = ref(false)

// Mock de relacionamento entre funcionalidades e permissões
const funcionalidadePermissoes = ref({
  1: [2, 4], // Incluir processo requer listar processos e criar caso
  2: [2],    // Alterar processo requer listar processos
  4: [2, 9], // Gerar relatórios requer listar processos e obter acesso
})

// Permissões vinculadas à funcionalidade selecionada
const funcPermissoes = computed(() => {
  if (!selectedFunc.value) return []
  const permissoesIds = funcionalidadePermissoes.value[selectedFunc.value.id] || []
  return permissoes.value.filter(p => permissoesIds.includes(p.id))
})

// Permissões disponíveis para vincular (não vinculadas ainda)
const availablePermissoes = computed(() => {
  if (!selectedFunc.value) return []
  const permissoesIds = funcionalidadePermissoes.value[selectedFunc.value.id] || []
  return permissoes.value.filter(p => !permissoesIds.includes(p.id))
})

const selectFuncionalidade = (funcionalidade) => {
  selectedFunc.value = funcionalidade
}

const showAddItemModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleAddPermissao = (permissao) => {
  if (selectedFunc.value) {
    if (!funcionalidadePermissoes.value[selectedFunc.value.id]) {
      funcionalidadePermissoes.value[selectedFunc.value.id] = []
    }
    funcionalidadePermissoes.value[selectedFunc.value.id].push(permissao.id)
  }
  closeModal()
}

const desvincularPermissao = (permissaoId) => {
  if (selectedFunc.value && confirm('Desvincular esta permissão?')) {
    const permissoesIds = funcionalidadePermissoes.value[selectedFunc.value.id] || []
    funcionalidadePermissoes.value[selectedFunc.value.id] = permissoesIds.filter(id => id !== permissaoId)
  }
}
</script>