import React, { useState } from 'react';
import { Grid, TextField, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { useStoreState, useStoreActions } from 'easy-peasy';
import clsx from 'clsx';
import fetchData from '../../utils/fetchData';

const Location = ({ setStatus, refresh }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const { classes } = useStoreState((state) => state.classes);
  const { office } = useStoreState((state) => state.offices);
  const { setOffice } = useStoreActions((actions) => actions.offices);

  const updateOffice = async (data) => {
    if ('message' in data !== true) {
      setName('');
      setNumber(0);
      setStatus();
      office.locationIds.push(data.id);
      setOffice(office);
      await refresh();
    } else {
      setErrorMsg(data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const location = {
      locationTitle: name,
      capacity: parseInt(number, 10),
      officeId: office.id,
    };
    const data = await fetchData('locations', 'POST', location);
    await updateOffice(data);
  };

  return (
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
          error={errorMsg !== ''}
          helperText={errorMsg}
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
          onClick={() => setStatus()}
        >
          <CloseIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          className={clsx(classes.next, classes.proceed)}
          type="submit"
        >
          <AddIcon />
        </IconButton>
      </div>
    </form>
  );
};

export default Location;
