<template>
  <div class="advanced-settings">
    <h3 class="settings-title">Configurações Avançadas</h3>

    <!-- Webhooks -->
    <div class="settings-section">
      <h4>Webhooks</h4>
      <div v-for="(webhook, index) in webhooks" :key="index" class="webhook-item">
        <input v-model="webhook.url" type="text" placeholder="URL do Webhook" />
        <select v-model="webhook.event">
          <option value="">Selecione um evento</option>
          <option value="pedido_criado">Pedido Criado</option>
          <option value="pedido_atualizado">Pedido Atualizado</option>
          <option value="pedido_concluido">Pedido Concluído</option>
          <option value="etapa_alterada">Etapa Alterada</option>
        </select>
        <button @click="removeWebhook(index)" class="remove-button">Remover</button>
      </div>
      <button @click="addWebhook" class="add-button">Adicionar Webhook</button>
    </div>

    <!-- Funcionalidades -->
    <div class="settings-section">
      <h4>Funcionalidades</h4>
      <div class="feature-toggle">
        <label>
          <input type="checkbox" v-model="features.autoAssign" />
          Atribuição automática de pedidos
        </label>
      </div>
      <div class="feature-toggle">
        <label>
          <input type="checkbox" v-model="features.customerRating" />
          Avaliação do cliente
        </label>
      </div>
      <div class="feature-toggle">
        <label>
          <input type="checkbox" v-model="features.deliveryTracking" />
          Rastreamento de entrega
        </label>
      </div>
      <div class="feature-toggle">
        <label>
          <input type="checkbox" v-model="features.autoConfirmation" />
          Confirmação automática de pedidos
        </label>
      </div>
    </div>

    <!-- Configurações de Notificação -->
    <div class="settings-section">
      <h4>Notificações</h4>
      <div class="notification-setting">
        <label>
          <input type="checkbox" v-model="notifications.email" />
          Notificações por e-mail
        </label>
      </div>
      <div class="notification-setting">
        <label>
          <input type="checkbox" v-model="notifications.push" />
          Notificações push
        </label>
      </div>
      <div class="notification-setting">
        <label>
          <input type="checkbox" v-model="notifications.sms" />
          Notificações por SMS
        </label>
      </div>
    </div>

    <!-- Configurações de API -->
    <div class="settings-section">
      <h4>API</h4>
      <button @click="regenerateApiKey" class="api-button">Regenerar Chave de API</button>
      <p v-if="apiKey">Sua chave de API: {{ apiKey }}</p>
    </div>

    <!-- Configurações de Integração -->
    <div class="settings-section">
      <h4>Integrações</h4>
      <div class="integration-toggle">
        <label>
          <input type="checkbox" v-model="integrations.googleMaps" />
          Google Maps (para rastreamento de entrega)
        </label>
      </div>
      <div class="integration-toggle">
        <label>
          <input type="checkbox" v-model="integrations.paymentGateway" />
          Gateway de Pagamento
        </label>
      </div>
    </div>

    <!-- Configurações de Backup -->
    <div class="settings-section">
      <h4>Backup e Restauração</h4>
      <button @click="backupData" class="backup-button">Fazer Backup dos Dados</button>
      <input type="file" @change="restoreData" ref="fileInput" style="display: none;" />
      <button @click="$refs.fileInput.click()" class="restore-button">Restaurar Dados</button>
    </div>

    <!-- Botão de Salvar -->
    <button @click="saveSettings" class="save-button">Salvar Configurações</button>
  </div>
</template>

<script>
export default {
  name: 'AdvancedSettings',
  data() {
    return {
      webhooks: [],
      features: {
        autoAssign: false,
        customerRating: false,
        deliveryTracking: false,
        autoConfirmation: false,
      },
      notifications: {
        email: false,
        push: false,
        sms: false,
      },
      integrations: {
        googleMaps: false,
        paymentGateway: false,
      },
      apiKey: null,
    };
  },
  methods: {
    addWebhook() {
      this.webhooks.push({ url: '', event: '' });
    },
    removeWebhook(index) {
      this.webhooks.splice(index, 1);
    },
    regenerateApiKey() {
      // Aqui você implementaria a lógica para gerar uma nova chave de API
      this.apiKey = 'nova-chave-api-' + Date.now();
    },
    backupData() {
      // Implementar lógica de backup
      console.log('Iniciando backup dos dados...');
    },
    restoreData(event) {
      // Implementar lógica de restauração
      console.log('Restaurando dados do arquivo:', event.target.files[0]);
    },
    saveSettings() {
      // Aqui você implementaria a lógica para salvar as configurações
      console.log('Salvando configurações avançadas:', {
        webhooks: this.webhooks,
        features: this.features,
        notifications: this.notifications,
        integrations: this.integrations,
        apiKey: this.apiKey,
      });
      // Emitir um evento para notificar o componente pai
      this.$emit('settings-saved');
    },
  },
};
</script>

<style lang="scss" scoped>
.advanced-settings {
  .settings-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .settings-section {
    margin-bottom: 30px;

    h4 {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }

  .webhook-item {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    input, select {
      flex: 1;
      padding: 5px;
    }
  }

  .feature-toggle, .notification-setting, .integration-toggle {
    margin-bottom: 10px;
  }

  .add-button, .api-button, .backup-button, .restore-button, .save-button {
    background-color: var(--w-500);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
      background-color: var(--w-600);
    }
  }

  .remove-button {
    background-color: var(--r-500);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: var(--r-600);
    }
  }
}
</style>
