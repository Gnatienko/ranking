import React, { useState, useEffect } from "react";
import {
  generateAllRankings,
  formatRanking,
  countRankings,
} from "../utils/rankingVariantsUtils";

const AllRankingsTable = ({ elementsCount = 4 }) => {
  const [rankings, setRankings] = useState([]);
  const [page, setPage] = useState(1);
  const rankingsPerPage = 25;
  const [totalRankings, setTotalRankings] = useState(0);
  const [loading, setLoading] = useState(false);

  // Форматування ранжування для відображення в таблиці
  const formatRankingForDisplay = (ranking) => {
    // Перетворюємо з формату вкладених масивів у плоский масив елементів
    const result = [];

    for (let i = 0; i < ranking.length; i++) {
      const group = ranking[i];

      for (let j = 0; j < group.length; j++) {
        const element = group[j];
        // Якщо елемент не перший у групі, додаємо знак рівності
        if (j > 0) {
          result.push(`=${element}`);
        } else {
          result.push(element);
        }
      }
    }

    // Забезпечуємо, щоб результат мав довжину elementsCount
    while (result.length < elementsCount) {
      result.push("");
    }

    return result;
  };

  useEffect(() => {
    setLoading(true);

    // Для великих значень elementsCount використовуємо лише формулу підрахунку
    if (elementsCount > 5) {
      setTotalRankings(countRankings(elementsCount));
      setRankings([]);
      setLoading(false);
      return;
    }

    // Генеруємо всі ранжування для невеликих значень elementsCount
    const genRankings = generateAllRankings(elementsCount);
    setRankings(genRankings);
    setTotalRankings(genRankings.length);
    setLoading(false);
  }, [elementsCount]);

  // Отримуємо поточну сторінку ранжувань
  const currentRankings = rankings.slice(
    (page - 1) * rankingsPerPage,
    page * rankingsPerPage
  );

  const totalPages = Math.ceil(rankings.length / rankingsPerPage);

  return (
    <div className="table-container">
      <h3 className="table-title">
        Всі можливі ранжування для {elementsCount} елементів
      </h3>

      <div className="rankings-info">
        <p>
          Загальна кількість ранжувань: <strong>{totalRankings}</strong>
        </p>
      </div>

      {loading ? (
        <p>Генерація ранжувань...</p>
      ) : rankings.length > 0 ? (
        <>
          <table className="rank-table">
            <thead>
              <tr className="header-row">
                <th className="row-header">№</th>
                {Array.from({ length: elementsCount }, (_, i) => (
                  <th key={i}>Ранг {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRankings.map((ranking, index) => {
                const formattedRanking = formatRankingForDisplay(ranking);
                return (
                  <tr key={index}>
                    <th className="row-header">
                      {(page - 1) * rankingsPerPage + index + 1}
                    </th>
                    {formattedRanking.map((item, itemIndex) => (
                      <td key={itemIndex}>{item}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="page-btn"
              >
                Попередня
              </button>
              <span className="page-info">
                Сторінка {page} з {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="page-btn"
              >
                Наступна
              </button>
            </div>
          )}
        </>
      ) : (
        <p>
          Для {elementsCount} елементів існує занадто багато ранжувань для
          відображення.
        </p>
      )}
    </div>
  );
};

export default AllRankingsTable;
