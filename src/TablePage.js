import React from 'react';
import {Table} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectRow } from './redux/actions';
import LoadingOverlay from './LoadingOverlay';
import './styles/Navigation.css';

function TablePage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const isLoading = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.isLoading;
    });
    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
    });
    const tables = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.tables;
    });

    const handleRowEdit = (row) => {
        dispatch(selectRow(row));
        navigate('/view_row');
    };
    const handleAddRow = () => {
        navigate('/add_row');
    };

    return(

        <>
            <LoadingOverlay show={isLoading} />
            {JSON.stringify(currentTable) !== JSON.stringify({}) ? 
                tables.length > 0 ? 
                    <div className='content-tabs'>
                        <button className='def-btn add-btn' onClick={() => handleAddRow()}>Добавить</button>
                        <Table className='content' striped bordered hover>
                            <thead>
                                <tr>
                                    {currentTable?.Attributes.sort((a,b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)).map((attr)=>
                                        attr.PkFlag === 0 && <th key={attr.AttrId}>{attr.AttrName}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentTable?.Data?.map((row, rowIdx)=>
                                    <tr key={rowIdx} className='row' onClick={() => handleRowEdit(row)}>
                                        {row && currentTable.Attributes.sort((a,b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)).map((attr)=>
                                            attr.PkFlag === 0 &&
                                            <td key={attr.AttrId}>
                                                {attr.AttrTypeName === 'связь' ? row[attr.AttrTypeProp2] : row[attr.SystemAttrName]}
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