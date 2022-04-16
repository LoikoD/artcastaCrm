import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectRow } from './redux/actions';
import LoadingOverlay from './LoadingOverlay';
import './styles/Navigation.css';
import './styles/TablePage.css';
import { SortDirection } from './redux/enums';

function TablePage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const isLoading = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.isLoading;
    });
    const currentTable = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.currentTable;
    });
    const tables = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.tables;
    });
    const allTables = useSelector(state => {
        const { navigationReducer } = state;
        return navigationReducer.allTables;
    });
    const attrTypes = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.attrTypes;
    });

    const [sortedData, setSortedData] = useState(currentTable?.Data);
    const [sortInfo, setSortInfo] = useState({ sortAttr: "", sortDirection: SortDirection.NONE });

    const handleRowEdit = (row) => {
        dispatch(selectRow(row));
        navigate('/view_row');
    };
    const handleAddRow = (e) => {
        e.preventDefault();

        navigate('/add_row');
    };

    const handleSort = (attrName, attrType) => {
        if (sortInfo.sortAttr === attrName && sortInfo.sortDirection === SortDirection.DOWN) {
            if (attrType === 'date') {
                setSortedData(currentTable?.Data.sort((a, b) => (new Date(a[attrName]).getTime() < new Date(b[attrName]).getTime()) ? 1 : ((new Date(b[attrName]).getTime() < new Date(a[attrName]).getTime()) ? -1 : 0)));
            } else {
                setSortedData(currentTable?.Data.sort((a, b) => (a[attrName] < b[attrName]) ? 1 : ((b[attrName] < a[attrName]) ? -1 : 0)));
            }
            setSortInfo({ sortAttr: attrName, sortDirection: SortDirection.UP })
        } else {
            if (attrType === 'date') {
                setSortedData(currentTable?.Data.sort((a, b) => (new Date(a[attrName]).getTime() > new Date(b[attrName]).getTime()) ? 1 : ((new Date(b[attrName]).getTime() > new Date(a[attrName]).getTime()) ? -1 : 0)));
            } else {
                setSortedData(currentTable?.Data.sort((a, b) => (a[attrName] > b[attrName]) ? 1 : ((b[attrName] > a[attrName]) ? -1 : 0)));
            }
            setSortInfo({ sortAttr: attrName, sortDirection: SortDirection.DOWN })
        }
    };

    const getJoinAttr = (id, tableId, attrId) => {
        try {
            const joinTable = allTables.find(t => t.TableId === tableId);
            const pkAttr = joinTable.Attributes.find(a => a.PkFlag === 1);
            const selectAttr = joinTable.Attributes.find(a => a.AttrId === attrId);
            const row = joinTable.Data.find(r => r[pkAttr.SystemAttrName] === id);
            const value = row[selectAttr.SystemAttrName];
            return value;
        } catch (error) {
            //console.log("getJoinAttr > error: ", error);
            return null;
        }
    }

    useEffect(() => {
        setSortedData(currentTable?.Data);
        setSortInfo({ sortAttr: "", sortDirection: SortDirection.NONE })
    }, [currentTable]);

    return (

        <>
            <LoadingOverlay show={isLoading} />
            {JSON.stringify(currentTable) !== JSON.stringify({}) ?
                tables.length > 0 ?
                    <div className='content-tabs'>
                        <button className='def-btn add-btn' onClick={(e) => handleAddRow(e)}>Добавить</button>
                        <Table className='custom-tbl' striped bordered hover >
                            <thead>
                                <tr >
                                    {currentTable?.Attributes.sort((a, b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)).map((attr) =>
                                        attr.PkFlag === 0 &&
                                        <th key={attr.AttrId} onClick={() => handleSort(attr.SystemAttrName, attr.SystemAttrTypeName)} className='attr-header-cell' >
                                            <div className='attr-header-div'>
                                                <div>{attr.AttrName}</div>
                                                <div className='sort-arrow'>{sortInfo.sortAttr === attr.SystemAttrName ? sortInfo.sortDirection : <>&ensp;</>}</div>
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData?.map((row, rowIdx) =>
                                    <tr key={rowIdx} className='row' onClick={() => handleRowEdit(row)}>
                                        {row && currentTable.Attributes.sort((a, b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)).map((attr) =>
                                            attr.PkFlag === 0 &&
                                            <td key={attr.AttrId} className='attr-cell'>
                                                {attrTypes.find(attrType => attrType.AttrTypeId === attr.AttrTypeId).SystemAttrTypeName === 'join'
                                                    ? getJoinAttr(row[attr.SystemAttrName], attr.AttrTypeProp1, attr.AttrTypeProp2)
                                                    : row[attr.SystemAttrName]
                                                }
                                            </td>
                                        )}
                                    </tr>)}
                            </tbody>
                        </Table>
                    </div>
                    : <div className='empty-category'>В базе отсутствуют таблицы.</div>
                : <></>
            }
        </>


    )
}

export default TablePage;