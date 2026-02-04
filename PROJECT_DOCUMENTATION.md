# Documentación del Proyecto TTS/STT App

## Descripción General

Este proyecto es una aplicación web desarrollada con **Next.js** que proporciona funcionalidades de **Text-to-Speech (TTS)** y **Speech-to-Text (STT)** utilizando los servicios de **Google Cloud**. La aplicación permite a los usuarios convertir texto a audio y transcribir audio a texto en tiempo real.

## Características Principales

### 1. Text-to-Speech (TTS)
- Conversión de texto escrito a audio en formato MP3
- Soporte para voz en español (configurable)
- Interfaz simple con área de texto y botón de generación
- Reproducción inmediata del audio generado

### 2. Speech-to-Text (STT)
- Grabación de audio desde el micrófono del navegador
- Transcripción automática a texto
- Soporte para español (configurable)
- Interfaz con botones de grabación y parada

## Arquitectura Técnica

### Stack Tecnológico
- **Framework**: Next.js 16.1.6
- **Frontend**: React 19.2.3
- **Estilos**: Tailwind CSS v4
- **Lenguaje**: JavaScript/TypeScript
- **Servicios Cloud**: Google Cloud Text-to-Speech y Speech-to-Text

### Estructura del Proyecto
```
tts_stt_app/
├── app/
│   ├── api/
│   │   ├── tts/
│   │   │   └── route.js        # API endpoint para TTS
│   │   └── stt/
│   │       └── route.js        # API endpoint para STT
│   ├── layout.js              # Layout principal
│   ├── page.js               # Página principal (UI)
│   └── globals.css           # Estilos globales
├── public/                   # Assets estáticos
├── package.json             # Dependencias y scripts
└── next.config.ts          # Configuración de Next.js
```

## Implementación

### API Endpoints

#### 1. `/api/tts` (POST)
**Propósito**: Convertir texto a audio
**Entrada**: 
```json
{
  "text": "Texto a convertir"
}
```
**Salida**:
```json
{
  "audioContent": "base64 encoded audio",
  "contentType": "audio/mpeg"
}
```

**Implementación**:
- Utiliza el cliente `@google-cloud/text-to-speech`
- Configuración de voz: `es-ES-Standard-A` (por defecto)
- Codificación de audio: MP3
- Manejo de errores robusto

#### 2. `/api/stt` (POST)
**Propósito**: Transcribir audio a texto
**Entrada**:
```json
{
  "audioBase64": "base64 encoded audio",
  "mimeType": "audio/webm"
}
```
**Salida**:
```json
{
  "transcript": "Texto transcrito"
}
```

**Implementación**:
- Utiliza el cliente `@google-cloud/speech`
- Configuración de idioma: `es-ES` (por defecto)
- Codificación: WEBM_OPUS para audio webm
- Tasa de muestreo: 48000 Hz
- Puntuación automática habilitada

### Frontend (app/page.js)

La interfaz de usuario incluye:

1. **Sección TTS**:
   - Textarea para ingresar texto
   - Botón "Generar audio"
   - Reproductor de audio integrado

2. **Sección STT**:
   - Botones "Grabar" y "Parar"
   - Área para mostrar la transcripción
   - Grabación en tiempo real usando MediaRecorder API

### Configuración de Seguridad

Las credenciales de Google Cloud se manejan mediante variables de entorno en Vercel:
- `GOOGLE_CLOUD_CREDENTIALS`: Contenido completo del JSON de credenciales de Google Cloud
- `STT_LANGUAGE`: Idioma para STT (default: es-ES)
- `TTS_VOICE`: Voz para TTS (default: es-ES-Standard-A)

## Despliegue en Vercel

### Configuración del Despliegue

El proyecto está configurado para despliegue en **Vercel** con las siguientes características:

1. **Runtime**: Node.js (configurado en los endpoints API)
2. **Build Command**: `next build` (configuración por defecto)
3. **Output Directory**: `.next` (configuración por defecto de Next.js)

### Variables de Entorno en Vercel

Para el despliegue en producción, se deben configurar las siguientes variables de entorno en el dashboard de Vercel:

```
GOOGLE_CLOUD_CREDENTIALS = [contenido completo del JSON de credenciales]
STT_LANGUAGE = es-ES
TTS_VOICE = es-ES-Standard-A
```

### Repositorio Git

- **URL del repositorio**: https://github.com/Hector5472/tts_stt_app.git

## Almacenamiento de la API

### Credenciales de Google Cloud

Las credenciales de la API se almacenan en Vercel como variables de entorno encriptadas:

- **Producción (Vercel)**:
  - Las credenciales se almacenan como variable de entorno encriptada
  - El contenido completo del JSON de credenciales de Google Cloud se copia en la variable `GOOGLE_CLOUD_CREDENTIALS`

### Servicios de Google Cloud Utilizados

1. **Google Cloud Text-to-Speech API**
   - Proyecto: `onyx-shoreline-486313-u3`
   - Voz predeterminada: `es-ES-Standard-A`
   - Formato de audio: MP3

2. **Google Cloud Speech-to-Text API**
   - Proyecto: `onyx-shoreline-486313-u3`
   - Idioma predeterminado: `es-ES`
   - Codificación: WEBM_OPUS para grabaciones del navegador

## Scripts Disponibles

- `npm run dev`: Inicia servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia servidor de producción
- `npm run lint`: Ejecuta ESLint

## Consideraciones de Seguridad

1. **Credenciales**: Nunca commitear archivos de credenciales
2. **Variables de entorno**: Configurar las variables de entorno en Vercel para producción
3. **CORS**: La aplicación solo acepta solicitudes del mismo origen
4. **Validación**: Validación de entrada en ambos endpoints API

## Limitaciones

- Solo soporta español
- Grabación limitada a formato webm
- Sin historial de conversiones
- Interfaz básica sin estilos avanzados


## Troubleshooting

### Problemas Comunes

1. **Error "GOOGLE_CLOUD_CREDENTIALS is not defined"**:
   - En Vercel, verificar que las variables de entorno están configuradas correctamente
   - Asegurarse de que la variable `GOOGLE_CLOUD_CREDENTIALS` contiene el contenido completo del JSON de credenciales

2. **Error de permisos del micrófono**:
   - Asegurarse de que el navegador tiene permisos para acceder al micrófono
   - Usar HTTPS en producción (requerido para MediaRecorder)

3. **Audio no se reproduce**:
   - Verificar que el endpoint TTS retorna audio válido
   - Revisar la consola del navegador para errores

4. **Transcripción vacía**:
   - Verificar que el audio se grabó correctamente
   - Asegurarse de hablar claramente durante la grabación

