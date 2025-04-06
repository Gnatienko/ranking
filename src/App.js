import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [tableData, setTableData] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const getRandomNumber = () => {
    let num = Math.floor(Math.random() * 20) - 10;
    return num === 0 ? 1 : num;
  };

  const generateRandomData = useCallback(() => {
    const newData = Array(4)
      .fill()
      .map(() => Array(5).fill(null));

    for (let col = 0; col < 5; col++) {
      let newNumber;
      do {
        newNumber = Math.floor(Math.random() * 10) + 1;
      } while (!isUniqueInColumn(newNumber, col, newData));
      newData[0][col] = newNumber;

      for (let row = 1; row < 4; row++) {
        do {
          newNumber = getRandomNumber();
        } while (!isUniqueInColumn(newNumber, col, newData));
        newData[row][col] = newNumber;
      }
    }

    setTableData(newData);
  }, []);

  useEffect(() => {
    generateRandomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Перевірка чи є число унікальним по модулю в стовпці
  const isUniqueInColumn = (number, columnIndex, newData) => {
    for (let i = 0; i < newData.length; i++) {
      if (Math.abs(newData[i][columnIndex]) === Math.abs(number)) {
        return false;
      }
    }
    return true;
  };

  // Функція для підрахунку кількості входжень числа в рядку
  const countNumberInRow = (number, rowData) => {
    return rowData.filter((cell) => Math.abs(cell) === number).length;
  };

  // Функція для створення таблиці підрахунку
  const generateCountTable = () => {
    const countData = [];
    // Перший рядок: числа від 1 до 10
    countData.push(Array.from({ length: 10 }, (_, i) => i + 1));

    // Рядки 2-5: підрахунок входжень для кожного рядка ранжування
    for (let i = 0; i < 4; i++) {
      const rowCounts = [];
      for (let num = 1; num <= 10; num++) {
        rowCounts.push(countNumberInRow(num, tableData[i]));
      }
      countData.push(rowCounts);
    }

    // Останній рядок: сума по стовпцях
    const sums = Array(10)
      .fill(0)
      .map((_, colIndex) =>
        countData.slice(1).reduce((sum, row) => sum + row[colIndex], 0)
      );
    countData.push(sums);

    return countData;
  };

  // Функція для створення таблиці рангів
  const generateRankTable = () => {
    const rankData = Array(11)
      .fill()
      .map(() => Array(5).fill(0));
    rankData[0] = ["E1", "E2", "E3", "E4", "E5"];

    // Для кожного стовпця
    for (let col = 0; col < 5; col++) {
      // Створюємо масив груп чисел з однаковим рангом
      const rankGroups = [];
      let currentGroup = [];

      // Проходимо по числах у стовпці
      for (let row = 0; row < 4; row++) {
        const currentNumber = tableData[row][col];

        // Якщо число від'ємне, додаємо його до поточної групи
        if (currentNumber < 0) {
          if (currentGroup.length > 0) {
            currentGroup.push({
              value: Math.abs(currentNumber),
              position: row + 1,
            });
          }
        } else {
          // Якщо було попередня група, зберігаємо її
          if (currentGroup.length > 0) {
            rankGroups.push([...currentGroup]);
          }
          // Починаємо нову групу
          currentGroup = [
            {
              value: Math.abs(currentNumber),
              position: row + 1,
            },
          ];
        }
      }
      // Додаємо останню групу, якщо вона є
      if (currentGroup.length > 0) {
        rankGroups.push(currentGroup);
      }

      // Розраховуємо та записуємо ранги
      rankGroups.forEach((group) => {
        // Середній ранг для групи
        const avgRank =
          group.reduce((sum, item) => sum + item.position, 0) / group.length;

        // Записуємо ранг для кожного числа в групі
        group.forEach((item) => {
          rankData[item.value][col] = avgRank;
        });
      });
    }

    return rankData;
  };

  return (
    <div className="App">
      <h1 className="title">Таблиця ранжування</h1>
      <button onClick={generateRandomData} className="generate-btn">
        Згенерувати випадкові числа
      </button>

      <div className="table-container">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>E1</th>
              <th>E2</th>
              <th>E3</th>
              <th>E4</th>
              <th>E5</th>
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
                    : rowIndex === 5
                    ? "sum-row"
                    : ""
                }
              >
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
