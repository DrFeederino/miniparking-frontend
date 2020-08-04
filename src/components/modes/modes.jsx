import React, { useEffect } from 'react';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ApartmentIcon from '@material-ui/icons/Apartment';
import BusinessIcon from '@material-ui/icons/Business';
import clsx from 'clsx';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Offices from '../offices/offices';
import Location from '../locations/locations';
import Drivers from '../drivers/drivers';
import useStyles from '../../utils/styles';

const availableModes = [
  {
    title: 'Drivers',
    icon: <DirectionsCarIcon />,
    component: <Drivers />,
  },
  {
    title: 'Offices',
    icon: <ApartmentIcon />,
    component: <Offices />,
  },
  {
    title: 'Locations',
    icon: <BusinessIcon />,
    component: <Location />,
  },
];

const Modes = () => {
  const classes = useStyles();
  const { currentMode, modes } = useStoreState((state) => state.modes);
  const { setCurrentMode, setModes } = useStoreActions((actions) => actions.modes);
  const [open, setOpen] = React.useState(false);
  const { setClasses } = useStoreActions((actions) => actions.classes);

  useEffect(() => {
    setClasses(classes);
    setModes(availableModes);
  }, [classes]);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleMode = (e) => {
    setCurrentMode(e.currentTarget.id);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {availableModes[currentMode].title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {modes.map((mode, index) => (
            <ListItem
              id={index}
              button
              key={index}
              onClick={handleMode}
              selected={currentMode === index}
            >
              <ListItemIcon className={classes.darkIcon}>
                {mode.icon}
              </ListItemIcon>
              <ListItemText primary={mode.title} className={classes.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {availableModes[currentMode].component}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Modes;
