import React, { forwardRef, useEffect, useState } from 'react';

import { useStoreState, useStoreActions } from 'easy-peasy';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {
  Snackbar,
  Slide,
} from '@material-ui/core';
import {
  Alert,
} from '@material-ui/lab';
import fetchData from '../../utils/fetchData';


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const columns = [
  {
    title: 'Name',
    field: 'name',
  },
  {
    title: 'Email',
    field: 'email',
  },
  {
    title: 'Office',
    field: 'office',
    editable: 'never',
  },
  {
    title: 'Spot',
    field: 'spot',
    editable: 'never',
  },
];

const EMPTY_DATA = [
  {
    name: '',
    email: '',
    office: '',
    spot: '',
  },
];

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const Drivers = () => {
  const { drivers } = useStoreState((state) => state.drivers);
  const { setDrivers } = useStoreActions((actions) => actions.drivers);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validEmail = (email) => EMAIL_REGEX.test(email);

  const parseData = async (data) => {
    const parsedData = [];
    if (data.length === 0) {
      return EMPTY_DATA;
    }

    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      el.office = 'None';
      if (el.officeId) {
        const office = await fetchData(`offices/${el.officeId}`, 'GET', null);
        el.office = 'officeTitle' in office && office.officeTitle;
      }
      el.spot = 'None';
      if (el.spotId) {
        const spot = await fetchData(`spots/${el.spotId}`, 'GET', null);
        el.spot = 'spotTitle' in spot && spot.spotTitle;
      }
      parsedData.push(el);
    }

    return parsedData;
  };

  const handleRefreshData = async () => {
    const data = await fetchData('drivers', 'GET', null);
    const parsedData = await parseData(data);
    setDrivers(parsedData);
  };

  const handleAdd = async (data) => {
    if (!validEmail(data.email)) {
      setOpen(true);
      setErrorMessage(`Email is not valid for  driver ${data.name || ''}`);
      throw new Error();
    }
    await fetchData('drivers', 'POST', data);
    await handleRefreshData();
  };

  const handleDelete = async (data) => {
    await fetchData(`drivers/${data.id}`, 'DELETE', null);
    await handleRefreshData();
  };

  const handleUpdate = async (newData, oldData) => {
    const driver = { ...newData };
    if (!validEmail(driver.email)) {
      setOpen(true);
      setErrorMessage(`Email is not valid for driver ${driver.name || ''}`);
      throw new Error();
    }

    Object.keys(driver).forEach((key) => {
      if (driver[key] === 'None') {
        driver[key] = null;
      }
    });
    const response = await fetchData(`drivers/${oldData.id}`, 'PUT', driver);
    if ('message' in response) {
      setOpen(true);
      setErrorMessage('Email is already taken');
      throw new Error();
    }
    await handleRefreshData();
  };

  const handleOpenOrClose = () => setOpen(!open);

  useEffect(() => {
    handleRefreshData();
  }, []);


  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <MaterialTable
          title="Drivers"
          columns={columns}
          data={drivers}
          editable={{
            onRowAdd: async (newData) => handleAdd(newData),
            onRowDelete: async (oldData) => handleDelete(oldData),
            onRowUpdate: async (newData, oldData) => handleUpdate(newData, oldData),
          }}
          icons={tableIcons}
        />
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleOpenOrClose}
        TransitionComponent={Slide}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <Alert elevation={6} variant="filled" severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Drivers;
