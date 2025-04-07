/**
 * Генерує всі перестановки для заданого масиву
 */
export const generatePermutations = (array) => {
  if (array.length === 0) return [[]];
  const result = [];

  array.forEach((item, index) => {
    const rest = array.slice(0, index).concat(array.slice(index + 1));
    const permutations = generatePermutations(rest);
    permutations.forEach((permutation) => {
      result.push([item].concat(permutation));
    });
  });

  return result;
};
