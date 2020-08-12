import React, { useEffect, useState } from 'react';
import {
  Paper,
  Button,
  Collapse,
  Typography,
  Grid,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';
import clsx from 'clsx';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DeleteIcon from '@material-ui/icons/Delete';
import fetchData from '../../utils/fetchData';
import useStyles from '../../utils/styles';
import Office from './office';
import OfficesTable from './officestable';

const Offices = () => {
  const classes = useStyles();
  const { offices } = useStoreState((state) => state.offices);
  const { setOffices, setOffice } = useStoreActions(
    (actions) => actions.offices,
  );
  const { setCurrentMode } = useStoreActions((actions) => actions.modes);
  const { currentMode } = useStoreState((state) => state.modes);
  const [isAdding, setIsAdding] = useState(false);
  const [val, setVal] = useState('none');

  const handleRefreshData = async () => {
    const data = await fetchData('offices', 'GET', null);
    setOffices(data);
  };

  useEffect(() => {
    handleRefreshData();
  }, []);

  const handleDelete = async () => {
    if (offices !== null && offices.length && val !== 'none') {
      const { id } = offices[val];
      await fetchData(`offices/${id}`, 'DELETE', null);
      await handleRefreshData();
    }
    setVal('none');
  };

  const handleGoToOffice = async (e) => {
    e.preventDefault();
    if (val === '' || val === 'none') return;
    const { id } = offices[val];
    const office = await fetchData(`offices/${id}`, 'GET', null);
    setOffice(office);
    setCurrentMode(parseInt(currentMode, 10) + 1);
  };

  return (
    <>
      <OfficesTable offices={offices} />
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <form onSubmit={handleGoToOffice}>
            <Typography component="h2" variant="h6" gutterBottom>
              Select an office
            </Typography>
            <Select
              onChange={(e) => {
                setVal(e.target.value);
              }}
              style={{ width: '100%' }}
              value={val}
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              {offices.map((office, index) => (
                <MenuItem key={office.id} value={index}>
                  {`${`Office at ${office.officeTitle} Str`}`}
                </MenuItem>
              ))}
            </Select>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                className={clsx(classes.next, classes.delete)}
                onClick={handleDelete}
                disabled={val === 'none'}
              >
                <DeleteIcon />
              </Button>
              <Button
                type="submit"
                variant="contained"
                className={clsx(classes.next, classes.proceed)}
                disabled={val === 'none'}
              >
                <ArrowForwardIcon />
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <div className={classes.collapse}>
            <Button
              startIcon={(
                <ArrowForwardIosIcon
                  style={{
                    transform: `rotate(${isAdding ? '90deg' : '0deg'})`,
                    transition: 'all 330ms ease-in-out',
                  }}
                />
              )}
              onClick={() => setIsAdding(!isAdding)}
            >
              Add an office
            </Button>
          </div>
          <Collapse in={isAdding}>
            <Office setIsAdding={setIsAdding} refresh={handleRefreshData} />
          </Collapse>
        </Paper>
      </Grid>
    </>
  );
};

export default Offices;
