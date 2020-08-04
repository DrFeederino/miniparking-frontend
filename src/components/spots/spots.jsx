import React, { useState, useEffect } from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import {
  useStoreState,
} from 'easy-peasy';
import Spot from './spot';
import fetchData from '../../utils/fetchData';

const Spots = ({ location }) => {
  const { classes } = useStoreState((state) => state.classes);
  const [spots, setSpots] = useState([]);

  const handleRefreshData = async () => {
    const fetchedSpots = [];
    const spotIds = [];
    location.spotIds.forEach(spot => spotIds.push(spot));
    spotIds.sort((first, second) => first - second);
    for (let i = 0; i < spotIds.length; i++) {
      const spotId = spotIds[i];
      const response = await fetchData(`spots/${spotId}`, 'GET', null);
      if ('message' in response !== true) {
        fetchedSpots.push(response);
      }
    }
    setSpots(fetchedSpots);
  };

  useEffect(() => {
    if (spots.length === 0) {
      handleRefreshData();
    }
  }, [location]);

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Grid container className={classes.root} spacing={2}>
          {spots !== null && spots.length > 0
            ? spots.map((spot) => (
              <Spot
                key={spot.id}
                spotId={spot.id}
                name={spot.spotTitle}
                available={spot.available}
                driverId={spot.driverId}
                refresh={handleRefreshData}
                officeId={location.officeId}
              />
            ))
            : (
              <Typography style={{ margin: '16px' }}>
                No spots data
              </Typography>
            )}
        </Grid>
      </Grid>
    </>
  );
};

export default Spots;
