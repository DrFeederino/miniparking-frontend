import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import Spot from './spot';

const Spots = ({ location, spots, refresh }) => {
  const { classes } = useStoreState((state) => state.classes);

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Grid container className={classes.root} spacing={2}>
          {spots !== null && spots.length > 0 ? (
            spots.map((spot) => (
              <Spot
                key={spot.id}
                spotId={spot.id}
                name={spot.spotTitle}
                available={spot.available}
                driverId={spot.driverId}
                officeId={location.officeId}
                refresh={refresh}
              />
            ))
          ) : (
            <Typography style={{ margin: '16px' }}>No spots data</Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Spots;
