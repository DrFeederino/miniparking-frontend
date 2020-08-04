import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#222222',
    color: '#FFFFFF',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: 'none',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#FFF',
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  next: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    boxShadow: 'none',

  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  collapse: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  nodata: {
    color: 'rgba(0, 0, 0, 0.35)',
    textAlign: 'center',
  },
  form: {
    padding: theme.spacing(1),
  },
  darkIcon: {
    color: '#222222',
  },
  proceed: {
    backgroundColor: '#CEDB56',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#C2CE52',
      color: '#EEEEEE',
    },
  },
  delete: {
    backgroundColor: '#D35D47',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#D84831',
      color: '#EEEEEE',
    },
  },
  edit: {
    backgroundColor: '#008ACE',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#2F7DB5',
      color: '#EEEEEE',
    },
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  titleWithTooltip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tooltip: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: '#EEEEEE',
    color: '#464547',
    transition: '330ms all ease-in-out',
  },
  slider: {
    margin: theme.spacing(1),
  },
  spotSelected: {
    position: 'fixed',
    top: '50%',
    left: '15%',
  },
  spot: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    transition: 'all 330ms ease-in-out',
  },
  paperSpot: {
    height: '100px',
    width: '75px',
    margin: '4px',
  },
  spotTitle: {
    fontWeight: 700,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
}));

export default useStyles;
