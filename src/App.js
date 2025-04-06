import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  // Змінюємо назву на більш відповідну
  const [settings, setSettings] = useState({
    ranksCount: 4, // Кількість рангів
    expertsCount: 5, // Кількість експертів
    totalObjects: 10, // Загальна кількість об'єктів
  });

  // Стейт для відображення форми налаштувань
  const [showSettings, setShowSettings] = useState(false);

  // Ініціалізуємо tableData з правильними розмірами
  const [tableData, setTableData] = useState(() =>
    Array(settings.ranksCount)
      .fill()
      .map(() => Array(settings.expertsCount).fill(0))
  );

  // Функція для оновлення налаштувань
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const newSettings = {
      ranksCount: parseInt(e.target.ranksCount.value),
      expertsCount: parseInt(e.target.expertsCount.value),
      totalObjects: parseInt(e.target.totalObjects.value),
    };

    // Оновлена валідація
    if (newSettings.ranksCount > newSettings.totalObjects) {
      alert(
        "Кількість рангів не може перевищувати загальну кількість об'єктів"
      );
      return;
    }

    setSettings(newSettings);

    const newTableData = Array(newSettings.ranksCount)
      .fill()
      .map(() => Array(newSettings.expertsCount).fill(0));

    setTableData(newTableData);
    setShowSettings(false);
  };

  const getRandomNumber = () => {
    let num =
      Math.floor(Math.random() * (settings.totalObjects * 2)) -
      settings.totalObjects;
    return num === 0 ? 1 : num;
  };

  const isUniqueInColumn = (number, expertIndex, newData) => {
    // Перевірка унікальності вибору для кожного експерта
    for (let i = 0; i < settings.ranksCount; i++) {
      if (Math.abs(newData[i][expertIndex]) === Math.abs(number)) {
        return false;
      }
    }
    return true;
  };

  const generateRandomData = useCallback(() => {
    const newData = Array(settings.ranksCount)
      .fill()
      .map(() => Array(settings.expertsCount).fill(null));

    try {
      // Генерація даних
      for (let expert = 0; expert < settings.expertsCount; expert++) {
        // Перший вибір (позитивний)
        let newNumber;
        do {
          newNumber = Math.floor(Math.random() * settings.totalObjects) + 1;
        } while (!isUniqueInColumn(newNumber, expert, newData));
        newData[0][expert] = newNumber;

        // Інші вибори
        for (let choice = 1; choice < settings.ranksCount; choice++) {
          do {
            newNumber = getRandomNumber();
          } while (!isUniqueInColumn(newNumber, expert, newData));
          newData[choice][expert] = newNumber;
        }
      }
      setTableData(newData);
    } catch (error) {
      console.error("Error generating random data:", error);
      // Встановлюємо пусту таблицю у випадку помилки
      setTableData(
        Array(settings.ranksCount)
          .fill()
          .map(() => Array(settings.expertsCount).fill(0))
      );
    }
  }, [settings]);

  const generateCountTable = () => {
    if (!tableData) return [];

    const countData = [];
    // Додаємо заголовки рядків
    const rowTitles = [
      "Об'єкти", // Заголовок для першого рядка
      "Ранг 1", // Для першого рангу
      "Ранг 2", // Для другого рангу
      "Ранг 3", // Для третього рангу
      "Ранг 4", // Для четвертого рангу
      "Сума", // Для останнього рядка
    ];

    // Перший рядок: номери об'єктів
    countData.push(
      Array.from({ length: settings.totalObjects }, (_, i) => i + 1)
    );

    // Підрахунок для кожного рядка
    for (let i = 0; i < settings.ranksCount; i++) {
      const rowCounts = [];
      for (let obj = 1; obj <= settings.totalObjects; obj++) {
        const count = tableData[i]
          ? tableData[i].filter((cell) => Math.abs(cell) === obj).length
          : 0;
        rowCounts.push(count);
      }
      countData.push(rowCounts);
    }

    // Сума по стовпцях
    const sums = Array(settings.totalObjects)
      .fill(0)
      .map((_, colIndex) =>
        countData.slice(1).reduce((sum, row) => sum + row[colIndex], 0)
      );
    countData.push(sums);

    // Додаємо заголовки до кожного рядка
    return countData.map((row, index) => ({
      title: rowTitles[index] || `Ранг ${index}`,
      data: row,
    }));
  };

  const generateRankTable = () => {
    const rankData = Array(settings.totalObjects + 1)
      .fill()
      .map(() => Array(settings.expertsCount).fill(0));

    // Створюємо масив з даними та заголовками
    const tableWithTitles = rankData.map((row, index) => ({
      title: index === 0 ? "Експерти" : `Об'єкт ${index}`,
      data: row,
    }));

    // Заповнюємо заголовки стовпців
    tableWithTitles[0].data = Array.from(
      { length: settings.expertsCount },
      (_, i) => `E${i + 1}`
    );

    // Для кожного експерта
    for (let expert = 0; expert < settings.expertsCount; expert++) {
      const rankGroups = [];
      let currentGroup = [];

      for (let choice = 0; choice < settings.ranksCount; choice++) {
        const currentNumber = tableData[choice][expert];

        if (currentNumber < 0 && currentGroup.length > 0) {
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

      rankGroups.forEach((group) => {
        if (group.length > 0) {
          const avgRank =
            group.reduce((sum, item) => sum + item.position, 0) / group.length;
          group.forEach((item) => {
            if (item.value <= settings.totalObjects) {
              tableWithTitles[item.value].data[expert] = avgRank;
            }
          });
        }
      });
    }

    return tableWithTitles;
  };

  const generateRankCountTable = () => {
    // Отримуємо дані з таблиці рангів
    const rankTableData = generateRankTable();

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
      data: Array.from(
        { length: settings.totalObjects },
        (_, i) => `Об'єкт ${i + 1}`
      ),
    });

    // Підраховуємо кількість кожного рангу для кожного об'єкта
    sortedRanks.forEach((rank) => {
      const rowData = Array(settings.totalObjects).fill(0);

      // Проходимо по кожному об'єкту в таблиці рангів
      for (let obj = 1; obj <= settings.totalObjects; obj++) {
        const objRow = rankTableData[obj];
        if (objRow) {
          rowData[obj - 1] = objRow.data.filter(
            (value) => value === rank
          ).length;
        }
      }

      countData.push({
        title: `Ранг ${rank}`,
        data: rowData,
      });
    });

    // Додаємо рядок з сумою
    const sums = Array(settings.totalObjects).fill(0);
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

  useEffect(() => {
    generateRandomData();
  }, [settings]); // Перегенеруємо дані при зміні налаштувань

  // Функція для підрахунку кількості входжень числа в рядку
  const countNumberInRow = (number, rowData) => {
    return rowData.filter((cell) => Math.abs(cell) === number).length;
  };

  return (
    <div className="App">
      <h1 className="title">Таблиця ранжування</h1>

      <div className="controls">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="settings-btn"
        >
          {showSettings ? "Сховати налаштування" : "Показати налаштування"}
        </button>
        <button onClick={generateRandomData} className="generate-btn">
          Згенерувати випадкові числа
        </button>
      </div>

      {showSettings && (
        <form onSubmit={handleSettingsSubmit} className="settings-form">
          <div className="form-group">
            <label>
              Кількість рангів:
              <input
                type="number"
                name="ranksCount"
                defaultValue={settings.ranksCount}
                min="1"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Кількість експертів:
              <input
                type="number"
                name="expertsCount"
                defaultValue={settings.expertsCount}
                min="1"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Загальна кількість об'єктів:
              <input
                type="number"
                name="totalObjects"
                defaultValue={settings.totalObjects}
                min="2"
                required
              />
            </label>
          </div>
          <button type="submit" className="save-btn">
            Зберегти налаштування
          </button>
        </form>
      )}

      <div className="table-container">
        <h3 className="table-title">Таблиця розподілу об'єктів за рангами</h3>
        <table className="ranking-table">
          <thead>
            <tr>
              {Array.from({ length: settings.expertsCount }, (_, i) => (
                <th key={i}>E{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="subtitle">Таблиця підрахунку</h2>
      <div className="table-container">
        <table className="count-table">
          <tbody>
            {generateCountTable().map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex === 0
                    ? "header-row"
                    : rowIndex === generateCountTable().length - 1
                    ? "sum-row"
                    : ""
                }
              >
                <th className="row-header">{row.title}</th>
                {row.data.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="subtitle">Таблиця рангів</h2>
      <div className="table-container">
        <table className="rank-table">
          <tbody>
            {generateRankTable().map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? "header-row" : ""}>
                <th className="row-header">{row.title}</th>
                {row.data.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="subtitle">Таблиця підрахунку рангів</h2>
      <div className="table-container">
        <table className="rank-count-table">
          <tbody>
            {generateRankCountTable().map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex === 0
                    ? "header-row"
                    : rowIndex === generateRankCountTable().length - 1
                    ? "sum-row"
                    : ""
                }
              >
                <th className="row-header">{row.title}</th>
                {row.data.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
