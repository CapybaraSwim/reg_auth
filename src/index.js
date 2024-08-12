import React from 'react';
import { createRoot } from 'react-dom/client';  // Правильный импорт из react-dom/client
import { MantineProvider } from '@mantine/core';
import App from './App';
import './index.scss';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);  // Использование createRoot

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <App />
  </MantineProvider>
);