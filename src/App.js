import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  // Початкові налаштування
  const [settings, setSettings] = useState({
    bestObjectsCount: 4,
    expertsCount: 5,
    totalObjects: 10,
  });

  // Стейт для відображення форми налаштувань
  const [showSettings, setShowSettings] = useState(false);

  // Ініціалізуємо tableData з правильними розмірами
  const [tableData, setTableData] = useState(() =>
    Array(settings.bestObjectsCount)
      .fill()
      .map(() => Array(settings.expertsCount).fill(0))
  );

  // Функція для оновлення налаштувань
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const newSettings = {
      bestObjectsCount: parseInt(e.target.bestObjectsCount.value),
      expertsCount: parseInt(e.target.expertsCount.value),
      totalObjects: parseInt(e.target.totalObjects.value),
    };

    // Валідація
    if (newSettings.bestObjectsCount >= newSettings.totalObjects) {
      alert(
        "Кількість кращих об'єктів повинна бути менша за загальну кількість об'єктів"
      );
      return;
    }

    // Оновлюємо налаштування
    setSettings(newSettings);

    // Створюємо нову таблицю з новими розмірами
    const newTableData = Array(newSettings.bestObjectsCount)
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
    for (let i = 0; i < settings.bestObjectsCount; i++) {
      if (Math.abs(newData[i][expertIndex]) === Math.abs(number)) {
        return false;
      }
    }
    return true;
  };

  const generateRandomData = useCallback(() => {
    const newData = Array(settings.bestObjectsCount)
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
        for (let choice = 1; choice < settings.bestObjectsCount; choice++) {
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
        Array(settings.bestObjectsCount)
          .fill()
          .map(() => Array(settings.expertsCount).fill(0))
      );
    }
  }, [settings]);

  const generateCountTable = () => {
    // Перевіряємо, що tableData існує
    if (!tableData) return [];

    const countData = [];
    // Перший рядок: номери об'єктів
    countData.push(
      Array.from({ length: settings.totalObjects }, (_, i) => i + 1)
    );

    // Підрахунок для кожного рядка
    for (let i = 0; i < settings.bestObjectsCount; i++) {
      const rowCounts = [];
      for (let obj = 1; obj <= settings.totalObjects; obj++) {
        // Додаємо перевірку на існування рядка
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

    return countData;
  };

  const generateRankTable = () => {
    // Створюємо масив для таблиці рангів з правильними розмірами
    const rankData = Array(settings.totalObjects + 1)
      .fill()
      .map(() => Array(settings.expertsCount).fill(0));

    // Заповнюємо заголовки
    rankData[0] = Array.from(
      { length: settings.expertsCount },
      (_, i) => `E${i + 1}`
    );

    // Для кожного експерта
    for (let expert = 0; expert < settings.expertsCount; expert++) {
      const rankGroups = [];
      let currentGroup = [];

      // Аналіз виборів експерта
      for (let choice = 0; choice < settings.bestObjectsCount; choice++) {
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
            // Перевіряємо, що число не є нулем
            currentGroup = [
              {
                value: Math.abs(currentNumber),
                position: choice + 1,
              },
            ];
          }
        }
      }

      // Додаємо останню групу, якщо вона є
      if (currentGroup.length > 0) {
        rankGroups.push(currentGroup);
      }

      // Розрахунок середніх рангів для груп
      rankGroups.forEach((group) => {
        if (group.length > 0) {
          const avgRank =
            group.reduce((sum, item) => sum + item.position, 0) / group.length;
          group.forEach((item) => {
            if (item.value <= settings.totalObjects) {
              // Перевіряємо, що індекс не виходить за межі
              rankData[item.value][expert] = avgRank;
            }
          });
        }
      });
    }

    return rankData;
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
              Кількість кращих об'єктів:
              <input
                type="number"
                name="bestObjectsCount"
                defaultValue={settings.bestObjectsCount}
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
              <tr key={rowIndex} className={rowIndex === 0 ? "header-row" : ""}>
                {row.map((cell, cellIndex) => (
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
                {row.map((cell, cellIndex) => (
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
