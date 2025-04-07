/**
 * Генерує всі можливі ранжування для заданої кількості елементів
 * Використовує кешування для оптимізації
 * @param {number} elementsCount - Кількість елементів
 * @returns {Array} - Масив усіх можливих ранжувань
 */
const rankingsGenerationCache = new Map();

export const generateAllRankings = (elementsCount) => {
  // Перевіряємо кеш
  if (rankingsGenerationCache.has(elementsCount)) {
    return rankingsGenerationCache.get(elementsCount);
  }

  // Для невеликих значень використовуємо попередньо обчислені значення
  if (elementsCount <= 0) return [[]];
  if (elementsCount === 1) return [[[1]]];
  if (elementsCount === 2) {
    return [[[1], [2]], [[2], [1]], [[1, 2]]];
  }

  // Для більших значень використовуємо рекурсію з кешуванням
  const smallerRankings = generateAllRankings(elementsCount - 1);
  const result = [];

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
        const newRankingWithEquivalence = [...ranking.slice()];
        newRankingWithEquivalence[i] = [
          ...newRankingWithEquivalence[i],
          elementsCount,
        ];
        result.push(newRankingWithEquivalence);
      }
    }
  }

  // Зберігаємо результат у кеші
  rankingsGenerationCache.set(elementsCount, result);
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
 * Використовує кеш для оптимізації повторних обчислень
 */
const rankingsCountCache = new Map();

export const countRankings = (n) => {
  // Для маленьких значень повертаємо відомі результати
  if (n <= 0) return 1;
  if (n === 1) return 1;
  if (n === 2) return 3;
  if (n === 3) return 13;
  if (n === 4) return 75;

  // Перевіряємо кеш
  if (rankingsCountCache.has(n)) {
    return rankingsCountCache.get(n);
  }

  // Використовуємо числа Стірлінга другого роду і обчислюємо
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

  // Зберігаємо результат у кеші
  rankingsCountCache.set(n, sum);
  return sum;
};
