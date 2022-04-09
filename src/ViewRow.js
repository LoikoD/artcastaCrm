import { useSelector } from 'react-redux';
import './Home.css';

function ViewRow() {  

    const currentRow = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentRow;
      });
    const currentTable = useSelector(state => {
        const {navigationReducer} = state;
        return navigationReducer.currentTable;
      });

    return (
        <div className='container'>
            <h5>ViewRow</h5>
            <h6>CurrentTable:</h6>
            <div>{JSON.stringify(currentTable)}</div>
            <h6>CurrentRow:</h6>
            <div>{JSON.stringify(currentRow)}</div>
        </div>
    );
};

export default ViewRow;