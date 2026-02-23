# 📅 FIUBA Calendar

> Calendario Académico Interactivo de la Facultad de Ingeniería de la Universidad de Buenos Aires (FIUBA) 2026-2027.

Este proyecto es una aplicación web que permite visualizar el calendario académico de la FIUBA de manera interactiva, con diferentes vistas (lista y calendario), filtros por categoría y parseo automático de datos desde PDF usando IA.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Instalación y Setup](#-instalación-y-setup)
- [Uso (Desarrollo)](#-uso-desarrollo)
- [Backend y Base de Datos](#-backend-y-base-de-datos)
- [Parser PDF con IA](#-parser-pdf-con-ia)
- [Recursos](#-recursos)

---

## ✨ Características

- 📱 **Vista de Lista**: Eventos agrupados por mes con sticky headers para navegación móvil
- 📅 **Vista de Calendario**: Visualización mensual interactiva (ideal para escritorio)
- 🎨 **Códigos de Color**: Categorías visuales:
  - 🔴 Rojo: Exámenes
  - 🔵 Azul: Académico
  - 🟡 Amarillo: Administrativo
- 🔍 **Filtros**: Filtrado dinámico por categoría
- 🌐 **Fechas en Español**: Fechas formateadas con `date-fns` locale español
- 🤖 **Parser Automático**: Extracción de eventos desde PDF usando Google Gemini AI

---

## 🛠 Stack Tecnológico

### Frontend
- **React** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **date-fns** - Manejo de fechas
- **react-big-calendar** - Componente de calendario

### Backend y Automatización
- **Node.js + Express** - API REST
- **Neon (Serverless Postgres)** - Base de datos en la nube
- **pg** - Cliente PostgreSQL
- **Python** - Script de automatización del entorno local (`start_dev.py`)

### Data Parsing
- **Google Generative AI (Gemini)** - Extracción de datos desde PDF
- **pdf-parse** - Procesamiento de PDFs

---

## 📦 Instalación y Setup

### Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- Cuenta de Google AI Studio (para API Key de Gemini)

### Clonar el Repositorio

```bash
git clone https://github.com/daniel1002-jpg/fiuba-calendar.git
cd fiuba-calendar
```

### Instalar Dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Data Parser (opcional, si vas a parsear PDFs)
cd ../data-parser
npm install
```

### Variables de Entorno

#### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://usuario:password@endpoint-de-neon.tech/fiuba_calendar?sslmode=require
PORT=3001
```

#### Data Parser (`data-parser/.env`)
```env
GOOGLE_API_KEY=tu_api_key_de_google_ai_studio
```

---

## 🚀 Uso (Desarrollo)

El proyecto incluye un script de automatización en Python (`start_dev.py`) que simplifica el levantamiento del entorno, manejando el frontend y backend en paralelo.

### 1. Iniciar Servidores (Modo Normal)

Si ya tienes la base de datos configurada, simplemente ejecuta:

```bash
python start_dev.py
```

- El backend correrá en http://localhost:3001

- El frontend estará disponible en http://localhost:5173

### 2. Actualizar la Base de Datos (Seeding)

Si hay un nuevo (`output.json`) y necesitas actualizar los eventos en la base de datos (Neon):

```bash
python start_dev.py --seed
```

Esto borrará los eventos viejos, insertará los nuevos y luego levantará ambos servidores.

### 3. Regenerar JSON y Actualizar (Ciclo Completo)

Para consultar a la IA, generar un nuevo JSON desde el PDF y subirlo a la DB automáticamente:

```bash
python start_dev.py --update-all
```
> Nota: Esto sobrescribirá cualquier cambio en el archivo (`output.json`)

---

## 💾 Backend y Base de Datos

### Estructura de la Base de Datos

**Tabla: `academic_events`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Primary Key |
| `title` | VARCHAR(255) | Nombre del evento |
| `category` | ENUM | `ACADEMICO`, `ADMINISTRATIVO`, `EXAMEN`, `FERIADO` |
| `start_date` | DATE | Fecha de inicio |
| `end_date` | DATE | Fecha de fin |

### Endpoints de la API

- `GET /health` - Health check
- `GET /api/events` - Obtener todos los eventos

### Seed Script

El script `seed.js` lee `data-parser/output.json` y puebla la base de datos:

```bash
cd backend
node seed.js
```

---

## 🤖 Parser PDF con IA

El módulo `data-parser` usa **Google Gemini AI** para extraer eventos del PDF del calendario académico de forma automática.

### Uso

1. Colocá el PDF en `data-parser/`
2. Configurá tu `GOOGLE_API_KEY` en `data-parser/.env`
3. Ejecutá el parser:

```bash
cd data-parser
node parser.js
```

### Flujo del Parser

1. **Lee el PDF**: Carga `Calendario_Academico_2026_2027.pdf`
2. **Envía a Gemini**: Usa el modelo multimodal `gemini-3-flash-preview`
3. **Extrae datos**: Gemini identifica eventos, fechas y categorías
4. **Valida JSON**: Verifica estructura y campos obligatorios
5. **Genera `output.json`**: JSON estructurado listo para el seed

### Formato de Salida

```json
[
  {
    "title": "Evaluaciones Integradoras",
    "category": "EXAMEN",
    "start_date": "2026-02-09",
    "end_date": "2026-02-14"
  }
]
```

---

## 📚 Recursos

- **Repositorio**: [github.com/daniel1002-jpg/fiuba-calendar](https://github.com/daniel1002-jpg/fiuba-calendar)
- **Documentación Notion**: [FIUBA Calendar - Especificación del Proyecto](https://www.notion.so/FIUBA-Calendar-Especificaci-n-del-Proyecto-304d181de3ba8058b1b4c07da407d021)
- **Licencia**: [MIT License](LICENSE)

---

Desarrollado con ❤️ para la comunidad FIUBA
