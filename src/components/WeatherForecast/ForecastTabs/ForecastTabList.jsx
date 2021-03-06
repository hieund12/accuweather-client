import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import LocalStorage from 'utils/localStorage';
import { FORECAST_TABS as Tabs } from 'constants/forecastTabs';
import { Wrapper, ForecastTabListItem } from './ForecastTabs.components';
import { useNetworkStatus } from 'components/Contexts/NetworkStatusContext';
import { useOfflineNotification } from 'components/Contexts/NetworkNotificationContext';

export default function ForecastTabList({ activeTab, onSelectTab }) {
  const [t] = useTranslation();

  const { setShowNotification } = useOfflineNotification();
  const { isOnline } = useNetworkStatus();

  function handleSelectTab(event) {
    const tabName = event.target.name;

    if (isOnline || LocalStorage.get(tabName) !== undefined) {
      onSelectTab(tabName);
    } else {
      setShowNotification(true);
    }
  }

  return (
    <Wrapper>
      {Object.keys(Tabs).map(tabKey => (
        <ForecastTabListItem
          key={tabKey}
          active={Tabs[tabKey] === activeTab}
          name={Tabs[tabKey]}
          onClick={handleSelectTab}
        >
          {t(`ForecastTab.${tabKey}.label`)}
        </ForecastTabListItem>
      ))}
    </Wrapper>
  );
}

const { string, func } = PropTypes;

ForecastTabList.propTypes = {
  activeTab: string.isRequired,
  onSelectTab: func.isRequired,
};
