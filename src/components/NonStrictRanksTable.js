import React from "react";
import { generateAllNonStrictRanksTableData } from "../utils/rankingUtils";

const NonStrictRanksTable = ({ settings }) => {
  const nonStrictRanksTableData = generateAllNonStrictRanksTableData(settings);
  const variantsCount = nonStrictRanksTableData.length - 1;

  return (
    <div className="table-container">
      <h3 className="table-title">Таблиця не строгих ранжувань</h3>
      <p className="table-description">
        Показано {variantsCount} варіантів не строгих ранжувань. Від'ємні
        значення (позначені "=") означають рівність з попереднім елементом.
      </p>
      <table className="rank-table">
        <tbody>
          {nonStrictRanksTableData.map((row, rowIndex) => (
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
  );
};

export default NonStrictRanksTable;
