import React, { useState, useEffect } from "react";

import SearchCity from "components/SearchCity";
import WeatherForecast from "components/WeatherForecast";
import ContentContext from "components/Contexts/ContentContext";
import ContentErrorBoundary from "components/ErrorBoundaries";
import LocalStorage from "utils/localStorage";
import { Box } from "./Content.components";

const Content = () => {
  const [cityId, setCityId] = useState(null);

  useEffect(() => {
    const cityId = LocalStorage.get("cityId");
    if (cityId) {
      setCityId(cityId);
    }
  }, [cityId]);

  return (
    <ContentErrorBoundary>
      <ContentContext.Provider value={cityId}>
        <Box>
          {<SearchCity onSubmit={setCityId} />}
          {cityId && <WeatherForecast city={LocalStorage.get("city")} />}
        </Box>
      </ContentContext.Provider>
    </ContentErrorBoundary>
  );
};

export default Content;