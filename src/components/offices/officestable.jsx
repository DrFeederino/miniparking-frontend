import React from 'react';
import {
  TableHead,
  TableCell,
  TableRow,
  Paper,
  Table,
  Typography,
  TableBody,
  Grid,
} from '@material-ui/core';
import { useStoreState } from 'easy-peasy';

const columns = [
  'Office',
  'Locations',
  'Drivers',
];

const OfficesTable = ({ offices }) => {
  const { classes } = useStoreState((state) => state.classes);
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Paper className={classes.paper}>
        <Typography variant="h6">
          Offices
        </Typography>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {offices.length > 0 ? offices.map((office) => (
              <TableRow key={office.officeTitle}>
                <TableCell>
                  {office.officeTitle}
                </TableCell>
                <TableCell>
                  {office.locationIds.length}
                </TableCell>
                <TableCell>
                  {office.driverIds.length}
                </TableCell>
              </TableRow>
            ))
              : (
                <TableRow rowSpan={3}>
                  <TableCell
                    colSpan={3}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    No offices
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};
export default OfficesTable;
