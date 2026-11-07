import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './card-body-type.css';
import './closing-button.css';
import './desktop-typography.css';
import './mobile-typography.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
