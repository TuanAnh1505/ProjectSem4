import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{ color: i18n.language === 'en' ? '#9d3328' : '#333', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => changeLanguage('en')}
      >
        EN
      </span>
      <span
        style={{ color: i18n.language === 'vi' ? '#9d3328' : '#333', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => changeLanguage('vi')}
      >
        VI
      </span>
    </div>
  );
}

export default LanguageSwitcher; 