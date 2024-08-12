import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Text, Loader } from '@mantine/core';

const RegForm = ({ onRegistrationComplete }) => {
  const [showGeneralError, setShowGeneralError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmationInput, setShowConfirmationInput] = useState(false);
  const [showRepeatPasswordInput, setShowRepeatPasswordInput] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [codeSentMessage, setCodeSentMessage] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [hideForm, setHideForm] = useState(false);
  const [userName, setUserName] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      repeat_password: '',
      username: '',
    },
    validate: {
      email: (value) =>
        !/^\S+@\S+\.\S+$/.test(value)
          ? 'Неправильный формат почты'
          : null,
      password: (value) =>
        value.length < 6
          ? 'Пароль должен содержать минимум 6 символов'
          : null,
      repeat_password: (value, values) =>
        value !== values.password ? 'Пароли не совпадают' : null,
      username: (value) =>
        value.length < 2 ? 'Имя пользователя должно содержать минимум 2 символа' : null,
    },
  });

  const handlePasswordChange = (event) => {
    const password = event.currentTarget.value;
    form.setFieldValue('password', password);
    if (password) {
      setShowRepeatPasswordInput(true);
    } else {
      setShowRepeatPasswordInput(false);
    }
  };

  const handleSubmit = async (values) => {
    if (!values.email || !values.password || !values.repeat_password || !values.username) {
      setShowGeneralError(true);
      return;
    }

    setShowGeneralError(false);
    setLoading(true);

    try {
      const response = await fetch('http://20.205.178.13:8001/registration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          repeat_password: values.repeat_password,
          username: values.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Ошибка:', data);
        throw new Error('Ошибка отправки кода подтверждения');
      }

      console.log('Код подтверждения отправлен', data);
      setUserName(values.username);
      setRegistrationToken(data.token);
      setShowConfirmationInput(true);
      setCodeSentMessage('Код подтверждения был отправлен на вашу почту.');
      setHideForm(true);
    } catch (error) {
      console.error('Ошибка при отправке кода:', error);
      setShowGeneralError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationSubmit = async () => {
    if (!confirmationCode) {
      setShowGeneralError(true);
      return;
    }

    setShowGeneralError(false);
    setLoading(true);

    try {
      const response = await fetch(`http://20.205.178.13:8001/registration/${confirmationCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${registrationToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Ошибка:', data);
        throw new Error('Ошибка подтверждения регистрации');
      }

      console.log('Регистрация успешно подтверждена', data);
      setSuccessMessage('Вы успешно зарегистрированы!');

      setTimeout(() => {
        setSuccessMessage('');
        setShowConfirmationInput(false);
        setShowRepeatPasswordInput(false);
        setHideForm(false);
        form.reset();

        onRegistrationComplete(userName);
      }, 5000);
    } catch (error) {
      console.error('Ошибка при подтверждении регистрации:', error);
      setShowGeneralError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="reg-form">
      {!hideForm && <h1>Создать аккаунт</h1>}
      
      {!hideForm && (
        <>
          <TextInput
            placeholder="Имя пользователя"
            {...form.getInputProps('username')}
            error={form.errors.username && <Text className="reg-form__error-text">{form.errors.username}</Text>}
          />
          <TextInput
            placeholder="Почта"
            {...form.getInputProps('email')}
            error={form.errors.email && <Text className="reg-form__error-text">{form.errors.email}</Text>}
          />
          <PasswordInput
            placeholder="Пароль"
            value={form.values.password}
            onChange={handlePasswordChange}
            error={form.errors.password && <Text className="reg-form__error-text">{form.errors.password}</Text>}
          />
          {showRepeatPasswordInput && (
            <PasswordInput
              placeholder="Подтвердите пароль"
              {...form.getInputProps('repeat_password')}
              error={form.errors.repeat_password && <Text className="reg-form__error-text">{form.errors.repeat_password}</Text>}
              mt="md"
            />
          )}
          {showGeneralError && <Text className="reg-form__error-text">Пожалуйста, заполните все поля</Text>}
        </>
      )}

      {codeSentMessage && <Text size="sm" mt="md" className="reg-form__code-sent-message">{codeSentMessage}</Text>}
      
      {showConfirmationInput ? (
        <>
          <TextInput
            placeholder="Введите код подтверждения"
            value={confirmationCode}
            onChange={(event) => setConfirmationCode(event.currentTarget.value)}
            mt="md"
            className="reg-form__confirmation-code"
          />
          <Button onClick={handleConfirmationSubmit} fullWidth size="lg" mt="md" disabled={loading} className="reg-form__confirm-button">
            {loading ? <Loader size="sm" className="button_text" /> : 'Подтвердить и завершить регистрацию'}
          </Button>
        </>
      ) : (
        !hideForm && (
          <Button type="submit" fullWidth size="lg" mt="md" disabled={loading} className="reg-form__submit-button">
            {loading ? <Loader size="sm" className="button_text" /> : 'Регистрация'}
          </Button>
        )
      )}

      {successMessage && <Text size="sm" mt="md" className="reg-form__success-message">{successMessage}</Text>}
    </form>
  );
};

export default RegForm;