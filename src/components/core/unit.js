export const px2rem = unit => {
  return `${(unit / 100) * 2}rem`;
};

// rem -> px
export const rem2px = unit => {
  return `${(unit * 100) / 2}px`;
};
