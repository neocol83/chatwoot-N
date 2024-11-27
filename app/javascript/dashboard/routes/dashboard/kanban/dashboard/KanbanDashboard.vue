<template>
  <div class="kanban-dashboard-wrapper">
    <div class="kanban-dashboard bento-grid">
      <!-- Visão Geral -->
      <div class="bento-card overview">
        <div class="overview-header">
          <h3>Visão Geral</h3>
          <div class="dashboard-actions">
            <button @click="openExportPopup" class="action-button">
              <i class="icon ion-ios-download-outline"></i>
              Exportar
            </button>
            <button @click="openSettingsPopup" class="action-button">
              <i class="icon ion-ios-gear-outline"></i>
              Configurações
            </button>
            <button @click="refreshDashboard" class="action-button">
              <i class="icon ion-ios-refresh-outline"></i>
              Atualizar
            </button>
          </div>
        </div>
        <div class="stat-cards">
          <stat-card title="Total de Pedidos" :value="totalPedidos" icon="shopping-cart" color="blue" />
          <stat-card title="Em Andamento" :value="pedidosEmAndamento" icon="clock" color="orange" />
          <stat-card title="Concluídos" :value="pedidosConcluidos" icon="check-circle" color="green" />
          <stat-card title="Tempo Médio" :value="tempoMedioEntrega" icon="truck" color="purple" />
        </div>
      </div>

      <!-- Distribuição de Pedidos -->
      <div class="bento-card">
        <h3>Distribuição de Pedidos</h3>
        <pie-chart :data="distribuicaoPedidos" />
      </div>

      <!-- Pedidos por Hora -->
      <div class="bento-card">
        <h3>Pedidos por Hora</h3>
        <line-chart :data="pedidosPorHora" />
      </div>

      <!-- Desempenho da Equipe -->
      <div class="bento-card">
        <h3>Desempenho da Equipe</h3>
        <bar-chart :data="desempenhoEquipe" :horizontal="true" />
      </div>

      <!-- Itens Mais Vendidos -->
      <div class="bento-card">
        <h3>Itens Mais Vendidos</h3>
        <top-items-list :items="itensMaisVendidos" />
      </div>

      <!-- Tempo Médio por Etapa -->
      <div class="bento-card">
        <h3>Tempo Médio por Etapa</h3>
        <stage-time-chart :data="tempoMedioPorEtapa" :colors="stageColors" />
      </div>

      <!-- Capacidade Atual -->
      <div class="bento-card">
        <h3>Capacidade Atual</h3>
        <capacity-meter :current="pedidosEmAndamento" :max="capacidadeMaxima" />
        <div class="capacity-info">
          <div class="capacity-stat">
            <span class="stat-label">Pedidos em andamento:</span>
            <span class="stat-value">{{ pedidosEmAndamento }}</span>
          </div>
          <div class="capacity-stat">
            <span class="stat-label">Capacidade máxima:</span>
            <span class="stat-value">{{ capacidadeMaxima }}</span>
          </div>
          <div class="capacity-stat">
            <span class="stat-label">Utilização:</span>
            <span class="stat-value">{{ utilizacaoCapacidade }}%</span>
          </div>
          <div class="capacity-stat">
            <span class="stat-label">Pedidos restantes:</span>
            <span class="stat-value">{{ capacidadeMaxima - pedidosEmAndamento }}</span>
          </div>
          <div class="capacity-stat">
            <span class="stat-label">Tempo estimado para lotação:</span>
            <span class="stat-value">{{ tempoEstimadoLotacao }} min</span>
          </div>
        </div>
      </div>

      <!-- Pedidos Recentes -->
      <div class="bento-card">
        <h3>Pedidos Recentes</h3>
        <recent-orders-list :orders="pedidosRecentes" />
      </div>

      <!-- Avaliações dos Clientes -->
      <div class="bento-card">
        <h3>Avaliações dos Clientes</h3>
        <rating-distribution :ratings="avaliacoesClientes" :colors="ratingColors" />
      </div>
    </div>

    <!-- Export Popup -->
    <export-popup v-if="showExportPopup" @close="closeExportPopup" />

    <!-- Settings Popup -->
    <settings-popup v-if="showSettingsPopup" @close="closeSettingsPopup" />
  </div>
