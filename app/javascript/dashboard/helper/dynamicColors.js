export function generateColorShades(baseColor) {
  const shades = [25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return shades.reduce((acc, shade, index) => {
    const factor = (index - 5) / 10;
    acc[shade] = adjustColor(baseColor, factor);
    return acc;
  }, {});
}

function adjustColor(hex, factor) {
  // ... (mantenha a função adjustColor como está)
}

export function applyColorTheme(baseColor) {
  const colors = generateColorShades(baseColor);
  Object.entries(colors).forEach(([shade, color]) => {
    document.documentElement.style.setProperty(`--woot-${shade}`, color);
  });
  document.documentElement.style.setProperty('--theme-color', baseColor);
}
