import React, { useState } from "react";
import {
  generateAllWeakOrderings,
  countWeakOrderings,
} from "../utils/orderings";

const OrderingsTable = ({ elementCount = 4 }) => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Генеруємо всі можливі ранжування
  const allOrderings = generateAllWeakOrderings(elementCount);
  const totalCount = countWeakOrderings(elementCount);
  const totalPages = Math.ceil(allOrderings.length / pageSize);

  // Беремо підмножину для поточної сторінки
  const displayedOrderings = allOrderings.slice(
    page * pageSize,
    Math.min((page + 1) * pageSize, allOrderings.length)
  );

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="table-container">
      <h3 className="table-title">
        Таблиця всіх можливих ранжировок з еквівалентністю
      </h3>
      <div className="theory-box">
        <p>
          Якщо при ранжуванні допускається еквівалентність елементів — тобто,
          два або більше елементів можуть займати одне й те саме місце
          (однаковий ранг) — тоді ми говоримо не про перестановки, а про
          ранжування з еквівалентністю, або іншими словами: ослаблені лінійні
          порядки (англ. weak orders).
        </p>
        <p>
          Кількість усіх можливих ранжировок з еквівалентностями на{" "}
          {elementCount} елементах дорівнює {totalCount}.
        </p>
      </div>

      <table className="rank-table">
        <thead>
          <tr className="header-row">
            <th className="row-header">№</th>
            <th>Ранжування</th>
            <th>Кількість груп</th>
            <th>Розміри груп</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrderings.map((item) => (
            <tr key={item.id}>
              <th className="row-header">{item.id + 1}</th>
              <td>{item.ordering}</td>
              <td>{item.groups}</td>
              <td>{item.groupSizes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={prevPage}
          disabled={page === 0}
          className="pagination-btn"
        >
          Попередня
        </button>
        <span className="page-info">
          Сторінка {page + 1} з {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={page === totalPages - 1}
          className="pagination-btn"
        >
          Наступна
        </button>
      </div>
    </div>
  );
};

export default OrderingsTable;
