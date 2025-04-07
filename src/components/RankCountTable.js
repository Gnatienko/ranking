import React from "react";
import { generateRankCountTableData } from "../utils/rankingUtils";

const RankCountTable = ({ tableData, settings }) => {
  const rankCountTableData = generateRankCountTableData(tableData, settings);

  return (
    <div className="table-container">
      <h3 className="table-title">Таблиця підрахунку рангів</h3>
      <table className="rank-table">
        <tbody>
          {rankCountTableData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex === 0
                  ? "header-row"
                  : rowIndex === rankCountTableData.length - 1
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
  );
};

export default RankCountTable;
