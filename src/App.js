import React, { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import RegForm from './components/RegForm';
import AuthForm from './components/AuthForm';

const App = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [regFormValues, setRegFormValues] = useState({ email: '', password: '' });
  const [authFormValues, setAuthFormValues] = useState({ email: '', password: '' });
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Обновляем состояние isMobile при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignUpClick = () => {
    setAuthFormValues({ email: '', password: '' });
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setRegFormValues({ email: '', password: '' });
    setIsSignUpActive(false);
  };

  const handleRegistrationComplete = (userName) => {
    setUserName(userName);
    setIsSignUpActive(false);
  };

  return (
    <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`}>
      {isMobile ? (
        <div>
          {isSignUpActive ? (
            <>
              <RegForm
                values={regFormValues}
                setValues={setRegFormValues}
                onRegistrationComplete={handleRegistrationComplete}
              />
              <p className="toggle-link" onClick={handleSignInClick}>
                Уже есть аккаунт? Авторизоваться
              </p>
            </>
          ) : (
            <>
              <AuthForm
                values={authFormValues}
                setValues={setAuthFormValues}
                registeredUserName={userName}
              />
              <p className="toggle-link" onClick={handleSignUpClick}>
                Нет аккаунта? Зарегистрироваться
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="form-container sign-up-container">
            <RegForm
              values={regFormValues}
              setValues={setRegFormValues}
              onRegistrationComplete={handleRegistrationComplete}
            />
          </div>
          <div className="form-container sign-in-container">
            <AuthForm
              values={authFormValues}
              setValues={setAuthFormValues}
              registeredUserName={userName}
            />
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Добро пожаловать</h1>
                <p>Чтобы поддерживать с нами связь, пожалуйста, войдите</p>
                <Button className="ghost" onClick={handleSignInClick}>
                  Войти
                </Button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Привет, друг!</h1>
                <p>Зарегистрируйтесь, если у вас нет аккаунта</p>
                <Button className="ghost" onClick={handleSignUpClick}>
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;