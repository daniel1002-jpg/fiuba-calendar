const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config();

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType,
        },
    };
}

async function parseCalendar() {
    try {
    console.log("👁️  Leyendo el archivo visualmente...");
    
    const model = genAi.getGenerativeModel({
      model: "gemini-3-flash-preview",
      config: { temperature: 0.0 }, 
    });

    console.log("temperatura actual del modelo:", model.generationConfig.temperature);

    const prompt = `
      Actúa como un Analista de Datos experto de la FIUBA.
      Tu tarea es extraer TODOS los eventos de este calendario académico (que es una grilla visual compleja) y convertirlos a un JSON estricto.

      INSTRUCCIONES CRÍTICAS PARA LEER LA GRILLA:
      1. Estructura: La primera columna tiene los nombres de los eventos (filas). Las columnas superiores son los meses.
      2. REGLA DE ORO (Nota al pie del PDF): Los números impresos en las celdas corresponden SIEMPRE a días LUNES. Las actividades duran desde ese día lunes hasta el sábado de esa misma semana.
      3. Secciones: Asegúrate de revisar todas las secciones hacia abajo ("ESTUDIANTES", "DOCENTES", "DEPARTAMENTOS DOCENTES", "DIRECCIÓN DE CARRERA", "BEDELIA", "AREA DE COORDINACIÓN..."). ¡No omitas ninguna fila!

      CÓMO CALCULAR LAS FECHAS:
      Para cada evento (fila):
      - start_date: Sigue la línea del evento hacia la derecha. Encuentra la PRIMERA vez que aparece un número en un mes. Ese número es el día de inicio.
      - end_date: Sigue la misma línea hasta el FINAL. Encuentra el ÚLTIMO número marcado. A esa fecha (que es un lunes), súmale 5 días para que la fecha de fin caiga en sábado.
      - Años: Enero a Diciembre usan el año 2026. Los meses repetidos al final (Enero, Febrero, Marzo) corresponden a 2027.
      - Formato: "YYYY-MM-DD". Ejemplo: Si el primer número es 9 bajo la columna MARZO, start_date es "2026-03-09".

      Formato de Salida Requerido:
      Solo devuelve un JSON válido con esta estructura:
      [
        {
          "title": "Nombre exacto del evento",
          "category": "ACADEMICO | EXAMEN | ADMINISTRATIVO",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD"
        }
      ]
    `;

    const pdfPath = path.join(__dirname, "Calendario_Academico_2026_2027.pdf");
    const outputPath = path.join(__dirname, "output.json");
    const pdfPart = fileToGenerativePart(pdfPath, "application/pdf");

    console.log("🤖 Consultando a Gemini (Multimodal)...");
    
    const result = await model.generateContent([prompt, pdfPart]);
    const response = await result.response;
    let text = response.text();

    // Limpieza
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    if (!text) {
      throw new Error("La respuesta de Gemini esta vacia.");
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ Respuesta no es JSON valido.");
      console.error(text.slice(0, 400));
      throw parseError;
    }

    if (!Array.isArray(parsed)) {
      throw new Error("El JSON debe ser un array de eventos.");
    }

    const requiredFields = ["title", "category", "start_date", "end_date"];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    parsed.forEach((event, index) => {
      if (!event || typeof event !== "object") {
        throw new Error(`Evento invalido en indice ${index}.`);
      }

      requiredFields.forEach((field) => {
        if (!event[field]) {
          throw new Error(`Falta el campo '${field}' en indice ${index}.`);
        }
      });

      if (!dateRegex.test(event.start_date) || !dateRegex.test(event.end_date)) {
        throw new Error(`Formato de fecha invalido en indice ${index}.`);
      }
    });

    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));
    console.log("✅ ¡Exito! JSON generado (incluso si era una imagen).");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

parseCalendar();