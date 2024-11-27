<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <h2>Exportar Dados</h2>
      <div class="export-options">
        <button @click="exportCSV" class="export-button">Exportar CSV</button>
        <button @click="exportPDF" class="export-button">Exportar PDF</button>
        <button @click="exportExcel" class="export-button">Exportar Excel</button>
      </div>
      <button @click="$emit('close')" class="close-button">Fechar</button>
    </div>
  </div>
</template>

<script>
import { exportToCSV, exportToPDF, exportToExcel } from '../../utils/exportUtils';

export default {
  name: 'ExportPopup',
  methods: {
    exportCSV() {
      exportToCSV(this.$store.state.dashboard.data, 'dashboard_data');
      this.$emit('close');
    },
    exportPDF() {
      exportToPDF(this.$store.state.dashboard.data, 'dashboard_data');
      this.$emit('close');
    },
    exportExcel() {
      exportToExcel(this.$store.state.dashboard.data, 'dashboard_data');
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.export-button, .close-button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-button {
  background-color: var(--w-500);
  color: white;
}

.close-button {
  background-color: var(--s-200);
  color: var(--s-700);
  margin-top: 20px;
}
</style>
