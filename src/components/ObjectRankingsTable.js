import React from "react";

const ObjectRankingsTable = ({ rowCount, objectCount }) => {
  // Створюємо пусті дані для таблиці
  const tableData = Array.from({ length: rowCount }, () =>
    Array.from({ length: objectCount }, () => "")
  );

  return (
    <div className="table-container">
      <h3 className="table-title">Таблиця об'єктів</h3>
      <table className="rank-table">
        <thead>
          <tr>
            {Array.from({ length: objectCount }, (_, index) => (
              <th key={index}>Об'єкт {index + 1}</th>
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
  );
};

export default ObjectRankingsTable;
