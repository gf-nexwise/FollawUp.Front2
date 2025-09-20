import api from './api'

// Mock data
const mockAgrupadores = {
  FUNCIONALIDADE: [
    {
      id: 1,
      nome: 'Processos',
      descricao: 'Agrupador para funcionalidades relacionadas a gestão de processos',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    },
    {
      id: 2,
      nome: 'Documentos',
      descricao: 'Agrupador para funcionalidades de gestão documental',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    },
    {
      id: 3,
      nome: 'Audiências',
      descricao: 'Agrupador para funcionalidades de controle de audiências',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    },
    {
      id: 4,
      nome: 'Prazos',
      descricao: 'Agrupador para funcionalidades de controle de prazos',
      tipo: 'FUNCIONALIDADE',
      ativo: false
    },
    {
      id: 5,
      nome: 'Relatórios',
      descricao: 'Agrupador para funcionalidades de relatórios e dashboards',
      tipo: 'FUNCIONALIDADE',
      ativo: true
    }
  ],
  PERMISSAO: [
    {
      id: 6,
      nome: 'Acesso Básico',
      descricao: 'Agrupador para permissões de acesso básico ao sistema',
      tipo: 'PERMISSAO',
      ativo: true
    },
    {
      id: 7,
      nome: 'Gestão de Processos',
      descricao: 'Agrupador para permissões de gestão processual',
      tipo: 'PERMISSAO',
      ativo: true
    },
    {
      id: 8,
      nome: 'Gestão de Documentos',
      descricao: 'Agrupador para permissões de gestão documental',
      tipo: 'PERMISSAO',
      ativo: true
    },
    {
      id: 9,
      nome: 'Configurações',
      descricao: 'Agrupador para permissões de configuração do sistema',
      tipo: 'PERMISSAO',
      ativo: false
    },
    {
      id: 10,
      nome: 'Administração',
      descricao: 'Agrupador para permissões administrativas',
      tipo: 'PERMISSAO',
      ativo: true
    }
  ]
}

const agrupadoresService = {
  // Listar agrupadores
  listar: async (tipo) => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Em produção, seria:
    // const response = await api.get(`/agrupadores?tipo=${tipo}`)
    // return response.data
    
    return mockAgrupadores[tipo] || []
  },

  // Criar agrupador
  criar: async (agrupador) => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Em produção, seria:
    // const response = await api.post('/agrupadores', agrupador)
    // return response.data
    
    const novoAgrupador = {
      ...agrupador,
      id: Date.now() // Simula um ID único
    }
    
    mockAgrupadores[agrupador.tipo].push(novoAgrupador)
    return novoAgrupador
  },

  // Atualizar agrupador
  atualizar: async (id, agrupador) => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Em produção, seria:
    // const response = await api.put(`/agrupadores/${id}`, agrupador)
    // return response.data
    
    const lista = mockAgrupadores[agrupador.tipo]
    const index = lista.findIndex(a => a.id === id)
    
    if (index !== -1) {
      lista[index] = { ...lista[index], ...agrupador }
      return lista[index]
    }
    
    throw new Error('Agrupador não encontrado')
  },

  // Excluir agrupador
  excluir: async (id, tipo) => {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Em produção, seria:
    // await api.delete(`/agrupadores/${id}`)
    
    const lista = mockAgrupadores[tipo]
    const index = lista.findIndex(a => a.id === id)
    
    if (index !== -1) {
      lista.splice(index, 1)
      return true
    }
    
    throw new Error('Agrupador não encontrado')
  }
}

export default agrupadoresService