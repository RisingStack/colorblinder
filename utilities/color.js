export const generateRGB = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return { r, g, b };
};

export const mutateRGB = ({ r, g, b }) => {
  const newR = r + Math.floor(Math.random() * 20) + 10;
  const newG = g + Math.floor(Math.random() * 20) + 10;
  const newB = b + Math.floor(Math.random() * 20) + 10;
  return { r: newR, g: newG, b: newB };
};

