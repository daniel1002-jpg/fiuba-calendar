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
    
    const model = genAi.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Actúa como un asistente administrativo de la FIUBA.
      Analiza este documento visualmente. Es un calendario académico.
      
      Extrae TODOS los eventos y fechas importantes en un JSON estricto.
      
      Reglas:
      1. Devuelve SOLO el JSON.
      2. Si es una imagen escaneada, usa OCR visual para leer las fechas.
      3. Formato:
         [
           {
             "title": "Nombre del evento",
             "category": "ACADEMICO | EXAMEN | ADMINISTRATIVO",
             "start_date": "YYYY-MM-DD",
             "end_date": "YYYY-MM-DD"
           }
         ]
      4. Asume el año 2026.
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