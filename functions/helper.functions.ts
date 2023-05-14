export const detectScrollUp = (scrollY: number, prevScrollY: number) => {
  return scrollY < prevScrollY;
};
