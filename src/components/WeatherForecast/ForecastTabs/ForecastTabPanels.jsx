import React, { Suspense, useRef, useState, lazy } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Loader from 'components/Loader';
import RefreshButton from './RefreshButton';
import LocalStorage from 'utils/localStorage';
import useFetchForecast from 'hooks/useFetchForecast';
import { FORECAST_TABS as Tabs } from 'constants/forecastTabs';
import { FORECAST_ENDPOINTS } from 'constants/endpoints';
import { LocalStorageFields as Fields } from 'constants/localStorageFields';
import { transformResponseData, clearResponse } from './utils';
import { useWeatherHook } from 'components/Contexts/WeatherContext';

const { Current, Hourly, For5Days } = Tabs;

const PAGES = {
  [Current]: lazy(() =>
    import(/* webpackChunkName: "CurrentForecast" */ 'components/CurrentForecast'),
  ),
  [Hourly]: lazy(() =>
    import(/* webpackChunkName: "HourlyForecast" */ 'components/HourlyForecast'),
  ),
  [For5Days]: lazy(() =>
    import(/* webpackChunkName: "ForecastFor5Days" */ 'components/ForecastFor5Days'),
  ),
};

export default function ForecastTabPanels({ activeTab }) {
  const prevActiveTab = useRef(activeTab);
  const [isFreshDataRequested, setFreshDataRequested] = useState(false);

  const { cityId } = useWeatherHook();
  // eslint-disable-next-line no-unused-vars
  const [t, i18n] = useTranslation();

  const response = useFetchForecast({
    url: FORECAST_ENDPOINTS[activeTab],
    options: {
      cityId,
      language: LocalStorage.get(Fields.language),
      filter: activeTab,
      details: activeTab === Hourly ? false : true,
      isFreshDataRequested,
    },
    cb: transformResponseData[activeTab],
  });

  if (isFreshDataRequested) {
    setTimeout(() => setFreshDataRequested(false), 200);
  }

  if (prevActiveTab.current !== activeTab) {
    clearResponse(response);
    prevActiveTab.current = activeTab;
  }

  const { data, loading, error } = response;

  if (error) {
    throw error;
  }

  const Page = PAGES[activeTab];

  return (
    <>
      <RefreshButton
        disabled={loading === true}
        onRefreshData={setFreshDataRequested}
      />
      {loading ? (
        <Loader />
      ) : (
        <Suspense fallback={<Loader />}>
          <Page data={data} />
        </Suspense>
      )}
    </>
  );
}

ForecastTabPanels.propTypes = {
  activeTab: PropTypes.string.isRequired,
};
