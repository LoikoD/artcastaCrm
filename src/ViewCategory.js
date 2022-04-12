import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCategory, setLoadingState, updateCategory } from './redux/actions';
import { ViewMods } from './redux/enums';
import './styles/Configure.css';

function ViewCategory(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const confCategory = useSelector(state => {
        const { configureReducer } = state;
        return configureReducer.confCategory;
    });

    const generateNewCategory = () => {
        return { CategoryName: "" };
    };

    const [category, setCategory] = useState(props.mode === ViewMods.VIEW ? { ...confCategory } : generateNewCategory());

    const handleChangeInput = (value) => {
        setCategory({ ...category, CategoryName: value });
    }

    const handleSave = async () => {

        dispatch(setLoadingState(1));

        // TODO: Надо обрабатывать ошибки (result === 1, если все ок, но это не точно) и выводить описания ошибок на экран, возможно, не переключая режим isReadOnly
        if (props.mode === ViewMods.VIEW) {
            // update category...
            console.log('updating category...');
            dispatch(updateCategory(category)).then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/configure');
            });
        } else {
            // create category...
            console.log('creating category...');
            dispatch(createCategory(category)).then((result) => {
                console.log(result);
                dispatch(setLoadingState(0));
                navigate('/configure');
            });
        }

    }

    const handleBack = () => {
        navigate('/configure');
    }

    useEffect(() => {
        if (confCategory && JSON.stringify(confCategory) !== JSON.stringify({})) {
            setCategory({ ...confCategory });
        } else {
            setCategory(generateNewCategory());
        }
    }, [confCategory]);
    
    useEffect(() => {
        dispatch(setLoadingState(0));
    }, []);

    return (
        <div className='conf-page'>
            <div className='content-conf'>
                {props.mode === ViewMods.VIEW ? <h4 className='conf-header'>Изменение категории: {confCategory.CategoryName}</h4> : <h4 className='conf-header'>Создание категории</h4>}
                <div>

                    <div className='conf-edit-block'>
                        <div className='conf-edit-name'>Название категории:</div>
                        <input
                            type='text'
                            className='str-value-input'
                            value={category.CategoryName}
                            onChange={(e) => handleChangeInput(e.target.value)}
                        />
                    </div>
                </div>
                <div className='conf-bottom-btn-block'>
                    <button
                        className='conf-btn save-conf-btn'
                        onClick={() => handleSave()}
                    >Сохранить</button>
                    <button
                        className='conf-btn back-conf-btn'
                        onClick={() => handleBack()}
                    >Вернуться к категориям</button>
                </div>
            </div>
        </div>
    );
};

export default ViewCategory;