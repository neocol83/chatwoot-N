import { LocalStorage } from 'shared/helpers/localStorage';
import { LOCAL_STORAGE_KEYS } from 'dashboard/constants/localStorage';

export const setColorTheme = isOSOnDarkMode => {
  console.log('setColorTheme chamado, isOSOnDarkMode:', isOSOnDarkMode);
  const selectedColorScheme =
    LocalStorage.get(LOCAL_STORAGE_KEYS.COLOR_SCHEME) || 'auto';
  console.log('Esquema de cor selecionado:', selectedColorScheme);
  if (
    (selectedColorScheme === 'auto' && isOSOnDarkMode) ||
    selectedColorScheme === 'dark'
  ) {
    document.body.classList.add('dark');
    document.documentElement.setAttribute('style', 'color-scheme: dark;');
    console.log('Tema escuro aplicado');
  } else {
    document.body.classList.remove('dark');
    document.documentElement.setAttribute('style', 'color-scheme: light;');
    console.log('Tema claro aplicado');
  }
  
  // Aplicar a cor salva, independentemente do tema
  applySelectedColor();
};

export function updateThemeColor(selectedColor) {
  console.log('updateThemeColor chamado com cor:', selectedColor);
  const generatedShades = generateColorShades(selectedColor);
  
  Object.entries(generatedShades).forEach(([shade, color]) => {
    const cssVarName = `--color-woot-${shade}`;
    document.documentElement.style.setProperty(cssVarName, color);
    console.log(`Atualizando ${cssVarName} para ${color}`);
  });

  document.documentElement.style.setProperty('--theme-color', selectedColor);
  
  // Salvar a cor selecionada no localStorage
  LocalStorage.set(LOCAL_STORAGE_KEYS.SELECTED_COLOR, selectedColor);
  console.log('Cor selecionada salva no localStorage');
}

function generateColorShades(baseColor) {
  console.log('Gerando tons para a cor base:', baseColor);
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return {
    25: hslToHex(hsl.h, hsl.s, 95),
    50: hslToHex(hsl.h, hsl.s, 90),
    75: hslToHex(hsl.h, hsl.s, 85),
    100: hslToHex(hsl.h, hsl.s, 80),
    200: hslToHex(hsl.h, hsl.s, 70),
    300: baseColor,
    400: hslToHex(hsl.h, hsl.s, 45),
    500: hslToHex(hsl.h, hsl.s, 40),
    600: hslToHex(hsl.h, hsl.s, 35),
    700: hslToHex(hsl.h, hsl.s, 30),
    800: hslToHex(hsl.h, hsl.s, 25),
    900: hslToHex(hsl.h, hsl.s, 20),
  };
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function applySelectedColor() {
  const savedColor = LocalStorage.get(LOCAL_STORAGE_KEYS.SELECTED_COLOR);
  if (savedColor) {
    console.log('Aplicando cor salva:', savedColor);
    updateThemeColor(savedColor);
  } else {
    console.log('Nenhuma cor salva encontrada, usando cor padrão');
    updateThemeColor('#1F93FF'); // Cor padrão
  }
}

export function loadSavedThemeColor() {
  const savedTheme = LocalStorage.get(LOCAL_STORAGE_KEYS.SELECTED_THEME) || 'color';
  const savedColor = LocalStorage.get(LOCAL_STORAGE_KEYS.SELECTED_COLOR);

  if (savedTheme === 'color') {
    if (savedColor) {
      console.log('Aplicando cor salva:', savedColor);
      updateThemeColor(savedColor);
    } else {
      console.log('Nenhuma cor salva encontrada, usando cor padrão');
      updateThemeColor('#1F93FF'); // Cor padrão
    }
  } else {
    setColorTheme(true); // Aplica o tema light
  }

  return { savedTheme, savedColor };
}
