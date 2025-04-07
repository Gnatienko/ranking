/**
 * Генерує дані для таблиці рангів
 */
export const generateRankTableData = (tableData, settings) => {
  const { totalObjects, expertsCount } = settings;

  const rankData = Array(totalObjects + 1)
    .fill()
    .map(() => Array(expertsCount).fill(0));

  // Створюємо масив з даними та заголовками
  const tableWithTitles = rankData.map((row, index) => ({
    title: index === 0 ? "Експерти" : `Об'єкт ${index}`,
    data: row,
  }));

  // Заповнюємо заголовки стовпців
  tableWithTitles[0].data = Array.from(
    { length: expertsCount },
    (_, i) => `E${i + 1}`
  );

  // Для кожного експерта
  for (let expert = 0; expert < expertsCount; expert++) {
    const rankGroups = [];
    let currentGroup = [];

    // Проходимо по кожному рядку
    for (let choice = 0; choice < tableData.length; choice++) {
      const currentValue = tableData[choice][expert];
      // Перевіряємо, чи це рядок зі знаком рівності
      const isEqual =
        typeof currentValue === "string" && currentValue.startsWith("=");
      const currentNumber = isEqual
        ? parseInt(currentValue.substring(1))
        : currentValue;

      if (isEqual && currentGroup.length > 0) {
        currentGroup.push({
          value: Math.abs(currentNumber),
          position: choice + 1,
        });
      } else {
        if (currentGroup.length > 0) {
          rankGroups.push([...currentGroup]);
          currentGroup = [];
        }
        if (currentNumber !== 0) {
          currentGroup = [
            {
              value: Math.abs(currentNumber),
              position: choice + 1,
            },
          ];
        }
      }
    }

    if (currentGroup.length > 0) {
      rankGroups.push(currentGroup);
    }

    // Розрахунок рангів для груп
    rankGroups.forEach((group) => {
      if (group.length > 0) {
        const avgRank =
          group.reduce((sum, item) => sum + item.position, 0) / group.length;
        group.forEach((item) => {
          if (item.value <= totalObjects) {
            tableWithTitles[item.value].data[expert] = avgRank;
          }
        });
      }
    });
  }

  return tableWithTitles;
};

/**
 * Генерує дані для таблиці підрахунку рангів
 */
export const generateRankCountTableData = (tableData, settings) => {
  const { totalObjects } = settings;

  // Отримуємо дані з таблиці рангів
  const rankTableData = generateRankTableData(tableData, settings);

  // Знаходимо всі унікальні ранги (крім 0)
  const uniqueRanks = new Set();
  rankTableData.slice(1).forEach((row) => {
    row.data.forEach((value) => {
      if (value !== 0) uniqueRanks.add(value);
    });
  });

  // Сортуємо ранги
  const sortedRanks = Array.from(uniqueRanks).sort((a, b) => a - b);

  // Створюємо таблицю підрахунку
  const countData = [];

  // Додаємо заголовок з номерами об'єктів
  countData.push({
    title: "Ранги",
    data: Array.from({ length: totalObjects }, (_, i) => `O${i + 1}`),
  });

  // Підраховуємо кількість кожного рангу для кожного об'єкта
  sortedRanks.forEach((rank) => {
    const rowData = Array(totalObjects).fill(0);

    // Проходимо по кожному об'єкту в таблиці рангів
    for (let obj = 1; obj <= totalObjects; obj++) {
      const objRow = rankTableData[obj];
      if (objRow) {
        rowData[obj - 1] = objRow.data.filter((value) => value === rank).length;
      }
    }

    countData.push({
      title: `Ранг ${rank}`,
      data: rowData,
    });
  });

  // Додаємо рядок з сумою
  const sums = Array(totalObjects).fill(0);
  countData.slice(1).forEach((row) => {
    row.data.forEach((value, index) => {
      sums[index] += value;
    });
  });

  countData.push({
    title: "Сума",
    data: sums,
  });

  return countData;
};
