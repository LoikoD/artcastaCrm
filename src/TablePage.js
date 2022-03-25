import React,{Component} from 'react';
import {Table} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import './Navigation.css';

function TablePage(props) {

    const dispatch = useDispatch();

    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
      })

    return(
        <div className='content-tabs'>
            <Table className='content' striped bordered hover>
                <thead>
                    <tr>
                        {currentTable?.Attributes?.map((attr)=>
                            <th key={attr.AttrId}>{attr.AttrName}</th>
                        )}
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTable?.Data?.map((row, rowIdx)=>
                        <tr key={rowIdx}>
                            {row && currentTable.Attributes.map((attr)=>
                                <td key={attr.AttrId}>
                                    {attr.AttrTypeName === 'связь' ? row[attr.AttrTypeProp2] : row[attr.SystemAttrName]}
                                    {/* {row[attr.SystemAttrName]} */}
                                </td>
                            )}
                            <td>Edit / Delete</td>
                        </tr>)}
                </tbody>
            </Table>
        </div>
    )
}

export default TablePage;