export const convertVelues = (howMuch: number, from: number, to: number) => {
  if (!howMuch || !from || !to) {
    return undefined;
  }
  return howMuch * (to / from);
};
