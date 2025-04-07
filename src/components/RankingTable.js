import React from "react";

const RankingTable = ({ tableData, settings }) => {
  return (
    <div className="table-container">
      <h3 className="table-title">Таблиця розподілу об'єктів за рангами</h3>
      <table className="ranking-table">
        <tbody>
          <tr className="header-row">
            <th className="row-header">Ранги</th>
            {Array.from({ length: settings.expertsCount }, (_, i) => (
              <td key={i}>E{i + 1}</td>
            ))}
          </tr>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th className="row-header">Ранг {rowIndex + 1}</th>
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

export default RankingTable;