</template>

<script>
import StatCard from './components/StatCard.vue';
import PieChart from './charts/PieChart.vue';
import LineChart from './charts/LineChart.vue';
import BarChart from './charts/BarChart.vue';
import TopItemsList from './components/TopItemsList.vue';
import StageTimeChart from './charts/StageTimeChart.vue';
import CapacityMeter from './components/CapacityMeter.vue';
import RecentOrdersList from './components/RecentOrdersList.vue';
import RatingDistribution from './components/RatingDistribution.vue';
import ExportPopup from './popups/ExportPopup.vue';
import SettingsPopup from './popups/SettingsPopup.vue';

export default {
  name: 'KanbanDashboard',
  components: {
    StatCard,
    PieChart,
    LineChart,
    BarChart,
    TopItemsList,
    StageTimeChart,
    CapacityMeter,
    RecentOrdersList,
    RatingDistribution,
    ExportPopup,
    SettingsPopup,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    estimativas: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showExportPopup: false,
      showSettingsPopup: false,
      stageColors: {
        'pendente': '#fbbf24',
        'preparacao': '#fb923c',
        'pronto': '#4ade80',
        'a-caminho': '#60a5fa',
      },
      ratingColors: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
    };
  },
  computed: {
    totalPedidos() {
      return this.columns.reduce((total, column) => total + column.items.length, 0);
    },
    pedidosEmAndamento() {
      return this.columns.reduce((total, column) => {
        if (column.id !== 'pronto' && column.id !== 'a-caminho') {
          return total + column.items.length;
        }
        return total;
      }, 0);
    },
    pedidosConcluidos() {
      const prontoColumn = this.columns.find(col => col.id === 'pronto');
      const aCaminhoColumn = this.columns.find(col => col.id === 'a-caminho');
      return (prontoColumn ? prontoColumn.items.length : 0) + (aCaminhoColumn ? aCaminhoColumn.items.length : 0);
    },
    tempoMedioEntrega() {
      // Implementar lógica para calcular o tempo médio de entrega
      return '28min';
    },
    distribuicaoPedidos() {
      return this.columns.map(column => ({
        label: column.title,
        value: column.items.length
      }));
    },
    pedidosPorHora() {
      // Implementar lógica para calcular os pedidos por hora
      const horas = Array.from({ length: 24 }, (_, i) => i);
      return horas.map(hora => ({
        label: `${hora}:00`,
        value: Math.floor(Math.random() * 20) + 5 // Placeholder: valores aleatórios
      }));
    },
    desempenhoEquipe() {
      const atendentes = new Set(this.columns.flatMap(col => col.items.map(item => item.assignee)));
      return Array.from(atendentes).map(atendente => ({
        label: atendente || 'Não atribuído',
        value: this.columns.flatMap(col => col.items).filter(item => item.assignee === atendente).length
      }));
    },
    itensMaisVendidos() {
      // Implementar lógica para calcular os itens mais vendidos
      return [
        { name: 'X-Burger', quantity: 45 },
        { name: 'Batata Frita', quantity: 38 },
        { name: 'Refrigerante', quantity: 30 },
        { name: 'X-Salada', quantity: 25 },
        { name: 'Milk Shake', quantity: 20 },
      ];
    },
    tempoMedioPorEtapa() {
      // Implementar lógica para calcular o tempo médio por etapa
      return this.columns.map(column => ({
        label: column.title,
        value: Math.floor(Math.random() * 10) + 5 // Placeholder: valores aleatórios em minutos
      }));
    },
    pedidosRecentes() {
      return this.columns
        .flatMap(col => col.items)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          status: this.getColumnTitle(item),
          time: this.formatDate(item.created_at)
        }));
    },
    capacidadeMaxima() {
      return this.estimativas.capacidadeMaxima;
    },
    avaliacoesClientes() {
      // Implementar lógica para obter as avaliações dos clientes
      return [
        { rating: 5, count: 45 },
        { rating: 4, count: 30 },
        { rating: 3, count: 15 },
        { rating: 2, count: 7 },
        { rating: 1, count: 3 },
      ];
    },
    utilizacaoCapacidade() {
      return Math.round((this.pedidosEmAndamento / this.capacidadeMaxima) * 100);
    },
    tempoEstimadoLotacao() {
      const pedidosRestantes = this.capacidadeMaxima - this.pedidosEmAndamento;
      const tempoMedioPorPedido = 15; // Assumindo 15 minutos por pedido
      return pedidosRestantes * tempoMedioPorPedido;
    }
  },
  methods: {
    openExportPopup() {
      this.showExportPopup = true;
    },
    closeExportPopup() {
      this.showExportPopup = false;
    },
    openSettingsPopup() {
      this.showSettingsPopup = true;
    },
    closeSettingsPopup() {
      this.showSettingsPopup = false;
    },
    refreshDashboard() {
      // Implementar lógica de atualização do dashboard
      console.log('Atualizando dashboard...');
      // Aqui você pode chamar métodos para recarregar os dados ou emitir um evento para o componente pai
    },
    getColumnTitle(item) {
      const column = this.columns.find(col => col.items.includes(item));
      return column ? column.title : 'Desconhecido';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~dashboard/assets/scss/variables';

.kanban-dashboard-wrapper {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.kanban-dashboard {
  padding: $space-normal $space-normal $space-large $space-normal;
  background-color: var(--s-50);
  box-sizing: border-box;
  color: $color-body;
  font-family: inherit;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(250px, auto);
  gap: 24px;
}

.bento-card {
  background-color: var(--white);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 18px;
    color: var(--s-800);
    margin-bottom: 20px;
    font-weight: 600;
  }
}

.overview {
  grid-column: span 3;
  background-color: var(--b-50);
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1400px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .overview {
    grid-column: span 2;
  }
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .overview {
    grid-column: span 1;
  }
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Estilos personalizados para componentes filhos
::v-deep {
  .stat-card {
    background: var(--white);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .icon {
      color: var(--white);
      padding: 12px;
      border-radius: 50%;
      margin-bottom: 15px;
      display: inline-block;
    }

    h4 {
      color: var(--s-700);
      font-size: 14px;
      margin-bottom: 8px;
    }

    p {
      color: var(--s-900);
      font-size: 28px;
      font-weight: 700;
    }

    &.blue .icon { background-color: var(--b-500); }
    &.orange .icon { background-color: var(--o-500); }
    &.green .icon { background-color: var(--g-500); }
    &.purple .icon { background-color: var(--p-500); }
  }

  .pie-chart, .line-chart, .bar-chart, .stage-time-chart {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top-items-list, .recent-orders-list {
    flex-grow: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    .item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--s-100);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .capacity-meter {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .meter {
      height: 24px;
      border-radius: 12px;
      overflow: hidden;
      background-color: var(--s-100);

      .fill {
        background-color: var(--b-500);
      }
    }

    .capacity-info {
      margin-top: 10px;
      font-size: 14px;
      color: var(--s-700);
      display: flex;
      justify-content: space-between;
    }
  }

  .rating-distribution {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .rating-bar {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .stars {
        width: 80px;
        text-align: left;
        color: var(--y-500);
      }

      .bar {
        flex-grow: 1;
        height: 16px;
        background-color: var(--s-100);
        border-radius: 8px;
        overflow: hidden;
        margin: 0 10px;

        .fill {
          background-color: var(--y-500);
        }
      }

      .count {
        width: 40px;
        text-align: right;
        font-size: 14px;
        color: var(--s-700);
      }
    }
  }
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--s-100);
  border: none;
  border-radius: 4px;
  color: var(--s-700);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--s-200);
  }

  i {
    margin-right: 6px;
  }
}

.capacity-info {
  margin-top: 20px;
}

.capacity-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stat-label {
  color: var(--s-600);
}

.stat-value {
  font-weight: bold;
  color: var(--s-800);
}

// Estilos para a aba de Configurações
.settings-container {
  width: 100%;
  padding: 24px;
  background-color: #ffffff;
}

.settings-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.settings-tab-button {
  padding: 12px 24px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.active {
    @apply text-woot-500 border-b-2 border-woot-500;
    border-radius: 0;
  }

  &:hover:not(.active) {
    @apply text-woot-500;
  }
}

.settings-content {
  max-width: 1200px;
  margin: 0 auto;
  max-height: 600px;
  overflow-y: auto;
  padding: 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

// ... (outros estilos para a aba de Configurações) ...

</style>