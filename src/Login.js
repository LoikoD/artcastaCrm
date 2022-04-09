import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/actions';
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname;

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [show, setShow] = useState(0);

    const loggedIn = useSelector(state => {
        const {authReducer} = state;
        return authReducer.loggedIn;
    });

    useEffect(() => {
        if (loggedIn === 1) {
            navigate('/');
        }
        setShow(1);
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [name, password])
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(process.env.REACT_APP_ARTCASTA_API + 'login',
                {username: name, password},
                {
                    withCredentials: true,
                    headers: {'Content-Type': 'application/json'}
                }
            );

            const accessToken = response?.data?.AccessToken;
            const user = response?.data?.User;
            dispatch(login(user, accessToken));
            navigate(from, { replace: true });
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 500) {
                setErrMsg('Internal Server Error')
            } else if (error.response?.status === 400) {
                setErrMsg('Отсутствует имя пользователя или пароль')
            } else if (error.response?.status === 401) {
                setErrMsg('Неправильное имя пользователя или пароль')
            }
        }
    }

    return (
        show === 1 ?
            <div className='login'>
                <form className='login-form' onSubmit={(e) => handleLogin(e)}>
                    <h1>ARTCasta</h1>
                    <input
                        type='text'
                        placeholder='Имя пользователя'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    /> 
                    <input
                        type='password'
                        placeholder='Пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type='submit' className='submit-btn'>Войти</button>
                </form>
                <p className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
            </div>
        : <></>
    );
};

export default Login;