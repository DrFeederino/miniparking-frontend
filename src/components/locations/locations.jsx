import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  Collapse,
  TextField,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import useStyles from '../../utils/styles';
import Location from './location';
import LocationMap from './locationmap';
import fetchData from '../../utils/fetchData';

const Locations = () => {
  const { locations } = useStoreState((state) => state.locations);
  const { office } = useStoreState((state) => state.offices);
  const { setOffice } = useStoreActions((actions) => actions.offices);
  const { setLocations } = useStoreActions((actions) => actions.locations);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(office ? office.officeTitle : '');
  const [errorMsg, setErrorMsg] = useState('');
  const classes = useStyles();

  useEffect(() => {
    if (office !== null) {
      handleRefreshData();
    }
  }, []);

  const fetchLocationsFromOffice = async (office) => {
    const fetchedLocations = [];
    for (let i = 0; i < office.locationIds.length; i++) {
      const locationId = office.locationIds[i];
      const response = await fetchData(`locations/${locationId}`, 'GET', null);
      if ('message' in response !== true) {
        fetchedLocations.push(response);
      } else {
        setErrorMsg(response.message);
      }
    }
    return fetchedLocations;
  };

  const handleRefreshData = async () => {
    const data = await fetchData(`offices/${office.id}`, 'GET', null);
    setOffice(data);
    const fetchedLocations = await fetchLocationsFromOffice(data);
    setLocations(fetchedLocations);
  };

  const handleAdding = () => setIsAdding(!isAdding);
  const handleEditing = () => setIsEditing(!isEditing);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...office,
      officeTitle: name,
    };
    const data = await fetchData(`offices/${office.id}`, 'PUT', body);
    if ('message' in data) {
      setErrorMsg(data.message);
    } else {
      setOffice(data);
      setName('');
      setIsEditing(false);
    }
  };

  return office ? (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <div className={classes.titleWithTooltip}>
            <Typography component="h2" variant="h6" gutterBottom>
              {`Office at ${office.officeTitle}`}
            </Typography>
            <Tooltip title="Edit office name" onClick={handleEditing} disabled={isEditing} className={clsx(classes.tooltip, classes.edit)}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
          <Collapse in={isEditing}>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                required
                name=""
                label="Office name"
                value={name}
                fullWidth
                onChange={(e) => setName(e.target.value)}
                type="string"
                className={classes.input}
                error={errorMsg !== ''}
                helperText={errorMsg}
              />
              <div className={classes.buttons}>
                <IconButton
                  variant="contained"
                  className={clsx(classes.next, classes.delete)}
                  onClick={handleEditing}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton
                  className={clsx(classes.next, classes.proceed)}
                  variant="contained"
                  type="submit"
                >
                  <DoneIcon />
                </IconButton>
              </div>
            </form>
          </Collapse>
        </Paper>
      </Grid>
      {locations.map((location) => (
        <Grid item xs={12} md={12} lg={12} key={location.id}>
          <Paper className={classes.paper}>
            <LocationMap location={location} refresh={handleRefreshData} />
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <div className={classes.collapse}>
            <Button
              startIcon={(
                <ArrowForwardIosIcon style={{
                  transform: `rotate(${isAdding ? '90deg' : '0deg'})`,
                  transition: 'all 330ms ease-in-out',
                }}
                />
              )}
              onClick={handleAdding}
            >
              Add a location
            </Button>
          </div>
          <Collapse in={isAdding}>
            <Location setStatus={setIsAdding} refresh={handleRefreshData} />
          </Collapse>
        </Paper>
      </Grid>
    </>
  )
    : (
      <Grid item xs={12} md={12} lg={12} style={{ height: '100%' }}>
        <Typography component="h2" variant="h5" className={classes.nodata}>
          No office was selected, please select it from Offices menu
        </Typography>
      </Grid>
    );
};

export default Locations;
