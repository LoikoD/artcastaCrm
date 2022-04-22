import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectRow } from './redux/actions';
import LoadingOverlay from './LoadingOverlay';
import BasicTable from './BasicTable';
import './styles/Navigation.css';

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

    const getJoinAttr = useCallback((id, tableId, attrId) => {
        try {
            const joinTable = allTables.find(t => t.TableId === tableId);
            const pkAttr = joinTable.Attributes.find(a => a.PkFlag === 1);
            const selectAttr = joinTable.Attributes.find(a => a.AttrId === attrId);
            const row = joinTable.Data.find(r => r[pkAttr.SystemAttrName] === id);
            const value = row[selectAttr.SystemAttrName];
            return value;
        } catch (error) {
            return '';
        }
    }, [allTables]);

    const columns = useMemo(() => {
        if (currentTable?.Attributes?.some(a => a.PkFlag === 0)) {
            return currentTable?.Attributes
                ?.sort((a, b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0))
                ?.filter((attr) => attr.PkFlag === 0)
                ?.map((attr) => (
                    {
                        Header: attr.AttrName,
                        accessor: attr.SystemAttrName,
                        Cell: ({ value }) => {
                            switch (attrTypes.find(attrType => attrType.AttrTypeId === attr.AttrTypeId).SystemAttrTypeName) {
                                case 'date':
                                    return value ? new Date(value).toLocaleDateString() : String(value);
                                case 'datetime2':
                                    return value ? new Date(value).toLocaleString() : String(value);
                                case 'join':
                                    return getJoinAttr(value, attr.AttrTypeProp1, attr.AttrTypeProp2);
                                case 'varchar':
                                    return value;
                                case 'text':
                                    return value;
                                case 'int':
                                    return value;
                                case 'decimal':
                                    return value;
                                default:
                                    return String(value);
                            }
                        }
                    })
                )
        } else {
            return [];
        }
    }, [currentTable, attrTypes, getJoinAttr]);

    const handleRowEdit = (row) => {
        dispatch(selectRow(row));
        navigate('/view_row');
    };
    const handleAddRow = (e) => {
        e.preventDefault();

        navigate('/add_row');
    };



    return (

        <>
            <LoadingOverlay show={isLoading} />
            {JSON.stringify(currentTable) !== JSON.stringify({}) ?
                tables.length > 0 ?
                    <div className='content-tabs'>
                        {currentTable?.Attributes.some(a => a.PkFlag === 0) ? <button className='def-btn add-btn' onClick={(e) => handleAddRow(e)}>Добавить</button> : <></>}
                        <BasicTable columns={columns} data={currentTable?.Data} onRowClicked={handleRowEdit} />
                    </div>
                    : <div className='empty-category'>В базе отсутствуют таблицы.</div>
                : <></>
            }
        </>


    )
}

export default TablePage;