import React, { useState } from 'react';
import {
  Grid,
  Button,
  Collapse,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Slider,
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import { useStoreState } from 'easy-peasy';
import Spots from '../spots/spots';
import fetchData from '../../utils/fetchData';

const LocationMap = ({ location, refresh }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(location.locationTitle || '');
  const [spotName, setSpotName] = useState('');
  const [number, setNumber] = useState(location.capacity || 0);
  const [isAddingSpots, setIsAddingSpots] = useState(false);
  const [range, setRange] = useState([1, location.capacity]);
  const [errorMsg, setErrorMsg] = useState('');
  const { classes } = useStoreState((state) => state.classes);

  const handleShowing = () => setIsShowing(!isShowing);
  const handleEditing = () => setIsEditing(!isEditing);
  const handleIsAddingSpots = () => setIsAddingSpots(!isAddingSpots);

  const handleSubmitSpots = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const [from, to] = range;
    const currentLocation = await fetchData(`locations/${location.id}`, 'GET', null);
    const response = await fetchData(`spots/?name=${spotName}&from=${from}&to=${to}`, 'POST', currentLocation);
    if ('message' in response !== true) {
      setIsAddingSpots(false);
      setIsShowing(true);
      await refresh();
    } else {
      setErrorMsg(response.message);
    }
    setName('');
  };

  const handleDelete = async () => {
    await fetchData(`locations/${location.id}`, 'DELETE', null);
    await refresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...location,
      locationTitle: name,
      capacity: number,
    };
    setIsEditing(false);
    await fetchData(`locations/${location.id}`, 'PUT', body);
    await refresh();
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
      <div className={classes.titleWithTooltip}>
        <Typography component="h2" variant="h6" gutterBottom>
          {location.locationTitle || 'No name'}
        </Typography>
        <div className={classes.buttons}>
          <Tooltip title="Delete location" onClick={handleDelete} color="secondary" variant="contained" className={clsx(classes.tooltip, classes.delete)}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip disabled={isEditing} title="Edit location name" onClick={handleEditing} color="secondary" variant="contained" className={clsx(classes.tooltip, classes.edit)}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip disabled={isAddingSpots} title="Add spots" onClick={handleIsAddingSpots} color="secondary" variant="contained" className={clsx(classes.tooltip, classes.proceed)}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Typography component="h3" variant="subtitle1" gutterBottom>
        Capacity:
        {' '}
        {location.capacity || 0}
      </Typography>
      <Collapse in={isEditing}>
        <form onSubmit={handleSubmit}>
          <Grid item>
            <TextField
              autoFocus
              required
              name=""
              label="Location name"
              value={name}
              fullWidth
              onChange={(e) => setName(e.target.value)}
              type="string"
              className={classes.input}
            />
            <TextField
              label="Capacity"
              type="number"
              required
              fullWidth
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              className={classes.input}
            />
          </Grid>
          <div className={classes.buttons}>
            <IconButton
              variant="contained"
              color="secondary"
              className={clsx(classes.next, classes.delete)}
              onClick={handleEditing}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              variant="contained"
              color="secondary"
              className={clsx(classes.next, classes.proceed)}
              type="submit"
            >
              <DoneIcon />
            </IconButton>
          </div>
        </form>
      </Collapse>
      <Collapse in={isAddingSpots}>
        <form onSubmit={handleSubmitSpots}>
          <TextField
            autoFocus
            required
            label="Enter name for spot"
            value={spotName}
            fullWidth
            onChange={(e) => setSpotName(e.target.value)}
            type="string"
            className={classes.input}
            error={errorMsg !== ''}
            helperText={errorMsg}
          />
          <Typography gutterBottom>
            Range
          </Typography>
          <Slider
            min={1}
            max={location.capacity || 100}
            onChange={(e, numbers) => setRange(numbers)}
            value={range}
            valueLabelDisplay="auto"
          />
          <div className={classes.buttons}>
            <IconButton variant="contained" className={clsx(classes.next, classes.delete)} onClick={handleIsAddingSpots}>
              <CloseIcon />
            </IconButton>
            <IconButton type="submit" variant="contained" className={clsx(classes.next, classes.proceed)}>
              <AddIcon />
            </IconButton>
          </div>
        </form>
      </Collapse>
      <div className={classes.collapse}>
        <Button
          startIcon={(
            <ArrowForwardIosIcon style={{
              transform: `rotate(${isShowing ? '90deg' : '0deg'})`,
              transition: 'all 330ms ease-in-out',
            }}
            />
)}
          onClick={handleShowing}
        >
          Show spots
        </Button>
      </div>
      <Collapse in={isShowing}>
        <Spots location={location} refresh={refresh} />
      </Collapse>
    </Grid>
  );
};

export default LocationMap;
