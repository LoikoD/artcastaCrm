import React, { useEffect } from 'react'
import { useTable, useSortBy, useBlockLayout, useResizeColumns, usePagination } from 'react-table'
import { SortDirection } from './redux/enums';
import './styles/BasicTable.css';


function BasicTable({ columns, data, onRowClicked }) {

    //columnsArg should be w/o ID attr and sorted by ord

    const defaultColumn = React.useMemo(
        () => ({
            minWidth: 30,
            width: 200,
            maxWidth: 800,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state
    } = useTable({ columns, data, defaultColumn }, useSortBy, useBlockLayout, useResizeColumns, usePagination);

    const { pageIndex, pageSize } = state;

    useEffect(() => {
        setPageSize(50);
    }, [setPageSize]);

    return (
        <>
            <table className='custom-tbl table table-striped table-bordered table-hover' {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th className='attr-header-cell' {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    <div className='attr-header-div' >
                                        <div>{column.render('Header')}</div>
                                        <span className='sort-arrow'>{column.isSorted ? (column.isSortedDesc ? SortDirection.DOWN : SortDirection.UP) : ''}</span>
                                    </div>
                                    <div
                                        className={`resizer ${column.isResizing ? 'resizing' : ''}`}
                                        {...column.getResizerProps()}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                                    />
                                </th>
                            ))}
                        </tr>
                    ))}

                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} className='attr-row'>
                                {row.cells.map(cell => {
                                    return <td className='attr-cell' {...cell.getCellProps()} onClick={() => onRowClicked(cell.row.original)}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {pageOptions.length > 0 ?
                <div className='pagination-block'>
                    <span>
                        Страница{' '}
                        <strong>
                            {pageIndex + 1} из {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <span>
                        | Перейти на страницу: {' '}
                        <input type='number' defaultValue={pageIndex + 1}
                            onChange={e => {
                                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(pageNumber)
                            }}
                            style={{ width: '50px', textAlign: 'center' }}
                        />
                    </span>
                    <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                        {
                            [5, 10, 25, 50, 100].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Отображать {pageSize}
                                </option>
                            ))
                        }
                    </select>
                    <button className='page-btn' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                    <button className='page-btn' onClick={() => previousPage()} disabled={!canPreviousPage}>Предыдущая страница</button>
                    <button className='page-btn' onClick={() => nextPage()} disabled={!canNextPage}>Следующая страница</button>
                    <button className='page-btn' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
                </div>
                : <></>
            }
        </>
    )
}

export default BasicTable;