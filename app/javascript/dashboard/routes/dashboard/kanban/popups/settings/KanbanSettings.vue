<template>
  <div class="kanban-settings">
    <h3>Configurações do Kanban</h3>
    <div class="settings-section">
      <h4>Estimativas de Tempo</h4>
      <div class="estimate-settings">
        <div class="estimate-input" v-for="(value, key) in estimativas" :key="key">
          <label :for="key">{{ getEstimateLabel(key) }}:</label>
          <input 
            :id="key" 
            v-model="estimativas[key]" 
            type="number" 
            min="0" 
            @input="handleEstimateChange"
          />
        </div>
      </div>
    </div>
    <div class="settings-section">
      <h4>Confirmação Automática</h4>
      <div class="switch-container">
        <label class="switch">
          <input type="checkbox" v-model="confirmacaoAutomatica" @change="handleConfirmacaoChange">
          <span class="slider round"></span>
        </label>
        <span>Ativar confirmação automática de pedidos</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KanbanSettings',
  data() {
    return {
      estimativas: {
        balcao: 15,
        delivery: 30,
        limiteAtraso: 10,
        capacidadeMaxima: 20
      },
      confirmacaoAutomatica: false,
    }
  },
  methods: {
    getEstimateLabel(key) {
      const labels = {
        balcao: 'Balcão (minutos)',
        delivery: 'Delivery (minutos)',
        limiteAtraso: 'Limite aceitável de atraso (minutos)',
        capacidadeMaxima: 'Capacidade máxima (pedidos)',
      };
      return labels[key] || key;
    },
    handleEstimateChange() {
      this.salvarEstimativas();
      this.$emit('settings-changed');
    },
    handleConfirmacaoChange() {
      this.toggleConfirmacaoAutomatica();
      this.$emit('settings-changed');
    },
    salvarEstimativas() {
      localStorage.setItem('estimativas', JSON.stringify(this.estimativas));
    },
    carregarEstimativas() {
      const savedEstimates = localStorage.getItem('estimativas');
      if (savedEstimates) {
        this.estimativas = JSON.parse(savedEstimates);
      }
    },
    toggleConfirmacaoAutomatica() {
      localStorage.setItem('confirmacaoAutomatica', JSON.stringify(this.confirmacaoAutomatica));
    },
    carregarConfirmacaoAutomatica() {
      const savedConfirmacao = localStorage.getItem('confirmacaoAutomatica');
      if (savedConfirmacao !== null) {
        this.confirmacaoAutomatica = JSON.parse(savedConfirmacao);
      }
    },
    getSettings() {
      return {
        estimativas: this.estimativas,
        confirmacaoAutomatica: this.confirmacaoAutomatica,
      };
    },
    saveSettings() {
      this.salvarEstimativas();
      this.toggleConfirmacaoAutomatica();
      // Emitir evento para atualizar o Kanban
      this.$root.$emit('update-kanban-settings', this.getSettings());
    },
  },
  mounted() {
    this.carregarEstimativas();
    this.carregarConfirmacaoAutomatica();
  },
}
</script>

<style lang="scss" scoped>
.kanban-settings {
  .settings-section {
    margin-bottom: 24px;
  }

  h4 {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .estimate-settings {
    display: grid;
    gap: 16px;
  }

  .estimate-input {
    display: flex;
    align-items: center;

    label {
      flex: 1;
      margin-right: 16px;
    }

    input {
      width: 80px;
      padding: 8px;
      border: 1px solid var(--s-200);
      border-radius: 4px;
    }
  }

  .switch-container {
    display: flex;
    align-items: center;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin-right: 16px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--w-500);
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }
}
</style>
