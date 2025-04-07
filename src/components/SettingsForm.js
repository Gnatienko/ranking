import React from "react";

const SettingsForm = ({ settings, onSubmit, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const newSettings = {
      ranksCount: parseInt(e.target.ranksCount.value),
      expertsCount: parseInt(e.target.expertsCount.value),
      totalObjects: parseInt(e.target.totalObjects.value),
    };

    // Валідація
    if (newSettings.ranksCount > newSettings.totalObjects) {
      alert(
        "Кількість рангів не може перевищувати загальну кількість об'єктів"
      );
      return;
    }

    onSubmit(newSettings);
  };

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-group">
        <label>
          Кількість рангів:
          <input
            type="number"
            name="ranksCount"
            defaultValue={settings.ranksCount}
            min="1"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Кількість експертів:
          <input
            type="number"
            name="expertsCount"
            defaultValue={settings.expertsCount}
            min="1"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Загальна кількість об'єктів:
          <input
            type="number"
            name="totalObjects"
            defaultValue={settings.totalObjects}
            min="2"
            required
          />
        </label>
      </div>
      <button type="submit" className="save-btn">
        Зберегти налаштування
      </button>
    </form>
  );
};

export default SettingsForm;
