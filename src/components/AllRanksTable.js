import React from "react";
import { generateAllRanksTableData } from "../utils/rankingUtils";

const AllRanksTable = ({ settings }) => {
  const allRanksTableData = generateAllRanksTableData(settings);

  return (
    <div className="table-container">
      <h3 className="table-title">Таблиця перебору всіх рангів</h3>
      <p className="table-description">
        Показано {allRanksTableData.length - 1} з{" "}
        {Math.min(settings.ranksCount, settings.totalObjects)}! можливих
        варіантів ранжування.
      </p>
      <table className="rank-table">
        <tbody>
          {allRanksTableData.map((row, rowIndex) => (
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

export default AllRanksTable;
