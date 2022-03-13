import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {INTEREST_RATE_PER_1L_PER_DAY} from "../grid/Grid";

function getTimeDiffInDays(row) {
  if(row.invoiceDate && row.settlementDate) {
    const startDate = new Date(row.invoiceDate)
    const endingDate = new Date(row.settlementDate)
    return ((endingDate - startDate) / (1000 * 3600 * 24)) + 1
  }
  return 0
}

function calculateInterest(row) {
  if (row.transactionAmount) {
    return Math.round(getTimeDiffInDays(row) * INTEREST_RATE_PER_1L_PER_DAY * (row.transactionAmount / 100000));
  }
  return 0;
}
export default function Report({ data }) {
  return (
    <TableContainer component={Paper} style={{ marginTop: '10px'}}>
      <Table sx={{ maxWidth: 650 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell><b>Start Date</b></TableCell>
            <TableCell><b>End Date</b></TableCell>
            <TableCell><b>Number of Days</b></TableCell>
            <TableCell><b>Interest Rate (Rs/1 Lakh/Day)</b></TableCell>
            <TableCell><b>Interest</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            return (
            <TableRow key={row.farmerName}>
              <TableCell component="th" scope="row">{row.invoiceDate}</TableCell>
              <TableCell component="th" scope="row">{row.settlementDate}</TableCell>
              <TableCell component="th" scope="row">{getTimeDiffInDays(row)}</TableCell>
              <TableCell component="th" scope="row">{INTEREST_RATE_PER_1L_PER_DAY}</TableCell>
              <TableCell component="th" scope="row">{calculateInterest(row)}</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}