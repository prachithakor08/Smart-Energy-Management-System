export const generateTimeSeries = (payload, window = 120) => {
  return Array.from({ length: window }, () => ({ ...payload }));
};
