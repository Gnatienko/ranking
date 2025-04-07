import React from "react";

/**
 * Генерує всі можливі перестановки елементів
 */
const permute = (arr) => {
  if (arr.length === 0) return [[]];
  if (arr.length === 1) return [arr];

  const permutations = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingPermutations = permute(remaining);
    for (let perm of remainingPermutations) {
      permutations.push([current, ...perm]);
    }
  }
  return permutations;
};

const AllRankingsTable = ({ rankCountTableData, expertsCount }) => {
  // Отримуємо всі унікальні ранги з таблиці підрахунку рангів
  const uniqueRanks = rankCountTableData
    .slice(1, -1)
    .map((row) => row.title.replace("Ранг ", ""));

  // Генеруємо всі можливі перестановки
  const allRankings = permute(uniqueRanks);

  return (
    <div className="table-container">
      <h3 className="table-title">Всі можливі ранжування</h3>
      <p>Кількість можливих ранжувань: {allRankings.length}</p>
      <div style={{ display: "flex" }}>
        <div>
          <h4 className="table-subtitle">Ранги</h4>
          <table className="rank-table">
            <thead>
              <tr>
                <th>#</th>
                {uniqueRanks.map((rank, index) => (
                  <th key={index}>Ранг {rank}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRankings.map((combination, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {combination.map((rank, rankIndex) => (
                    <td key={rankIndex}>{rank}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h4 className="table-subtitle">Відстані</h4>
          <table className="rank-table">
            <thead>
              <tr>
                {Array.from({ length: expertsCount }, (_, i) => (
                  <th key={i}>E{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRankings.map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: expertsCount }, (_, i) => (
                    <td key={i}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllRankingsTable;
