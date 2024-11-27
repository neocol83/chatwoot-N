<template>
  <div class="personalize-settings">
    <h3>Selecionar Tema</h3>
    <div class="theme-options">
      <div 
        class="theme-option"
        :class="{ active: currentTheme === 'color' }"
        @click="setTheme('color')"
      >
        <div class="theme-preview color-theme" :style="{ backgroundColor: previewColor }">
          <span class="placeholder-text">Color Theme Preview</span>
          <a href="#" @click.prevent="openColorPicker" class="choose-color-link">Escolher cor</a>
        </div>
        <span class="theme-label">Color</span>
      </div>
      <div 
        class="theme-option"
        :class="{ active: currentTheme === 'light' }"
        @click="setTheme('light')"
      >
        <div class="theme-preview light-theme">
          <span class="placeholder-text">Light Theme Preview</span>
        </div>
        <span class="theme-label">Light</span>
      </div>
    </div>
    <input 
      type="color" 
      ref="colorPicker" 
      :value="selectedColor || defaultWootColor"
      @input="handleColorChange"
      style="position: absolute; opacity: 0; pointer-events: none;"
    >
  </div>
</template>

<script>
import { updateThemeColor } from '../../../../helper/themeHelper';
import WootColorPicker from 'shared/components/ColorPicker';

export default {
  name: 'PersonalizeSettings',
  components: {
    WootColorPicker,
  },
  data() {
    return {
      currentTheme: 'color',
      selectedColor: null,
      defaultWootColor: 'var(--woot-500)',
    };
  },
  computed: {
    previewColor() {
      return this.selectedColor || this.defaultWootColor;
    },
  },
  mounted() {
    const savedTheme = localStorage.getItem('kanbanTheme');
    const savedColor = localStorage.getItem('kanbanColor');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme);
    }
    if (savedColor) {
      this.selectedColor = savedColor;
      this.handleColorChange({ target: { value: savedColor } });
    } else {
      // Se não houver cor salva, use a cor padrão do Woot
      this.handleColorChange({ target: { value: this.defaultWootColor } });
    }
  },
  methods: {
    setTheme(theme) {
      this.currentTheme = theme;
      localStorage.setItem('kanbanTheme', theme);
      this.applyTheme(theme);
    },
    applyTheme(theme) {
      if (theme === 'color') {
        document.documentElement.style.setProperty('--theme-color', this.previewColor);
      } else {
        document.documentElement.style.setProperty('--theme-color', '#1F93FF');
      }
      this.$root.$emit('themeChanged', theme);
    },
    openColorPicker(event) {
      event.preventDefault();
      this.$refs.colorPicker.click();
    },
    handleColorChange(event) {
      const color = event.target.value;
      this.selectedColor = color;
      localStorage.setItem('kanbanColor', color);
      updateThemeColor(color);
      this.applyTheme('color');
    },
  },
};
</script>

<style lang="scss" scoped>
.personalize-settings {
  padding: 16px;

  h3 {
    margin-bottom: 16px;
  }

  .theme-options {
    display: flex;
    gap: 24px;
  }
}

.theme-option {
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &.active {
    transform: scale(1.05);
  }
}

.theme-preview {
  width: 200px;
  height: 120px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 1px solid #E5E7EB;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.color-theme {
    color: white;
  }

  &.light-theme {
    background-color: #F3F4F6;
    color: #1F2937;
  }

  .placeholder-text {
    padding: 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.2);
    margin-bottom: 8px;
  }
}

.theme-label {
  font-size: 14px;
  color: #4B5563;
  font-weight: 500;
  margin-top: 8px;
  display: block;
}

.choose-color-link {
  color: white;
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
}
</style>
