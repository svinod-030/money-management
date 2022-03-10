import React from 'react'
import styled from 'styled-components'
import { usePagination, useTable } from 'react-table'
import { Button, Stack } from '@mui/material'
import Report from '../report/Report'

const makeData = () => {
  return [{
    farmerName: 'SRI ANJANI GUNNY TRADERS',
    agentName: 'K SUDHEER',
    companyName: 'MUNNANGI',
    transactionAmount: '3222824',
    invoiceDate: '2022/01/01',
    settlementAmount: '3499767',
    settlementDate: '2022/01/20',
    interest: INTEREST_RATE_PER_1L_PER_DAY
  }]
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
  interest: INTEREST_RATE_PER_1L_PER_DAY
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
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
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
      {/*<div className="pagination">*/}
      {/*  <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>*/}
      {/*    {'<<'}*/}
      {/*  </button>{' '}*/}
      {/*  <button onClick={() => previousPage()} disabled={!canPreviousPage}>*/}
      {/*    {'<'}*/}
      {/*  </button>{' '}*/}
      {/*  <button onClick={() => nextPage()} disabled={!canNextPage}>*/}
      {/*    {'>'}*/}
      {/*  </button>{' '}*/}
      {/*  <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>*/}
      {/*    {'>>'}*/}
      {/*  </button>{' '}*/}
      {/*  <span>*/}
      {/*    Page{' '}*/}
      {/*    <strong>*/}
      {/*      {pageIndex + 1} of {pageOptions.length}*/}
      {/*    </strong>{' '}*/}
      {/*  </span>*/}
      {/*  <span>*/}
      {/*    | Go to page:{' '}*/}
      {/*    <input*/}
      {/*      type="number"*/}
      {/*      defaultValue={pageIndex + 1}*/}
      {/*      onChange={e => {*/}
      {/*        const page = e.target.value ? Number(e.target.value) - 1 : 0*/}
      {/*        gotoPage(page)*/}
      {/*      }}*/}
      {/*      style={{ width: '100px' }}*/}
      {/*    />*/}
      {/*  </span>{' '}*/}
      {/*  <select*/}
      {/*    value={pageSize}*/}
      {/*    onChange={e => {*/}
      {/*      setPageSize(Number(e.target.value))*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {[10, 20, 30, 40, 50].map(pageSize => (*/}
      {/*      <option key={pageSize} value={pageSize}>*/}
      {/*        Show {pageSize}*/}
      {/*      </option>*/}
      {/*    ))}*/}
      {/*  </select>*/}
      {/*</div>*/}
    </>
  )
}

function Grid() {
  const columns = React.useMemo(
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
            accessor: 'interest',
            // Cell: ({ value }) => String(value)
          }
        ],
      },
    ],
    []
  )

  const [data, setData] = React.useState(() => makeData(20))
  const [originalData] = React.useState(data)
  const [skipPageReset, setSkipPageReset] = React.useState(false)
  const [showReport, setShowReport] = React.useState(true)

  const updateMyData = (rowIndex, columnId, value) => {
    setSkipPageReset(true)
    setData(old =>
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
  }, [data])

  const resetData = () => setData(originalData)
  const addRow = () => setData([...data, EMPTY_ROW_DATA])
  const generateReport = () => setShowReport(!showReport)

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
      />
      <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
        <Button variant="outlined" onClick={resetData}>Reset Data</Button>
        <Button variant="outlined" onClick={addRow}>Add Row</Button>
        <Button variant="outlined" onClick={generateReport}>{!showReport ? 'Show': 'Hide'} Report</Button>
      </Stack>
      {showReport && <Report data={data}/>}
    </Styles>
  )
}

export default Grid
