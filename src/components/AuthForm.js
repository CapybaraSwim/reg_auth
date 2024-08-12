import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Text } from '@mantine/core';

const AuthForm = ({ registeredUserName }) => {
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [showGeneralError, setShowGeneralError] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (touched.email && !/^\S+@\S+\.\S+$/.test(value) ? 'Неправильный формат почты' : null),
      password: (value) => (touched.password && value.length < 6 ? 'Пароль должен содержать минимум 6 символов' : null),
    },
  });

  const handleSubmit = async (values) => {
    if (!values.email || !values.password) {
      setShowGeneralError(true);
      return;
    }

    setShowGeneralError(false);
    setAuthError('');

    try {
      const response = await fetch('http://20.205.178.13:8001/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка авторизации');
      }

      const data = await response.json();
      console.log('Авторизация успешна:', data);

      setAuthToken(data.auth_token);
      localStorage.setItem('auth_token', data.auth_token);

      setWelcomeMessage(`Рады вас видеть, ${registeredUserName}!`);
      setIsAuthenticated(true);

      form.reset();
    } catch (error) {
      console.error('Ошибка авторизации:', error.message);
      setAuthError(error.message);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="auth-form">
      {isAuthenticated ? (
        <Text size="xl" weight={700} mt="md" className="auth-form__welcome-message">
          {welcomeMessage}
        </Text>
      ) : (
        <>
          <h1>Авторизоваться</h1>
          <TextInput
            placeholder="Почта"
            {...form.getInputProps('email')}
            onFocus={() => setTouched({ ...touched, email: true })}
            error={form.errors.email && <Text className="auth-form__error-text">{form.errors.email}</Text>}
          />
          <PasswordInput
            placeholder="Пароль"
            {...form.getInputProps('password')}
            onFocus={() => setTouched({ ...touched, password: true })}
            error={form.errors.password && <Text className="auth-form__error-text">{form.errors.password}</Text>}
          />
          {showGeneralError && <Text className="auth-form__error-text">Пожалуйста, заполните все поля</Text>}
          {authError && <Text className="auth-form__error-text">{authError}</Text>}
          <Button type="submit" fullWidth size="lg" mt="md" className="auth-form__submit-button">Войти</Button>
        </>
      )}
    </form>
  );
};

export default AuthForm;