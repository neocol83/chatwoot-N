<template>
  <div class="help-settings">
    <h3 class="settings-title">Ajuda e Suporte</h3>

    <div class="faq-section">
      <h4>Perguntas Frequentes</h4>
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <h5 @click="toggleFaq(index)" class="faq-question">
          {{ faq.question }}
          <span class="toggle-icon">{{ faq.isOpen ? '−' : '+' }}</span>
        </h5>
        <p v-if="faq.isOpen" class="faq-answer">{{ faq.answer }}</p>
      </div>
    </div>

    <div class="tutorials-section">
      <h4>Tutoriais Rápidos</h4>
      <div v-for="(tutorial, index) in tutorials" :key="index" class="tutorial-item">
        <h5 @click="toggleTutorial(index)" class="tutorial-title">
          {{ tutorial.title }}
          <span class="toggle-icon">{{ tutorial.isOpen ? '−' : '+' }}</span>
        </h5>
        <div v-if="tutorial.isOpen" class="tutorial-content" v-html="tutorial.content"></div>
      </div>
    </div>

    <div class="support-section">
      <h4>Contato com o Suporte</h4>
      <p>Se você não encontrou a resposta que procura, entre em contato com nossa equipe de suporte:</p>
      <ul>
        <li>Email: suporte@seuapp.com</li>
        <li>Telefone: (11) 1234-5678</li>
        <li>Chat ao vivo: Disponível de segunda a sexta, das 9h às 18h</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpSettings',
  data() {
    return {
      faqs: [
        {
          question: 'Como adicionar um novo pedido ao Kanban?',
          answer: 'Para adicionar um novo pedido, clique no botão "Novo pedido" no canto superior direito da tela. Preencha as informações necessárias e o pedido será automaticamente adicionado à primeira coluna do Kanban.',
          isOpen: false
        },
        {
          question: 'Como personalizar as colunas do Kanban?',
          answer: 'Vá para a aba "Kanban" nas configurações. Lá você pode adicionar, remover ou editar as colunas existentes. Você também pode arrastar e soltar para reordenar as colunas.',
          isOpen: false
        },
        {
          question: 'Como usar os modelos de mensagem?',
          answer: 'Na aba "Modelos de Mensagens" das configurações, você pode criar modelos pré-definidos para cada etapa do processo. Ao responder a um cliente, você pode selecionar um modelo para agilizar a comunicação.',
          isOpen: false
        },
        // Adicione mais FAQs conforme necessário
      ],
      tutorials: [
        {
          title: 'Configurando seu primeiro fluxo de trabalho',
          content: `
            <ol>
              <li>Acesse as configurações do Kanban</li>
              <li>Defina suas colunas de acordo com seu processo</li>
              <li>Configure os tempos estimados para cada etapa</li>
              <li>Crie modelos de mensagem para cada estágio</li>
              <li>Salve suas configurações e comece a usar!</li>
            </ol>
          `,
          isOpen: false
        },
        {
          title: 'Otimizando o atendimento ao cliente',
          content: `
            <ul>
              <li>Use etiquetas para categorizar pedidos</li>
              <li>Configure notificações para pedidos atrasados</li>
              <li>Utilize a função de resposta rápida para mensagens comuns</li>
              <li>Analise as métricas do dashboard para identificar gargalos</li>
            </ul>
          `,
          isOpen: false
        },
        // Adicione mais tutoriais conforme necessário
      ]
    };
  },
  methods: {
    toggleFaq(index) {
      this.$set(this.faqs[index], 'isOpen', !this.faqs[index].isOpen);
    },
    toggleTutorial(index) {
      this.$set(this.tutorials[index], 'isOpen', !this.tutorials[index].isOpen);
    }
  }
};
</script>

<style lang="scss" scoped>
.help-settings {
  .settings-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .faq-section, .tutorials-section, .support-section {
    margin-bottom: 30px;

    h4 {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }

  .faq-item, .tutorial-item {
    margin-bottom: 15px;
    border-bottom: 1px solid var(--s-200);
    padding-bottom: 15px;

    &:last-child {
      border-bottom: none;
    }
  }

  .faq-question, .tutorial-title {
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toggle-icon {
      font-size: 20px;
    }
  }

  .faq-answer, .tutorial-content {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.5;
  }

  .support-section {
    ul {
      list-style-type: none;
      padding-left: 0;

      li {
        margin-bottom: 5px;
      }
    }
  }
}
</style>