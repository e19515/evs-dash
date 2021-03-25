import { useMemo } from 'react'
import { useTable } from 'react-table'

function ChargePointTable({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Site',
        accessor: 'SiteDescription', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'FriendlyName',
      },
      {
        Header: '% charged',
        accessor: 'StateOfCharge',
      },
    ], []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    /* Adapted from react-table documentation */
    <table {...getTableProps(
      [{
        className: "table table-striped table-sm",
      },]
    )}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps(
                    [{
                      style: {
                        /* color StateOfCharge column */
                        backgroundColor: (cell.column.id === 'StateOfCharge') &&  Number.isInteger(cell.value) && ( 0 <= cell.value===cell.value <= 100 )  ?
                          `hsl(${120 * cell.value/100 }, 100%, 67%)`
                        :
                          'unset'
                        ,
                      },
                    },]
                  )}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ChargePointTable;
