import React, { useState, useEffect } from "react";
import {
  generateAllRankings,
  countRankings,
} from "../utils/rankingVariantsUtils";

const AllRankingsTable = ({ settings }) => {
  const [rankings, setRankings] = useState([]);
  const [page, setPage] = useState(1);
  const [rankingsPerPage, setRankingsPerPage] = useState(25);
  const [totalRankings, setTotalRankings] = useState(0);
  const [loading, setLoading] = useState(false);

  // Отримуємо кількість рангів з налаштувань
  const { ranksCount } = settings;

  // Форматування ранжування для відображення в таблиці
  const formatRankingForDisplay = (ranking) => {
    // Перетворюємо з формату вкладених масивів у плоский масив елементів
    const result = [];

    for (let i = 0; i < ranking.length && i < ranksCount; i++) {
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

    // Забезпечуємо, щоб результат мав довжину ranksCount
    while (result.length < ranksCount) {
      result.push("");
    }

    return result;
  };

  useEffect(() => {
    setLoading(true);
    setPage(1); // Скидаємо пагінацію при зміні ranksCount

    // Для великих значень ranksCount використовуємо лише формулу підрахунку
    if (ranksCount > 7) {
      setTotalRankings(countRankings(ranksCount));
      setRankings([]);
      setLoading(false);
      return;
    }

    // Адаптація кількості рядків на сторінку в залежності від ranksCount
    // щоб уникнути занадто довгого часу завантаження та рендерингу
    if (ranksCount >= 6) {
      setRankingsPerPage(10); // Меньше рядків для більших ранжувань
    } else if (ranksCount >= 5) {
      setRankingsPerPage(20);
    } else {
      setRankingsPerPage(25);
    }

    // Генеруємо всі ранжування для невеликих значень ranksCount
    const genRankings = generateAllRankings(ranksCount);
    setRankings(genRankings);
    setTotalRankings(genRankings.length);
    setLoading(false);
  }, [ranksCount]);

  // Отримуємо поточну сторінку ранжувань
  const currentRankings = rankings.slice(
    (page - 1) * rankingsPerPage,
    page * rankingsPerPage
  );

  const totalPages = Math.ceil(rankings.length / rankingsPerPage);

  return (
    <div className="table-container">
      <h3 className="table-title">
        Всі можливі ранжування для {ranksCount} елементів
      </h3>

      <div className="rankings-info">
        <p>
          Загальна кількість ранжувань: <strong>{totalRankings}</strong>
        </p>
        {ranksCount >= 6 && (
          <p className="loading-warning">
            <strong>Увага:</strong> Для {ranksCount} елементів кількість
            ранжувань дуже велика. Відображення може зайняти деякий час.
          </p>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <p>Генерація ранжувань...</p>
          <div className="loading-spinner"></div>
        </div>
      ) : rankings.length > 0 ? (
        <>
          <table className="rank-table">
            <thead>
              <tr className="header-row">
                <th className="row-header">№</th>
                {Array.from({ length: ranksCount }, (_, i) => (
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
          Для {ranksCount} елементів існує занадто багато ранжувань для
          відображення ({totalRankings} варіантів).
        </p>
      )}
    </div>
  );
};

export default AllRankingsTable;
