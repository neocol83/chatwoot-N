<template>
  <div class="personalize-settings">
    <h2 class="settings-title">Personalizar Tema</h2>
    <p class="settings-flag">É necessário recarregar a página para ver alterações.</p>
    <div class="theme-options">
      <div 
        class="theme-option"
        :class="{ 'theme-option-active': selectedTheme === 'color' }"
        @click="selectTheme('color')"
      >
        <div class="theme-preview color-theme" :style="{ backgroundColor: previewColor }">
          <span class="theme-title">Color Theme</span>
          <span class="theme-description">Tema colorido e vibrante</span>
          <div class="color-palette">
            <div v-for="shade in colorShades" :key="shade" :style="{ backgroundColor: shade }" class="color-shade"></div>
          </div>
        </div>
        <span class="theme-label">Color</span>
        <button @click.stop="openColorPicker" class="custom-color-button">
          <span class="color-preview" :style="{ backgroundColor: selectedColor || defaultWootColor }"></span>
          Escolher cor personalizada
        </button>
        <input 
          ref="colorPicker"
          type="color" 
          :value="selectedColor || defaultWootColor"
          @input="handleColorChange"
          class="color-picker-input"
          style="position: absolute; opacity: 0; pointer-events: none;"
        >
      </div>
      <div 
        class="theme-option"
        :class="{ 'theme-option-active': selectedTheme === 'light' }"
        @click="selectTheme('light')"
      >
        <div class="theme-preview light-theme">
          <span class="theme-title">Light Theme</span>
          <span class="theme-description">Tema claro e minimalista</span>
        </div>
        <span class="theme-label">Light</span>
      </div>
    </div>
  </div>
</template>

<script>
import { updateThemeColor, setColorTheme } from 'dashboard/helper/themeHelper';
import colors from 'dashboard/assets/scss/tokens/colors';

export default {
  name: 'PersonalizeSettings',
  data() {
    return {
      currentTheme: 'color',
      selectedTheme: 'color',
      selectedColor: null,
      defaultWootColor: colors.woot[500],
      colorShades: [],
    };
  },
  computed: {
    previewColor() {
      return this.selectedColor || this.defaultWootColor;
    },
  },
  methods: {
    selectTheme(theme) {
      this.selectedTheme = theme;
      this.$emit('settings-changed');
    },
    handleColorChange(event) {
      const color = event.target.value;
      this.selectedColor = color;
      this.generateColorShades(color);
      this.$emit('settings-changed');
    },
    openColorPicker() {
      this.$refs.colorPicker.click();
    },
    generateColorShades(baseColor) {
      const shades = [25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      this.colorShades = shades.map(shade => {
        return this.adjustColor(baseColor, (shade - 500) / 1000);
      });
    },
    adjustColor(hex, factor) {
      hex = hex.replace(/^#/, '');
      let r = parseInt(hex.slice(0, 2), 16);
      let g = parseInt(hex.slice(2, 4), 16);
      let b = parseInt(hex.slice(4, 6), 16);
      r = Math.round(r * (1 + factor));
      g = Math.round(g * (1 + factor));
      b = Math.round(b * (1 + factor));
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    getSettings() {
      return {
        theme: this.selectedTheme,
        color: this.selectedColor,
      };
    },
    saveSettings() {
      if (this.selectedTheme === 'color') {
        setColorTheme(false);
        updateThemeColor(this.selectedColor || this.defaultWootColor);
        localStorage.setItem('kanbanColor', this.selectedColor || this.defaultWootColor);
      } else {
        setColorTheme(true);
      }
      localStorage.setItem('kanbanTheme', this.selectedTheme);
    },
  },
  mounted() {
    const savedTheme = localStorage.getItem('kanbanTheme') || 'color';
    const savedColor = localStorage.getItem('kanbanColor');
    
    this.currentTheme = savedTheme;
    this.selectedTheme = savedTheme;
    
    if (savedColor) {
      this.selectedColor = savedColor;
      this.generateColorShades(savedColor);
    }
  },
};
</script>

<style lang="scss" scoped>
.personalize-settings {
  .settings-title {
    font-size: 24px;
    color: #1F2937;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .settings-flag {
    font-size: 14px;
    color: #6B7280;
    margin-bottom: 24px;
  }

  .theme-options {
    display: flex;
    gap: 24px;
  }

  .theme-option {
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;
    
    &.theme-option-active {
      // A mudança de escala foi removida daqui
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

    .theme-title {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .theme-description {
      font-size: 12px;
      opacity: 0.8;
    }

    .color-palette {
      display: flex;
      width: 100%;
      height: 20px;
      margin-top: 8px;
      border-radius: 4px;
      overflow: hidden;
    }

    .color-shade {
      flex: 1;
    }
  }

  .theme-label {
    font-size: 14px;
    color: #4B5563;
    font-weight: 500;
    margin-top: 8px;
    display: block;
  }

  .custom-color-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    padding: 4px 8px;
    background-color: white;
    border: 1px solid #E5E7EB;
    border-radius: 4px;
    font-size: 12px;
    color: #4B5563;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #F3F4F6;
    }

    .color-preview {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 4px;
      border: 1px solid #E5E7EB;
    }
  }

  .color-picker-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
}

.settings-actions {
  margin-top: 20px;
  text-align: right;
}

.save-button {
  background-color: var(--w-500);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--w-600);
  }
}
</style>
