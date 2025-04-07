/**
 * Генерує всі можливі ранжування для заданої кількості елементів
 * @param {number} elementsCount - Кількість елементів
 * @returns {Array} - Масив усіх можливих ранжувань, кожне ранжування є масивом груп
 */
export const generateAllRankings = (elementsCount) => {
  // Для невеликих значень elementsCount
  if (elementsCount <= 0) return [[]];
  if (elementsCount === 1) return [[[1]]];
  if (elementsCount === 2) {
    return [
      [[1], [2]], // 1 > 2
      [[2], [1]], // 2 > 1
      [[1, 2]], // 1 = 2
    ];
  }

  // Ініціалізуємо кеш для швидкого доступу
  const rankingsCache = new Map();
  rankingsCache.set(0, [[]]);
  rankingsCache.set(1, [[[1]]]);
  rankingsCache.set(2, [[[1], [2]], [[2], [1]], [[1, 2]]]);

  // Рекурсивна функція з кешуванням
  const generateWithCache = (n) => {
    if (rankingsCache.has(n)) {
      return rankingsCache.get(n);
    }

    const smallerRankings = generateWithCache(n - 1);
    const result = [];

    for (const ranking of smallerRankings) {
      // Додаємо новий елемент на кожну можливу позицію
      for (let i = 0; i <= ranking.length; i++) {
        // Додаємо як окремий елемент
        const newRanking = [...ranking.slice(0, i), [n], ...ranking.slice(i)];
        result.push(newRanking);

        // Додаємо з еквівалентністю до існуючих елементів
        if (i < ranking.length) {
          const newRankingWithEquivalence = [...ranking];
          newRankingWithEquivalence[i] = [...newRankingWithEquivalence[i], n];
          result.push(newRankingWithEquivalence);
        }
      }
    }

    rankingsCache.set(n, result);
    return result;
  };

  return generateWithCache(elementsCount);
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
