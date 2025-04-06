import React, { useState } from "react";
import "./App.css";

function App() {
  const [tableData, setTableData] = useState([
    ["Дані 1-1", "Дані 1-2", "Дані 1-3", "Дані 1-4", "Дані 1-5"],
    ["Дані 2-1", "Дані 2-2", "Дані 2-3", "Дані 2-4", "Дані 2-5"],
    ["Дані 3-1", "Дані 3-2", "Дані 3-3", "Дані 3-4", "Дані 3-5"],
    ["Дані 4-1", "Дані 4-2", "Дані 4-3", "Дані 4-4", "Дані 4-5"],
  ]);

  // Функція для генерації випадкового числа від -10 до 10 (крім 0)
  const getRandomNumber = () => {
    let num = Math.floor(Math.random() * 20) - 10;
    return num === 0 ? 1 : num;
  };

  // Перевірка чи є число унікальним по модулю в стовпці
  const isUniqueInColumn = (number, columnIndex, newData) => {
    for (let i = 0; i < newData.length; i++) {
      if (Math.abs(newData[i][columnIndex]) === Math.abs(number)) {
        return false;
      }
    }
    return true;
  };

  const generateRandomData = () => {
    const newData = Array(4)
      .fill()
      .map(() => Array(5).fill(null));

    // Заповнюємо таблицю по стовпцях
    for (let col = 0; col < 5; col++) {
      // Для першого рядка генеруємо тільки позитивні числа (1-10)
      let newNumber;
      do {
        newNumber = Math.floor(Math.random() * 10) + 1;
      } while (!isUniqueInColumn(newNumber, col, newData));
      newData[0][col] = newNumber;

      // Для інших рядків генеруємо числа від -10 до 10 (крім 0)
      for (let row = 1; row < 4; row++) {
        do {
          newNumber = getRandomNumber();
        } while (!isUniqueInColumn(newNumber, col, newData));
        newData[row][col] = newNumber;
      }
    }

    setTableData(newData);
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
      .map(() => Array(5).fill(""));

    // Заповнюємо перший рядок (E1...E5)
    rankData[0] = ["E1", "E2", "E3", "E4", "E5"];

    // Для кожного стовпця першої таблиці
    for (let col = 0; col < 5; col++) {
      // Для кожного числа від 1 до 10
      for (let row = 1; row <= 10; row++) {
        // Шукаємо це число (по модулю) в стовпці першої таблиці
        for (let i = 0; i < 4; i++) {
          if (Math.abs(tableData[i][col]) === row) {
            rankData[row][col] = i + 1; // Записуємо номер рядка + 1
          }
        }
      }
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
