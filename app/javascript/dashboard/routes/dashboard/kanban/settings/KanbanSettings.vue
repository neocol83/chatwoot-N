<template>
  <div class="kanban-settings">
    <h2>Configurações do Kanban</h2>
    <div class="estimate-settings">
      <h3>Estimativas de Tempo</h3>
      <div class="estimate-input">
        <label for="balcao-estimate">Balcão (minutos):</label>
        <input id="balcao-estimate" v-model="estimativas.balcao" type="number" min="0" @change="salvarEstimativas" />
      </div>
      <div class="estimate-input">
        <label for="delivery-estimate">Delivery (minutos):</label>
        <input id="delivery-estimate" v-model="estimativas.delivery" type="number" min="0" @change="salvarEstimativas" />
      </div>
      <div class="switch-container">
        <label class="switch">
          <input
            type="checkbox"
            v-model="confirmacaoAutomatica"
            @change="toggleConfirmacaoAutomatica"
          >
          <span class="slider round"></span>
        </label>
        <span class="switch-label">Confirmação automática</span>
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
        delivery: 30
      },
      confirmacaoAutomatica: false,
    };
  },
  mounted() {
    this.carregarEstimativas();
    this.carregarConfirmacaoAutomatica();
  },
  methods: {
    salvarEstimativas() {
      localStorage.setItem('estimativas', JSON.stringify(this.estimativas));
      this.$toast.success('Estimativas salvas com sucesso');
    },
    carregarEstimativas() {
      const savedEstimates = localStorage.getItem('estimativas');
      if (savedEstimates) {
        this.estimativas = JSON.parse(savedEstimates);
      }
    },
    toggleConfirmacaoAutomatica() {
      localStorage.setItem('confirmacaoAutomatica', JSON.stringify(this.confirmacaoAutomatica));
      this.$toast.success('Configuração de confirmação automática salva');
    },
    carregarConfirmacaoAutomatica() {
      const savedConfirmacao = localStorage.getItem('confirmacaoAutomatica');
      if (savedConfirmacao !== null) {
        this.confirmacaoAutomatica = JSON.parse(savedConfirmacao);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.kanban-settings {
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 8px;
}

h2, h3 {
  color: #2d3748;
  margin-bottom: 20px;
}

.estimate-settings {
  margin-bottom: 30px;
}

.estimate-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;

  label {
    min-width: 150px;
  }

  input {
    width: 80px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
  }
}

.switch-container {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
}

input:checked + .slider {
  background-color: #FF5500;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.switch-label {
  margin-left: 16px;
  font-size: 14px;
  color: #4a5568;
}
</style>