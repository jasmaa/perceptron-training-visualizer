/**
 * Generate data points
 * 
 * @param {String} type Type of data to generate
 * @param {Integer} nData Number of data points
 */
export function generateData(type, nData) {
  switch (type) {
    case 'linear':
      return [...Array(nData)].map((_, i) => {
        return i > nData / 2
          ? [[Math.random() - 4, Math.random()], -1]
          : [[Math.random() + 4, Math.random()], 1]
      });
    case 'circle':
      return [...Array(nData)].map((_, i) => {
        const theta = 2 * Math.PI * Math.random();
        return i > nData / 2
          ? [[Math.cos(theta), Math.sin(theta)], -1]
          : [[2 * Math.cos(theta), 2 * Math.sin(theta)], 1]
      });
    case 'random':
      return [...Array(nData)].map(() => [[Math.random(), Math.random()], Math.random() > 0.5 ? -1 : 1]);
    default:
      return [];
  }
}
