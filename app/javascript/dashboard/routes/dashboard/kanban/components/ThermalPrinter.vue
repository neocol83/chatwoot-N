<template>
  <div class="thermal-printer">
    <button @click="printOrder" class="woot-button woot-button--sm print-button">
      <fluent-icon icon="print" />
      {{ $t('KANBAN.PRINT_ORDER') }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ThermalPrinter',
  computed: {
    ...mapGetters({
      currentConversation: 'getSelectedChat',
    }),
  },
  methods: {
    async printOrder() {
      try {
        const orderData = this.prepareOrderData();
        const printerConfig = this.getPrinterConfig();
        await this.sendPrintRequest(orderData, printerConfig);
        this.$toast.success(this.$t('KANBAN.PRINT_SUCCESS'));
      } catch (error) {
        this.$toast.error(this.$t('KANBAN.PRINT_ERROR'));
        console.error('Erro ao imprimir:', error);
      }
    },
    prepareOrderData() {
      const { id, meta, messages } = this.currentConversation;
      return {
        order_id: id,
        customer: meta.sender ? meta.sender.name : 'Cliente',
        items: this.getOrderItems(messages),
        total_amount: this.calculateTotalAmount(messages),
        timestamp: new Date().toISOString(),
      };
    },
    getOrderItems(messages) {
      // Implemente a lógica para extrair os itens do pedido das mensagens
      return [];
    },
    calculateTotalAmount(messages) {
      // Implemente a lógica para calcular o valor total do pedido
      return 0;
    },
    getPrinterConfig() {
      return this.$store.getters['settings/getPrinterSettings'];
    },
    async sendPrintRequest(orderData, printerConfig) {
      // Aqui você implementaria a chamada real para a API de impressão
      console.log('Enviando pedido para impressão:', { orderData, printerConfig });
    },
  },
};
</script>

<style lang="scss" scoped>
.thermal-printer {
  margin-bottom: 1rem;
}

.print-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
