import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Case, Switch } from './helpers/Switch';
import LoadingOverlay from './LoadingOverlay';
import { addRow, deleteRow, openTable, saveRow, setLoadingState } from './redux/actions';
import { ViewRowMods } from './redux/enums';
import './styles/ViewRow.css';

function ViewRow(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentRow = useSelector(state => {
    const { navigationReducer } = state;
    return navigationReducer.currentRow;
  });
  const currentTable = useSelector(state => {
    const { navigationReducer } = state;
    return navigationReducer.currentTable;
  });

  const generateNewRow = () => {
    let emptyRow = {};
    currentTable.Attributes.forEach(attr => {
      // Скорее всего для разных типов атрибутов нужно задавать разные пустые значения. То есть для текстовых - пустая строка, для дат - возможно null и т.д.
      emptyRow = { ...emptyRow, [attr.SystemAttrName]: '' };
    });
    return emptyRow;
  }

  const [attrs, setAttrs] = useState(props.mode === ViewRowMods.VIEW ? currentRow : generateNewRow());
  const [isReadOnly, setIsReadOnly] = useState(props.mode === ViewRowMods.VIEW ? true : false);
  const [tablesLoading, setTablesLoading] = useState(0);

  const handleChangeInput = (attrName, value) => {
    setAttrs({ ...attrs, [attrName]: value })
  }

  const handleEditBtn = (e) => {
    e.preventDefault();

    setIsReadOnly(false);
  }

  const handleCancelBtn = (e) => {
    e.preventDefault();

    setAttrs(currentRow);
    setIsReadOnly(true);
  }

  const handleSaveBtn = async (e) => {
    e.preventDefault();

    setTablesLoading(1);


    // TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран, возможно, не переключая режим isReadOnly
    if (props.mode === ViewRowMods.VIEW) {
      dispatch(saveRow(currentTable.TableId, attrs[currentTable.Attributes.find(attr => attr.PkFlag === 1).SystemAttrName], attrs)).then((result) => {
        setTablesLoading(0);
        setIsReadOnly(true);
      });
    } else {
      addRow(currentTable.TableId, attrs).then((result) => {
        setTablesLoading(0);
        setIsReadOnly(true);
        dispatch(setLoadingState(1));
        dispatch(openTable(currentTable));
        navigate('/');
      });
    }

  }

  const handleDeleteBtn = async (e) => {
    e.preventDefault();

    setTablesLoading(1);

    // TODO: добавить окно с просьбой подтвердить удаление
    // TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран, возможно, не переключая режим isReadOnly
    if (props.mode === ViewRowMods.VIEW) {
      deleteRow(currentTable.TableId, attrs[currentTable.Attributes.find(attr => attr.PkFlag === 1).SystemAttrName]).then((result) => {
        setTablesLoading(0);
        setIsReadOnly(true);
        dispatch(setLoadingState(1));
        dispatch(openTable(currentTable));
        navigate('/');
      });
    } else {
      setTablesLoading(0);
      setIsReadOnly(true);
      dispatch(setLoadingState(1));
      dispatch(openTable(currentTable));
      navigate('/');
    }

  }


  return (
    <div>
      <LoadingOverlay show={tablesLoading} />
      <div className='view-block'>

        {
          currentTable.Attributes.sort((a, b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)).map((attr) =>
            attr.PkFlag === 0 &&
            <div key={attr.AttrId} className='attr'>
              <div className='attr-name'>{attr.AttrName}:</div>
              {/* TODO: Добавить кейсы для всех типов атрибутов  */}
              <Switch expression={attr.SystemAttrTypeName}>
                <Case value='join'>
                  <div className='attr-value'>
                    <h6>Поле типа 'связь'</h6>
                  </div>
                </Case>
                <Case value='varchar'>
                  <div className='attr-value'>
                    <input
                      type='text'
                      className='attr-value-input'
                      value={attrs[attr.SystemAttrName]}
                      onChange={(e) => handleChangeInput(attr.SystemAttrName, e.target.value)}
                      readOnly={isReadOnly}
                    />
                  </div>
                </Case>
                <Case value='default'>
                  <div className='attr-value'>
                    <h6>Неизвестный тип</h6>
                  </div>
                </Case>
              </Switch>
            </div>
          )
        }

        {isReadOnly ?
          <button className='def-btn edit-btn' onClick={(e) => handleEditBtn(e)}>Редактировать</button>
          : <>
            <button className='def-btn save-btn' onClick={(e) => handleSaveBtn(e)}>Сохранить</button>
            <button className='def-btn cancel-btn' onClick={(e) => handleCancelBtn(e)}>Отменить изменения</button>
          </>
        }
        <button className='def-btn delete-btn' onClick={(e) => handleDeleteBtn(e)}>Удалить</button>
      </div>
    </div>
  );
};

export default ViewRow;

