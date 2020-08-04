import React, { useState } from 'react';
import {
  Grid,
  TextField,
  IconButton,
} from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import fetchData from '../../utils/fetchData';

const Office = ({ setIsAdding, refresh }) => {
  const [name, setName] = useState('');
  const { classes } = useStoreState((state) => state.classes);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const office = {
      officeTitle: name,
    };

    const data = await fetchData('offices', 'POST', office);

    if ('message' in data !== true) {
      setName('');
      setIsAdding();
      refresh();
    } else {
      setErrorMsg(data.message);
    }
  };

  const handleChange = (e) => {
    setErrorMsg('');
    setName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid item>
        <TextField
          autoFocus
          required
          name=""
          label="Office name"
          value={name}
          fullWidth
          onChange={handleChange}
          type="string"
          error={errorMsg !== ''}
          helperText={errorMsg}
          className={classes.input}
        />
      </Grid>
      <div className={classes.buttons}>
        <IconButton
          variant="contained"
          color="secondary"
          className={clsx(classes.next, classes.delete)}
          onClick={() => setIsAdding()}
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

export default Office;
