import React from 'react'
import styled from 'styled-components'
import { usePagination, useTable } from 'react-table'
import { Button, Stack } from '@mui/material'
import Report from '../report/Report'
import lot from '../../data/lot-1.json'

const makeTransactions = () => {
  return lot.transactions
}
const makeBills = () => {
  return lot.bills
}
export const INTEREST_RATE_PER_1L_PER_DAY = 100;
const EMPTY_ROW_DATA = {
  farmerName: '',
  agentName: '',
  companyName: '',
  transactionAmount: '',
  invoiceDate: '',
  settlementAmount: '',
  settlementDate: '',
  interestRate: INTEREST_RATE_PER_1L_PER_DAY
}

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;
    margin-bottom: 10px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

const EditableCell = ({
                        value: initialValue,
                        row: { index },
                        column: { id },
                        updateMyData,
                      }) => {
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

const defaultColumn = {
  Cell: EditableCell,
}

function Table({ columns, data, updateMyData, skipPageReset }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    },
    usePagination
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </>
  )
}

function Grid() {
  const transactionColumns = React.useMemo(
    () => [
      {
        Header: 'General Details',
        columns: [
          {
            Header: 'Farmer Name',
            accessor: 'farmerName',
          },
          {
            Header: 'Agent Name',
            accessor: 'agentName',
          },
          {
            Header: 'Company Name',
            accessor: 'companyName',
          },
        ],
      },
      {
        Header: 'Transaction Details',
        columns: [
          {
            Header: 'Transaction Amount',
            accessor: 'transactionAmount',
          },
          {
            Header: 'Invoice Date',
            accessor: 'invoiceDate',
            // Cell: ({ value }) => value ? new Date(value).toDateString() : 'N.A'
          },
        ],
      },
    ],
    []
  )
  const billColumns = React.useMemo(
    () => [
      {
        Header: 'Bill Details',
        columns: [
          {
            Header: 'Settlement Amount',
            accessor: 'settlementAmount',
          },
          {
            Header: 'Date',
            accessor: 'settlementDate',
            // Cell: ({ value }) => value ? new Date(value).toDateString() : 'N.A'
          },
        ],
      },
      {
        Header: 'Interest',
        columns: [
          {
            Header: 'Rs/1 Lakh/Day',
            accessor: 'interestRate',
            // Cell: ({ value }) => String(value)
          }
        ],
      },
    ],
    []
  )

  const [transactions, setTransactions] = React.useState(() => makeTransactions(20))
  const [bills, setBills] = React.useState(() => makeBills(20))
  const [originalTransactions] = React.useState(transactions)
  const [originalBills] = React.useState(bills)
  const [skipPageReset, setSkipPageReset] = React.useState(false)
  const [showReport, setShowReport] = React.useState(false)

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true)
    setTransactions(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
            margin: getMargin(row),
            remaining: getRemaining(row)
          }
        }
        return row
      })
    )
    setBills(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const getMargin = (row) => {
    if (row.invoiceDate && row.settlementDate && row.transactionAmount) {
      const startDate = new Date(row.invoiceDate)
      const endingDate = new Date(row.settlementDate)
      const transactionAmount = row.transactionAmount
      const timeDiffInDays = (endingDate - startDate) / (1000 * 3600 * 24)
      return timeDiffInDays * INTEREST_RATE_PER_1L_PER_DAY * transactionAmount / 100000;
    }
    return 0
  }

  const getRemaining = (row) => {
    const margin = getMargin(row);
    if (row.settlementAmount && margin > 0) {
      return row.settlementAmount - margin
    }
    return ''
  }

  React.useEffect(() => {
    setSkipPageReset(false)
    console.log('updated...')
  }, [transactions, bills])

  const resetTransactions = () => setTransactions(originalTransactions)
  const resetBills = () => setBills(originalBills)
  const addTransaction = (transaction) => transaction ? setTransactions([...transactions, transaction]) : setTransactions([...transactions, EMPTY_ROW_DATA])
  const addBill = (bill) => bill ? setBills([...bills, bill]) : setBills([...bills, EMPTY_ROW_DATA])
  const generateReport = () => {
    setShowReport(true)
  }

  return (
    <Styles>
      {showReport ? <Report transactions={transactions} bills={bills} setShowReport={setShowReport}/> :
      <div>
        <Stack direction="row" justifyContent={'center'}>
          <Table
            columns={transactionColumns}
            data={transactions}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
          />
          <Table
            columns={billColumns}
            data={bills}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={'center'}>
          <Stack direction="row" justifyContent={'center'}>
            <Button variant="outlined" onClick={addTransaction}>Add Transaction</Button>
            <Button variant="outlined" onClick={resetTransactions}>Reset Transactions</Button>
          </Stack>
          <Stack direction="row" justifyContent={'center'}>
            <Button variant="outlined" onClick={addBill}>Add Bill</Button>
            <Button variant="outlined" onClick={resetBills}>Reset Bills</Button>
          </Stack>
          <Stack direction="row" justifyContent={'center'}>
            <Button variant="contained" onClick={generateReport}>Generate Report</Button>
          </Stack>
        </Stack>
      </div>
      }
    </Styles>
  )
}

export default Grid
