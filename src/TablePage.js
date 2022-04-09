import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectRow } from './redux/actions';
import './Navigation.css';

function TablePage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
      })

    const handleRowEdit = (row) => {
        console.log("handleRowEdit > row: ", row);
        dispatch(selectRow(row));
        navigate('/view_row');
    }

    return(
        <div className='content-tabs'>
            <Table className='content' striped bordered hover>
                <thead>
                    <tr>
                        {currentTable?.Attributes?.map((attr)=>
                            attr.PkFlag === 0 && <th key={attr.AttrId}>{attr.AttrName}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentTable?.Data?.map((row, rowIdx)=>
                        <tr key={rowIdx} className='row' onClick={() => handleRowEdit(row)}>
                            {row && currentTable.Attributes.map((attr)=>
                                attr.PkFlag === 0 &&
                                <td key={attr.AttrId}>
                                    {attr.AttrTypeName === 'связь' ? row[attr.AttrTypeProp2] : row[attr.SystemAttrName]}
                                </td>
                            )}
                        </tr>)}
                </tbody>
            </Table>
        </div>
    )
}

export default TablePage;