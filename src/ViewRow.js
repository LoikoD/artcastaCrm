import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Case, Switch } from './helpers/Switch';
import LoadingOverlay from './LoadingOverlay';
import { addRow, deleteRow, openTable, saveRow, setLoadingState } from './redux/actions';
import { ViewMods } from './redux/enums';
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
  const attrTypes = useSelector(state => {
    const { configureReducer } = state;
    return configureReducer.attrTypes;
  });

  const generateNewRow = () => {
    let emptyRow = {};
    currentTable.Attributes.forEach(attr => {
      // Скорее всего для разных типов атрибутов нужно задавать разные пустые значения. То есть для текстовых - пустая строка, для дат - возможно null и т.д.
      emptyRow = { ...emptyRow, [attr.SystemAttrName]: '' };
    });
    return emptyRow;
  }

  const [attrs, setAttrs] = useState(props.mode === ViewMods.VIEW ? currentRow : generateNewRow());
  const [isReadOnly, setIsReadOnly] = useState(props.mode === ViewMods.VIEW ? true : false);
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

  const handleBackBtn = (e) => {
    e.preventDefault();

    setAttrs(currentRow);
    setIsReadOnly(true);
    navigate('/');
  }

  const handleSaveBtn = async (e) => {
    e.preventDefault();

    setTablesLoading(1);


    // TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран, возможно, не переключая режим isReadOnly
    if (props.mode === ViewMods.VIEW) {
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
    if (props.mode === ViewMods.VIEW) {
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
    <div className='vr-page'>
      <LoadingOverlay show={tablesLoading} />
      <div className='content-vr'>
        {props.mode === ViewMods.VIEW ? <h4 className='vr-header'>Редактирование данных ({currentTable.TableName})</h4> : <h4 className='vr-header'>Добавление строки ({currentTable.TableName})</h4>}
        
        <div className='vr-btn-block'>
        <button className='vr-btn secondary-vr-btn' onClick={(e) => handleBackBtn(e)}>Назад</button>
        </div>

        {currentTable.Attributes.sort((a, b) => (a.Ord > b.Ord) ? 1 : ((b.Ord > a.Ord) ? -1 : 0)).map((attr) =>
          attr.PkFlag === 0 &&


          <div className='vr-edit-block' key={attr.AttrId}>
            <div className='vr-edit-name'>{attr.AttrName}:</div>

            <div className='vr-edit-value'>
              <Switch expression={attr.AttrTypeId}>
                <Case value={attrTypes.find(attr => attr.SystemAttrTypeName === 'join').AttrTypeId}>
                  <h6>Поле типа 'связь'</h6>
                </Case>
                <Case value={attrTypes.find(attr => attr.SystemAttrTypeName === 'varchar').AttrTypeId}>
                  <input
                    type='text'
                    className='vr-value-input'
                    value={attrs[attr.SystemAttrName]}
                    onChange={(e) => handleChangeInput(attr.SystemAttrName, e.target.value)}
                    readOnly={isReadOnly}
                    maxLength={attr.AttrTypeProp1}
                  />
                </Case>
                <Case value='default'>
                  <h6>Неизвестный тип</h6>
                </Case>
              </Switch>
            </div>
          </div>

        )}
        <div className='vr-btn-block'>
          {isReadOnly ?
            <button className='vr-btn secondary-vr-btn' onClick={(e) => handleEditBtn(e)}>Редактировать</button>
            : <>
              <button className='vr-btn good-vr-btn' onClick={(e) => handleSaveBtn(e)}>Сохранить</button>
              {props.mode === ViewMods.VIEW ? <button className='vr-btn secondary-vr-btn' onClick={(e) => handleCancelBtn(e)}>Отменить изменения</button> : <></>}
            </>
          }
          <button className='vr-btn danger-vr-btn' onClick={(e) => handleDeleteBtn(e)}>{props.mode === ViewMods.VIEW ? "Удалить" : "Отмена"}</button>
        </div>
      </div>
    </div>
  );
};

export default ViewRow;

