import type { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { EmptyState } from './EmptyState'

export interface AppTableColumn<T> {
  id: string
  label: string
  align?: 'left' | 'right' | 'center'
  render: (row: T) => ReactNode
  minWidth?: number
}

interface AppTableProps<T> {
  columns: AppTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  emptyMessage?: string
}

export function AppTable<T>({
  columns,
  rows,
  getRowId,
  emptyMessage,
}: AppTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}
    >
      <Table size="medium">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{ fontWeight: 650, minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowId(row)} hover>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
