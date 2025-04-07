/**
 * Генерує всі можливі розбиття множини на підмножини
 * зі збереженням порядку (ранжування з еквівалентністю)
 */
export const generateAllWeakOrderings = (n) => {
  // Початкові елементи (A, B, C, D тощо)
  const elements = Array.from({ length: n }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Масив для зберігання всіх ранжировок
  const results = [];

  // Рекурсивна функція для генерації всіх розбиттів
  const generateOrderings = (currElements, currOrdering = []) => {
    if (currElements.length === 0) {
      results.push([...currOrdering]);
      return;
    }

    // Додаємо елемент як новий ранг
    generateOrderings(currElements.slice(1), [
      ...currOrdering,
      [currElements[0]],
    ]);

    // Додаємо елемент до існуючих рангів
    for (let i = 0; i < currOrdering.length; i++) {
      const newOrdering = [...currOrdering];
      newOrdering[i] = [...newOrdering[i], currElements[0]];
      generateOrderings(currElements.slice(1), newOrdering);
    }
  };

  generateOrderings(elements);

  // Конвертуємо результати у зручний формат
  return results.map((ordering) => {
    return {
      id: results.indexOf(ordering),
      ordering: ordering.map((group) => group.join(" = ")).join(" > "),
      groups: ordering.length,
      groupSizes: ordering.map((group) => group.length).join(","),
    };
  });
};

/**
 * Підраховує кількість варіантів ранжування з еквівалентністю для n елементів
 */
export const countWeakOrderings = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  // Використовуємо рекурсивну формулу для обчислення чисел Стірлінга другого роду
  // та сумуємо їх, помножені на факторіали
  let sum = 0;
  for (let k = 1; k <= n; k++) {
    sum += stirling2(n, k) * factorial(k);
  }
  return sum;
};

/**
 * Обчислює числа Стірлінга другого роду S(n,k)
 */
const stirling2 = (n, k) => {
  if (n === 0 && k === 0) return 1;
  if (n === 0 || k === 0) return 0;
  if (k === 1 || k === n) return 1;

  return k * stirling2(n - 1, k) + stirling2(n - 1, k - 1);
};

/**
 * Обчислює факторіал числа
 */
const factorial = (n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};
