<template>
  <div class="funnel-popup">
    <div class="funnel-popup-content">
      <h3>{{ isEditing ? 'Editar Funil' : 'Adicionar Novo Funil' }}</h3>
      <input v-model="localFunnel.name" placeholder="Nome do Funil" />
      <div class="popup-actions">
        <button @click="save" class="save-button">Salvar</button>
        <button @click="close" class="cancel-button">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FunnelPopup',
  props: {
    funnel: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localFunnel: { ...this.funnel },
    };
  },
  methods: {
    save() {
      this.$emit('save', this.localFunnel);
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.funnel-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.funnel-popup-content {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.funnel-popup-content h3 {
  margin-bottom: 16px;
}

.funnel-popup-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.save-button,
.cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #1976D2;
  color: white;
}

.cancel-button {
  background-color: #9E9E9E;
  color: white;
}
</style>
