import React from 'react';

const containerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
  fontFamily: 'Inter, sans-serif',
  color: '#333',
  padding: '20px',
  boxSizing: 'border-box'
};

const cardStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  padding: '40px',
  maxWidth: '600px',
  width: '100%',
  textAlign: 'left'
};

const titleStyles: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 10px 0',
  color: '#1a202c'
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '16px',
  margin: '0 0 30px 0',
  color: '#718096'
};

const stepsContainerStyles: React.CSSProperties = {
  marginBottom: '20px'
};

const stepsHeaderStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '15px',
    color: '#2d3748'
};

const listStyles: React.CSSProperties = {
  paddingLeft: '20px',
  lineHeight: '1.8'
};

const codeBlockStyles: React.CSSProperties = {
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  padding: '15px',
  overflowX: 'auto',
  fontSize: '14px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
};

const codeInlineStyles: React.CSSProperties = {
    backgroundColor: '#edf2f7',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.9em'
};

const footerStyles: React.CSSProperties = {
  marginTop: '30px',
  fontSize: '14px',
  color: '#a0aec0',
  textAlign: 'center'
};


export const FirebaseNotConfigured = () => {
  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        <h1 style={titleStyles}>Configuración Requerida</h1>
        <p style={subtitleStyles}>
          Para comenzar, necesitas conectar la aplicación a tu proyecto de Firebase.
        </p>

        <div style={stepsContainerStyles}>
          <h2 style={stepsHeaderStyles}>Sigue estos pasos:</h2>
          <ol style={listStyles}>
            <li>
              Ve a la consola de tu proyecto de Firebase: <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">console.firebase.google.com</a>
            </li>
            <li>
              En la descripción general de tu proyecto, haz clic en el ícono <strong>&lt;/&gt;</strong> para agregar una aplicación web o selecciona una existente.
            </li>
            <li>
              Encuentra las claves de configuración de tu aplicación (apiKey, authDomain, etc.).
            </li>
            <li>
              Abre el archivo <code style={codeInlineStyles}>src/services/firebase.ts</code> en tu proyecto.
            </li>
            <li>
              Copia tus claves en el objeto <code>firebaseConfig</code>.
            </li>
          </ol>
        </div>

        <div style={codeBlockStyles}>
          <pre style={{ margin: 0 }}>
            <code>
{`// src/services/firebase.ts

const firebaseConfig = {
  apiKey: "REEMPLAZA_CON_TU_API_KEY",
  authDomain: "REEMPLAZA_CON_TU_AUTH_DOMAIN",
  projectId: "REEMPLAZA_CON_TU_PROJECT_ID",
  // ... y así sucesivamente
};`}
            </code>
          </pre>
        </div>

        <p style={footerStyles}>
          Después de actualizar el archivo, guárdalo y actualiza esta página.
        </p>
      </div>
    </div>
  );
};
