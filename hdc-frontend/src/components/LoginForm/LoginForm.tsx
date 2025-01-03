import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss'; // Mudança para SCSS
// import api from '../../api';
// import { toast } from 'react-toastify';

import Button from '../Button/Button';
import InputField from '../InputField/InputField';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Tipagem adicionada
  const [password, setPassword] = useState<string>(''); // Tipagem adicionada
  const [rememberMe, setRememberMe] = useState<boolean>(false); // Tipagem adicionada
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(savedRememberMe);
    } else {
      setRememberMe(false);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await api.post('/user/login', { email, password });
      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('email', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('email', email);
        localStorage.removeItem('rememberMe');
      }

      toast.success('Login realizado com sucesso!', {
        position: 'top-right',
      });

      navigate('/AdminHome');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast.error('Falha no login. Verifique suas credenciais.', {
        position: 'top-right',
      });
    }
  };

  return (
    <form className={styles['login-form']} onSubmit={handleSubmit}>
      <InputField
        type="email"
        id="email"
        placeholder="Digite seu email"
        label="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        type="password"
        id="password"
        placeholder="Digite sua senha"
        label="Senha*"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className={styles['form-options']}>
        <div className={styles['remember-me']}>
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember">Lembre de mim</label>
        </div>
        <Link to="#" className={styles['forgot-password']}>
          Esqueceu a senha?
        </Link>
      </div>

      <Button type="submit">Entrar</Button>

      <div className={styles['register-link']}>
        Não possui cadastro? <Link to="SignUp">Registre-se</Link>
      </div>
    </form>
  );
};

export default LoginForm;
