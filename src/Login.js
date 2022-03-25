import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import bcrypt from 'bcryptjs';
import { login } from './redux/actions';
import './Login.css';

function Login() {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    
    const handleLogin = (e) => {
        e.preventDefault();

        const hashedPassword = bcrypt.hashSync(password, 10);
        dispatch(login(name, password, hashedPassword));
    }

    return (
        <div className='login'>
            <form className='login-form' onSubmit={(e) => handleLogin(e)}>
                <h1>ARTCasta</h1>
                <input type='name' placeholder='Имя пользователя' value={name} onChange={(e) => setName(e.target.value)} />
                <input type='password' placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type='submit' className='submit-btn'>Войти</button>
            </form>
        </div>
    );
};

export default Login;