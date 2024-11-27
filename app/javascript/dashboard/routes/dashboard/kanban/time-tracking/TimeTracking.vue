<template>
  <div class="time-tracking">
    <h2>Rastreio de Tempo</h2>
    <div v-if="Object.keys(pedidosComTempo).length === 0" class="no-data">
      Nenhum dado de rastreio de tempo disponível.
    </div>
    <table v-else class="time-tracking-table">
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Aguardando confirmação</th>
          <th>Em preparação</th>
          <th>Pronto para entrega</th>
          <th>A caminho</th>
          <th>Tempo Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pedido, id) in pedidosComTempo" :key="id">
          <td>#{{ id }}</td>
          <td>{{ formatTempo(pedido.pendente || 0) }}</td>
          <td>{{ formatTempo(pedido.preparacao || 0) }}</td>
          <td>{{ formatTempo(pedido.pronto || 0) }}</td>
          <td>{{ formatTempo(pedido['a-caminho'] || 0) }}</td>
          <td>{{ formatTempo(calcularTempoTotal(pedido)) }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="resetLocalStorage" class="reset-button">
      Zerar Dados de Tempo
    </button>
  </div>
</template>

<script>
export default {
  name: 'TimeTracking',
  data() {
    return {
      pedidosComTempo: {}
    };
  },
  mounted() {
    this.carregarDadosDoLocalStorage();
  },
  methods: {
    carregarDadosDoLocalStorage() {
      const dadosSalvos = localStorage.getItem('pedidosTempoRastreio');
      if (dadosSalvos) {
        this.pedidosComTempo = JSON.parse(dadosSalvos);
      }
    },
    formatTempo(segundos) {
      const minutos = Math.floor(segundos / 60);
      const segundosRestantes = segundos % 60;
      return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    },
    calcularTempoTotal(pedido) {
      return Object.values(pedido).reduce((total, tempo) => total + tempo, 0);
    },
    resetLocalStorage() {
      // Remove todos os itens do localStorage que começam com 'timer_'
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('timer_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Remove o item 'rastreioTempo'
      localStorage.removeItem('rastreioTempo');

      // Atualiza a página para refletir as mudanças
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.time-tracking {
  padding: 20px;
}

.no-data {
  text-align: center;
  color: #666;
  margin-top: 20px;
}

.time-tracking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #f0f4f8;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f0f0f0;
  }
}

.reset-button {
  @apply bg-woot-500 text-white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    @apply bg-woot-600;
  }
}
</style>