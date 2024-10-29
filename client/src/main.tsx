import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';
import { NextUIProvider } from '@nextui-org/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
      <main className="light text-foreground bg-background overflow-hidden">
        <App />
      </main>
    </NextUIProvider>
  </StrictMode>,
)
