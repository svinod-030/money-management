import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {INTEREST_RATE_PER_1L_PER_DAY} from "../grid/Grid";

function getTimeDiffInDays(fromDate, toDate) {
  if(fromDate && toDate) {
    return ((new Date(toDate) - new Date(fromDate)) / (1000 * 3600 * 24)) + 1
  }
  return 0
}

function calculateInterest(amount, fromDate, toDate) {
  if (amount) {
    return Math.round(getTimeDiffInDays(fromDate, toDate) * INTEREST_RATE_PER_1L_PER_DAY * (amount / 100000));
  }
  return 0;
}
export default function Report({ transactions, bills }) {

  const [state, setState] = React.useState({transactions, bills})
  const [completedTransactions, setCompletedTransactions] = React.useState([])
  const tempTransactions = []
  function processTransaction(transaction) {
    if(transaction.transactionAmount <= 0) return
    bills.forEach(bill => {
      if(bill.settlementAmount <= 0 || transaction.transactionAmount <= 0) return
      let originalTransactionAmount = transaction.transactionAmount
      let completedTransactionAmount = transaction.transactionAmount
      let completedBillAmount = bill.settlementAmount
      if (transaction.transactionAmount <= bill.settlementAmount) {
        bill.settlementAmount = bill.settlementAmount - transaction.transactionAmount
        transaction.transactionAmount = 0
      } else {
        transaction.transactionAmount = transaction.transactionAmount - bill.settlementAmount
        completedTransactionAmount = bill.settlementAmount
        bill.settlementAmount = 0
      }
      tempTransactions.push({
        id: Math.random(),
        transactionAmount: originalTransactionAmount,
        clearedTransactionAmount: completedTransactionAmount,
        remainingTransactionAmount: transaction.transactionAmount,
        settlementAmount: completedBillAmount,
        invoiceDate: transaction.invoiceDate,
        settlementDate: bill.settlementDate,
        daysIncurred: getTimeDiffInDays(transaction.invoiceDate, bill.settlementDate),
        interest: calculateInterest(completedTransactionAmount, transaction.invoiceDate, bill.settlementDate)
      })
      processTransaction(transaction)
    })
    setCompletedTransactions(tempTransactions)
  }

  React.useEffect(() => {
    transactions.forEach(transaction => processTransaction(transaction))
  }, [])

  React.useEffect(() => {
    console.log('completedTransactions', completedTransactions)
  }, [completedTransactions])

  return (
    <TableContainer component={Paper} style={{ marginTop: '10px'}}>
      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell><b>Transaction Amount</b></TableCell>
            <TableCell><b>Cleared</b></TableCell>
            <TableCell><b>Remaining</b></TableCell>
            <TableCell><b>Invoice Date</b></TableCell>
            <TableCell><b>Bill Amount</b></TableCell>
            <TableCell><b>Bill Date</b></TableCell>
            <TableCell><b>Number of Days</b></TableCell>
            <TableCell><b>Interest Rate (Rs/1 Lakh/Day)</b></TableCell>
            <TableCell><b>Interest</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {completedTransactions.map((row) => {
            return (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.transactionAmount}</TableCell>
              <TableCell component="th" scope="row">{row.clearedTransactionAmount}</TableCell>
              <TableCell component="th" scope="row">{row.remainingTransactionAmount}</TableCell>
              <TableCell component="th" scope="row">{row.invoiceDate}</TableCell>
              <TableCell component="th" scope="row">{row.settlementAmount}</TableCell>
              <TableCell component="th" scope="row">{row.settlementDate}</TableCell>
              <TableCell component="th" scope="row">{row.daysIncurred}</TableCell>
              <TableCell component="th" scope="row">{INTEREST_RATE_PER_1L_PER_DAY}</TableCell>
              <TableCell component="th" scope="row">{row.interest}</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}