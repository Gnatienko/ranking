/**
 * Генерує випадкове число від 1 до max, з можливістю додавання знаку рівності
 */
export const getRandomNumber = (max) => {
  // Генеруємо випадкове число від 1 до max
  const num = Math.floor(Math.random() * max) + 1;

  // З ймовірністю 0.3 додаємо знак рівності
  if (Math.random() < 0.3 && num !== 0) {
    return `=${num}`;
  }

  return num;
};

/**
 * Перевіряє унікальність числа в стовпці
 */
export const isUniqueInColumn = (number, expertIndex, data, ranksCount) => {
  const numValue =
    typeof number === "string" ? parseInt(number.substring(1)) : number;

  for (let i = 0; i < ranksCount; i++) {
    if (!data[i] || !data[i][expertIndex]) continue;

    const existingValue = data[i][expertIndex];
    const existingNumValue =
      typeof existingValue === "string"
        ? parseInt(existingValue.substring(1))
        : existingValue;

    if (Math.abs(existingNumValue) === Math.abs(numValue)) {
      return false;
    }
  }
  return true;
};

/**
 * Генерує випадкові дані для таблиці ранжування
 */
export const generateRandomTableData = (settings) => {
  const { ranksCount, expertsCount, totalObjects } = settings;
  const newData = Array(ranksCount)
    .fill()
    .map(() => Array(expertsCount).fill(null));

  try {
    for (let expert = 0; expert < expertsCount; expert++) {
      // Перший вибір кожного експерта завжди без знаку рівності
      let newNumber;
      do {
        newNumber = Math.floor(Math.random() * totalObjects) + 1;
      } while (!isUniqueInColumn(newNumber, expert, newData, ranksCount));
      newData[0][expert] = newNumber;

      // Інші вибори можуть бути зі знаком рівності
      for (let choice = 1; choice < ranksCount; choice++) {
        do {
          newNumber = getRandomNumber(totalObjects);
        } while (!isUniqueInColumn(newNumber, expert, newData, ranksCount));
        newData[choice][expert] = newNumber;
      }
    }
    return newData;
  } catch (error) {
    console.error("Error generating random data:", error);
    return Array(ranksCount)
      .fill()
      .map(() => Array(expertsCount).fill(0));
  }
};
