import React from "react";
import { generateRankTableData } from "../utils/rankingUtils";

const RankTable = ({ tableData, settings }) => {
  const rankTableData = generateRankTableData(tableData, settings);

  return (
    <div className="table-container">
      <h3 className="table-title">Таблиця рангів</h3>
      <table className="rank-table">
        <tbody>
          {rankTableData.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex === 0 ? "header-row" : ""}>
              <th className="row-header">{row.title}</th>
              {row.data.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell || "0"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankTable;
