import type { IPermissao, IPermissaoFilter } from '../types';
import type { PagedResponse } from '@/types/api/base/responses';
import { BaseHttpService } from '@/services/base/BaseHttpService';

const mockPermissoes: IPermissao[] = [
    { id: 1, nome: 'Adicionar Assunto', key: 'processos:adicionar-assunto', descricao: 'Permite adicionar assuntos aos processos', ativo: true },
    { id: 2, nome: 'Listar Processos', key: 'processos:listar', descricao: 'Permite listar todos os processos', ativo: true },
    { id: 3, nome: 'Editar Processo', key: 'processos:editar', descricao: 'Permite editar processos existentes', ativo: true },
    { id: 4, nome: 'Criar Caso', key: 'casos:criar', descricao: 'Permite criar novos casos', ativo: true },
    { id: 5, nome: 'Editar Caso', key: 'casos:editar', descricao: 'Permite editar casos existentes', ativo: false },
    { id: 6, nome: 'Desvincular Processo', key: 'casos:desvincular-processo', descricao: 'Permite desvincular processos de casos', ativo: true },
    { id: 7, nome: 'Excluir Caso', key: 'casos:excluir', descricao: 'Permite excluir casos', ativo: false },
    { id: 8, nome: 'Criar Acesso', key: 'acesso:criar', descricao: 'Permite criar novos acessos', ativo: true },
    { id: 9, nome: 'Obter Acesso', key: 'acesso:obter', descricao: 'Permite obter informações de acesso', ativo: true },
    { id: 10, nome: 'Revogar Acesso', key: 'acesso:revogar', descricao: 'Permite revogar acessos existentes', ativo: false }
];

export class PermissoesService extends BaseHttpService {
    private static instance: PermissoesService;

    private constructor() {
        super('/api/permissoes');
    }

    public static getInstance(): PermissoesService {
        if (!PermissoesService.instance) {
            PermissoesService.instance = new PermissoesService();
        }
        return PermissoesService.instance;
    }

    async listarPaginado(filter: IPermissaoFilter): Promise<PagedResponse<IPermissao>> {
        // Mock implementation
        const { page = 1, pageSize = 10, sort } = filter;
        let filteredData = [...mockPermissoes];

        // Apply sorting
        if (sort) {
            const isDesc = sort.startsWith('-');
            const field = isDesc ? sort.substring(1) : sort;
            
            filteredData.sort((a: any, b: any) => {
                const comparison = a[field] > b[field] ? 1 : -1;
                return isDesc ? -comparison : comparison;
            });
        }

        // Apply pagination
        const start = (page - 1) * pageSize;
        const paginatedItems = filteredData.slice(start, start + pageSize);

        const totalPages = Math.ceil(mockPermissoes.length / pageSize);
        
        return {
            items: paginatedItems,
            totalItems: mockPermissoes.length,
            pageSize,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
        };
    }

    async criar(data: Omit<IPermissao, 'id'>): Promise<IPermissao> {
        const newPermissao = {
            ...data,
            id: Math.max(...mockPermissoes.map(p => p.id)) + 1
        };
        mockPermissoes.push(newPermissao);
        return newPermissao;
    }

    async atualizar(id: number, data: Partial<IPermissao>): Promise<void> {
        const index = mockPermissoes.findIndex(p => p.id === id);
        if (index !== -1) {
            mockPermissoes[index] = { ...mockPermissoes[index], ...data };
        }
    }

    async excluir(id: number): Promise<void> {
        const index = mockPermissoes.findIndex(p => p.id === id);
        if (index !== -1) {
            mockPermissoes.splice(index, 1);
        }
    }
}