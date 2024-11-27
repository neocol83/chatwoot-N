<template>
  <div class="print-config-popup">
    <h3>{{ $t('PRINT_CONFIG.TITLE') }}</h3>
    <form @submit.prevent="submitPrintConfig">
      <div class="form-section">
        <h4>{{ $t('PRINT_CONFIG.PRINTER_SETTINGS') }}</h4>
        <woot-input
          v-model="config.printer.printer_id"
          :label="$t('PRINT_CONFIG.PRINTER_ID')"
          :placeholder="$t('PRINT_CONFIG.PRINTER_ID_PLACEHOLDER')"
        />
        <woot-input
          v-model="config.printer.printer_type"
          :label="$t('PRINT_CONFIG.PRINTER_TYPE')"
          :placeholder="$t('PRINT_CONFIG.PRINTER_TYPE_PLACEHOLDER')"
        />
        <woot-input
          v-model="config.printer.connection_type"
          :label="$t('PRINT_CONFIG.CONNECTION_TYPE')"
          :placeholder="$t('PRINT_CONFIG.CONNECTION_TYPE_PLACEHOLDER')"
        />
        <woot-input
          v-model="config.printer.ip_address"
          :label="$t('PRINT_CONFIG.IP_ADDRESS')"
          :placeholder="$t('PRINT_CONFIG.IP_ADDRESS_PLACEHOLDER')"
        />
        <woot-input
          v-model.number="config.printer.port"
          :label="$t('PRINT_CONFIG.PORT')"
          :placeholder="$t('PRINT_CONFIG.PORT_PLACEHOLDER')"
          type="number"
        />
        <woot-input
          v-model.number="config.printer.paper_width"
          :label="$t('PRINT_CONFIG.PAPER_WIDTH')"
          :placeholder="$t('PRINT_CONFIG.PAPER_WIDTH_PLACEHOLDER')"
          type="number"
        />
      </div>
      <div class="form-section">
        <h4>{{ $t('PRINT_CONFIG.PRINT_SETTINGS') }}</h4>
        <woot-input
          v-model.number="config.settings.copies"
          :label="$t('PRINT_CONFIG.COPIES')"
          :placeholder="$t('PRINT_CONFIG.COPIES_PLACEHOLDER')"
          type="number"
        />
        <woot-select
          v-model="config.settings.alignment"
          :label="$t('PRINT_CONFIG.ALIGNMENT')"
          :placeholder="$t('PRINT_CONFIG.ALIGNMENT_PLACEHOLDER')"
          :options="alignmentOptions"
        />
        <woot-checkbox
          v-model="config.settings.cut_paper"
          :label="$t('PRINT_CONFIG.CUT_PAPER')"
        />
      </div>
      <div class="button-group">
        <woot-button type="submit">
          {{ $t('PRINT_CONFIG.PRINT') }}
        </woot-button>
        <woot-button variant="clear" @click="$emit('close')">
          {{ $t('PRINT_CONFIG.CANCEL') }}
        </woot-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PrintConfigPopup',
  props: {
    initialConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      config: {
        printer: {
          printer_id: '',
          printer_type: 'thermal',
          connection_type: 'network',
          ip_address: '',
          port: 9100,
          paper_width: 80,
        },
        settings: {
          copies: 1,
          alignment: 'center',
          cut_paper: true,
        },
      },
      alignmentOptions: [
        { value: 'left', label: this.$t('PRINT_CONFIG.ALIGNMENT_LEFT') },
        { value: 'center', label: this.$t('PRINT_CONFIG.ALIGNMENT_CENTER') },
        { value: 'right', label: this.$t('PRINT_CONFIG.ALIGNMENT_RIGHT') },
      ],
    };
  },
  created() {
    this.config = { ...this.config, ...this.initialConfig };
  },
  methods: {
    submitPrintConfig() {
      this.$emit('submit', this.config);
    },
  },
};
</script>

<style lang="scss" scoped>
.print-config-popup {
  padding: 1rem;
}

.form-section {
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
