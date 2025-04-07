/**
 * Генерує випадкове число від -max до max (крім 0)
 */
export const getRandomNumber = (max) => {
  let num = Math.floor(Math.random() * (max * 2)) - max;
  return num === 0 ? 1 : num;
};

/**
 * Перевіряє унікальність числа по модулю в стовпці
 */
export const isUniqueInColumn = (number, expertIndex, data, ranksCount) => {
  for (let i = 0; i < ranksCount; i++) {
    if (
      data[i] &&
      data[i][expertIndex] &&
      Math.abs(data[i][expertIndex]) === Math.abs(number)
    ) {
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
      // Перший вибір кожного експерта завжди позитивний
      let newNumber;
      do {
        newNumber = Math.floor(Math.random() * totalObjects) + 1;
      } while (!isUniqueInColumn(newNumber, expert, newData, ranksCount));
      newData[0][expert] = newNumber;

      // Інші вибори можуть бути як позитивними, так і негативними
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
