import React, { useState, useEffect } from 'react';
import {
  Button,
  Paper,
  Select,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  DialogActions,
  DialogContentText,
} from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import clsx from 'clsx';
import fetchData from '../../utils/fetchData';

const Spot = ({
  spotId, name, available, driverId, refresh, officeId,
}) => {
  const [open, setOpen] = useState(false);
  const { drivers } = useStoreState((state) => state.drivers);
  const { classes } = useStoreState((state) => state.classes);
  const [id, setId] = useState('none');
  const [driverName, setDriveName] = useState('');
  const [confirm, setConfirm] = useState(false);

  const handleRefreshData = async () => {
    if (driverId) {
      const driver = await fetchData(`drivers/${driverId}`, 'GET', null);
      setDriveName(driver.name);
    } else {
      setDriveName('');
    }
  };

  useEffect(() => {
    handleRefreshData();
  }, [driverId]);


  const updateSpot = async (spot) => await fetchData(`spots/${spot.id}`, 'PUT', spot);

  const updateDriver = async (driver) => await fetchData(`drivers/${driver.id}`, 'PUT', driver);

  const getDriver = async (id) => await fetchData(`drivers/${id}`, 'GET', null);

  const getSpot = async (id) => await fetchData(`spots/${id}`, 'GET', null);

  const handleOpen = () => setOpen(!open);

  const handleConfirm = () => setConfirm(!confirm);

  const updateAll = async (driver, spot) => {
    await updateDriver(driver);
    await updateSpot(spot);
  };

  const refreshAll = async () => {
    await refresh();
    await handleRefreshData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id === 'none') {
      setOpen(false);
      return;
    }
    const driver = await getDriver(id);
    setOpen(false);
    if (!driver.spotId) {
      const spot = await getSpot(spotId);
      spot.available = false;
      spot.driverId = driver.id;
      driver.spotId = spot.id;
      driver.officeId = officeId;
      await updateAll(driver, spot);
      await refreshAll();
    } else {
      handleConfirm();
    }
  };

  const getAndRemoveDriverIfSpotIsTaken = async () => {
    const currentSpot = await getSpot(spotId);
    if (currentSpot.driverId) {
      const currentSpotDriver = await fetchData(`drivers/${currentSpot.driverId}`, 'GET', null);
      currentSpotDriver.spotId = null;
      await updateDriver(currentSpotDriver);
    }
    currentSpot.available = true;
    currentSpot.driverId = null;
    const spot = await updateSpot(currentSpot);
    return spot;
  };

  const getDriverAndReleaseSpot = async (id) => {
    const driver = await getDriver(id);
    const driversSpot = await fetchData(`spots/${driver.spotId}`, 'GET', null);
    driversSpot.available = true;
    driversSpot.driverId = null;
    await fetchData(`spots/${driversSpot.id}`, 'PUT', driversSpot);
    driver.spotId = null;
    const data = await fetchData(`drivers/${driver.id}`, 'PUT', driver);
    return data;
  };

  const handleSubmitAfterConfirm = async () => {
    setConfirm(false);
    const currentSpot = await getAndRemoveDriverIfSpotIsTaken();
    const driver = await getDriverAndReleaseSpot(id);
    currentSpot.available = false;
    currentSpot.driverId = driver.id;
    driver.spotId = currentSpot.id;
    driver.officeId = officeId;
    await updateAll(driver, currentSpot);
    await refreshAll();
    setDriveName('');
  };

  return (
    <>
      <Paper className={classes.paperSpot}>
        <Card
          style={{
            backgroundColor: available ? '#C9DB48' : '#F15C43',
          }}
          onClick={handleOpen}
          className={classes.spot}
        >
          <div>
            <Typography className={classes.spotTitle}>
              {name || ''}
            </Typography>
          </div>
          <div style={{
            padding: '0 4px',
          }}
          >
            <Typography
              style={{
                fontSize: '13px',
                textAlign: 'center',
              }}
              component="h3"
              variant="h5"
              gutterBottom
            >
              {driverName !== '' ? `assigned to ${driverName}` : ''}
            </Typography>
          </div>
        </Card>
      </Paper>
      <Dialog open={open} onClose={handleOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select a driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a driver to assign to the spot.
          </DialogContentText>
          <Select
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ width: '100%' }}
          >
            <MenuItem value="none">
              <em>None</em>
            </MenuItem>
            {drivers.length > 0 && drivers.map((driver) => (
              <MenuItem key={driver.id + driver.email} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color="primary" className={clsx(classes.delete, classes.next)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" className={clsx(classes.next, classes.proceed)}>
            Select
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirm} onClose={handleConfirm} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Confirm reassignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Current driver has an assigned spot already, are you sure you want to reassign the spot?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary" className={clsx(classes.delete, classes.next)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitAfterConfirm} color="primary" className={clsx(classes.next, classes.proceed)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Spot;
