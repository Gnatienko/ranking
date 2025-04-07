import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import RankingTable from "./components/RankingTable";
import RankTable from "./components/RankTable";
import RankCountTable from "./components/RankCountTable";
import AllRankingsTable from "./components/AllRankingsTable";
import SettingsForm from "./components/SettingsForm";
import { generateRandomTableData } from "./utils/randomGenerators";

function App() {
  // Змінюємо назву на більш відповідну
  const [settings, setSettings] = useState({
    ranksCount: 4, // Кількість рангів
    expertsCount: 5, // Кількість експертів
    totalObjects: 10, // Загальна кількість об'єктів
  });

  // Стейт для відображення форми налаштувань
  const [showSettings, setShowSettings] = useState(false);

  // Ініціалізуємо tableData з правильними розмірами
  const [tableData, setTableData] = useState(() =>
    Array(settings.ranksCount)
      .fill()
      .map(() => Array(settings.expertsCount).fill(0))
  );

  const generateData = useCallback(() => {
    const newData = generateRandomTableData(settings);
    setTableData(newData);
  }, [settings]);

  // Генеруємо дані при першому завантаженні та зміні налаштувань
  useEffect(() => {
    generateData();
  }, [generateData]);

  const handleSettingsSubmit = (newSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
  };

  return (
    <div className="App">
      <h1 className="title">Таблиця ранжування</h1>

      <div className="controls">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="settings-btn"
        >
          {showSettings ? "Сховати налаштування" : "Показати налаштування"}
        </button>
        <button onClick={generateData} className="generate-btn">
          Згенерувати випадкові числа
        </button>
      </div>

      {showSettings && (
        <SettingsForm
          settings={settings}
          onSubmit={handleSettingsSubmit}
          onClose={() => setShowSettings(false)}
        />
      )}

      <RankingTable tableData={tableData} settings={settings} />

      <h2 className="subtitle">Таблиця рангів</h2>
      <RankTable tableData={tableData} settings={settings} />

      <h2 className="subtitle">Таблиця підрахунку рангів</h2>
      <RankCountTable tableData={tableData} settings={settings} />

      <h2 className="subtitle">Всі можливі ранжування</h2>
      <AllRankingsTable settings={settings} />
    </div>
  );
}

export default App;
