import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';

const LoginForm: React.FC = () => {
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCpf = localStorage.getItem('cpf') || sessionStorage.getItem('cpf');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedCpf) {
      setCpf(savedCpf);
      setRememberMe(savedRememberMe);
    } else {
      setRememberMe(false);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Simulando chamada API - remova esse comentário ao integrar com a API real
      const response = { data: { token: 'fakeToken', user: { name: 'Test User' } } };
      const { token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('cpf', cpf);
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('cpf', cpf);
        localStorage.removeItem('rememberMe');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <form className={styles['login-form']} onSubmit={handleSubmit}>
      <InputField
        type="cpf"
        id="cpf"
        placeholder="Digite seu cpf"
        label="Cpf*"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
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
          <Link to="recoverypassword" className={styles['forgot-password']}>
            Esqueci Minha Senha
          </Link>
        <div className={styles['remember-me']}>
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember">Lembre de mim</label>
        </div>
      </div>

      <Button type="submit">Fazer Login</Button>
    </form>
  );
};

export default LoginForm;
