<script>
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import SettingsSection from 'dashboard/components/SettingsSection.vue';
import LoadingState from 'dashboard/components/widgets/LoadingState.vue';
import WootMessageEditor from '../../../../../components/widgets/WootWriter/Editor.vue';

export default {
  components: {
    WootMessageEditor,
    LoadingState,
    SettingsSection,
  },
  props: {
    inbox: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectedAgentBotId: null,
    };
  },
  computed: {
    ...mapGetters({
      agentBots: 'agentBots/getBots',
      uiFlags: 'agentBots/getUIFlags',
    }),
    activeAgentBot() {
      return this.$store.getters['agentBots/getActiveAgentBot'](this.inbox.id);
    },
  },
  watch: {
    activeAgentBot() {
      this.selectedAgentBotId = this.activeAgentBot.id;
    },
  },
  mounted() {
    this.$store.dispatch('agentBots/get');
    this.$store.dispatch('agentBots/fetchAgentBotInbox', this.inbox.id);
  },

  methods: {
    async updateActiveAgentBot() {
      try {
        await this.$store.dispatch('agentBots/setAgentBotInbox', {
          inboxId: this.inbox.id,
          // Added this to make sure that empty values are not sent to the API
          botId: this.selectedAgentBotId ? this.selectedAgentBotId : undefined,
        });
        useAlert(this.$t('AGENT_BOTS.BOT_CONFIGURATION.SUCCESS_MESSAGE'));
      } catch (error) {
        useAlert(this.$t('AGENT_BOTS.BOT_CONFIGURATION.ERROR_MESSAGE'));
      }
    },
    async disconnectBot() {
      try {
        await this.$store.dispatch('agentBots/disconnectBot', {
          inboxId: this.inbox.id,
        });
        useAlert(
          this.$t('AGENT_BOTS.BOT_CONFIGURATION.DISCONNECTED_SUCCESS_MESSAGE')
        );
      } catch (error) {
        useAlert(
          error?.message ||
            this.$t('AGENT_BOTS.BOT_CONFIGURATION.DISCONNECTED_ERROR_MESSAGE')
        );
      }
    },
  },
};
</script>

<template>
  <div class="mx-8">
    <LoadingState v-if="uiFlags.isFetching || uiFlags.isFetchingAgentBot" />
    <form
      v-else
      class="flex flex-wrap mx-0"
      @submit.prevent="updateActiveAgentBot"
    >
      <SettingsSection
        :title="$t('AGENT_BOTS.BOT_CONFIGURATION.TITLE')"
        :sub-title="$t('AGENT_BOTS.BOT_CONFIGURATION.DESC')"
      >
        <div class="w-3/5">
          <label>
            <select v-model="selectedAgentBotId">
              <option value="" disabled selected>
                {{ $t('AGENT_BOTS.BOT_CONFIGURATION.SELECT_PLACEHOLDER') }}
              </option>
              <option
                v-for="agentBot in agentBots"
                :key="agentBot.id"
                :value="agentBot.id"
              >
                {{ agentBot.name }}
              </option>
            </select>
          </label>
          <div class="button-container">
            <woot-submit-button
              :button-text="$t('AGENT_BOTS.BOT_CONFIGURATION.SUBMIT')"
              :loading="uiFlags.isSettingAgentBot"
            />
            <woot-button
              type="button"
              :disabled="!selectedAgentBotId"
              :loading="uiFlags.isDisconnecting"
              variant="smooth"
              color-scheme="alert"
              class="button--disconnect"
              @click="disconnectBot"
            >
              {{ $t('AGENT_BOTS.BOT_CONFIGURATION.DISCONNECT') }}
            </woot-button>
          </div>
        </div>
      </SettingsSection>
      <SettingsSection
        :title="$t('AGENT_BOTS.BOT_CONFIGURATION.AGENT_HELPER')"
        :sub-title="$t('AGENT_BOTS.BOT_CONFIGURATION.AGENT_HELPER_DESC')"
      >
        <div class="w-3/5 flex flex-col">
          <label>
            {{ $t('AGENT_BOTS.BOT_CONFIGURATION.AGENT_LABEL') }}
            <select v-model="selectedAgentHelperId">
              <option
              value="" disabled selected>
              {{ $t('AGENT_BOTS.BOT_CONFIGURATION.SELECT_AGENT_PLACEHOLDER') }}
              </option>
              <option>CareStack</option>
            </select>
          </label>
          <div class="button-container mb-3">
            <woot-button type="button" color-scheme="primary">
              {{ $t('AGENT_BOTS.BOT_CONFIGURATION.CREATE_AGENT') }}
            </woot-button>
            <woot-button type="button" color-scheme="primary" class="ml-2">
              {{ $t('AGENT_BOTS.BOT_CONFIGURATION.TRAIN_AGENT') }}
            </woot-button>
          </div>
        </div>
        <div class="editor-wrap">
          <label>
            {{ $t('AGENT_BOTS.BOT_CONFIGURATION.AGENT_HELPER_PROMPT') }}
          </label>
          <WootMessageEditor
            v-model="content"
            class="message-editor [&>div]:px-1"
            enable-variables
            :enable-canned-responses="false"
            :placeholder="$t('AGENT_BOTS.BOT_CONFIGURATION.AGENT_HELPER_PROMPT')"
          />
        </div>
        <woot-button type="button" color-scheme="primary">
          {{ $t('AGENT_BOTS.BOT_CONFIGURATION.UPDATE_PROMPT') }}
        </woot-button>
      </SettingsSection>
    </form>
  </div>
</template>

<style scoped lang="scss">
.button--disconnect {
  @apply ml-2;
}
::v-deep {
  .ProseMirror-menubar {
    @apply hidden;
  }

  .ProseMirror-woot-style {
    @apply min-h-[12.5rem];

    p {
      @apply text-base;
    }
  }
}
</style>
