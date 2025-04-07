/**
 * Генерує всі можливі ранжування для заданої кількості елементів
 * @param {number} elementsCount - Кількість елементів
 * @returns {Array} - Масив усіх можливих ранжувань, кожне ранжування є масивом груп
 */
export const generateAllRankings = (elementsCount) => {
  // Якщо elementsCount = 0, повертаємо порожній масив
  if (elementsCount === 0) return [[]];

  // Отримуємо всі ранжування для elementsCount - 1
  const smallerRankings = generateAllRankings(elementsCount - 1);
  const result = [];

  // Для кожного меншого ранжування
  for (const ranking of smallerRankings) {
    // Додаємо новий елемент на кожну можливу позицію
    for (let i = 0; i <= ranking.length; i++) {
      // Додаємо як окремий елемент
      const newRanking = [
        ...ranking.slice(0, i),
        [elementsCount],
        ...ranking.slice(i),
      ];
      result.push(newRanking);

      // Додаємо з еквівалентністю до існуючих елементів
      if (i < ranking.length) {
        const newRankingWithEquivalence = [...ranking];
        newRankingWithEquivalence[i] = [
          ...newRankingWithEquivalence[i],
          elementsCount,
        ];
        result.push(newRankingWithEquivalence);
      }
    }
  }

  return result;
};

/**
 * Перетворює ранжування у читабельний формат
 * @param {Array} ranking - Ранжування у вигляді масиву масивів
 * @returns {string} - Ранжування у текстовому форматі
 */
export const formatRanking = (ranking) => {
  return ranking
    .map((group) => {
      if (group.length === 1) {
        return group[0];
      } else {
        return group
          .map((item) => `=${item}`)
          .join(",")
          .substring(1);
      }
    })
    .join(",");
};

/**
 * Підраховує кількість унікальних ранжувань для заданої кількості елементів
 * @param {number} n - Кількість елементів
 * @returns {number} - Кількість унікальних ранжувань
 */
export const countRankings = (n) => {
  // Використовуємо числа Стірлінга другого роду
  const stirling = Array(n + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));
  stirling[0][0] = 1;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      stirling[i][j] = j * stirling[i - 1][j] + stirling[i - 1][j - 1];
    }
  }

  // Сума добутків чисел Стірлінга на факторіали
  let sum = 0;
  for (let j = 1; j <= n; j++) {
    let factorial = 1;
    for (let k = 1; k <= j; k++) {
      factorial *= k;
    }
    sum += stirling[n][j] * factorial;
  }

  return sum;
};
