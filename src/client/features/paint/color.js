import Color from 'color';

const toColor = (value, max) => {
  const h = value * 120 / max;
  const c = Color.hsl(h, 100, 50);
  return c.string();
};

export default toColor;
