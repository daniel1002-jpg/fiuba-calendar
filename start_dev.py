import subprocess
import time
import argparse
import sys
import os

# --- CONFIGURACIÓN ---
PATH_PARSER = "./data-parser"
PATH_BACKEND = "./backend"
PATH_FRONTEND = "./frontend"

def run_command(command: str, cwd: str, description: str):
    """
    Ejecuta un comando en una carpeta específica

    :param command: El comando a ejecutar
    :param cwd: La carpeta donde se ejecutará el comando
    :param description: Descripción de la tarea para mostrar al usuario
    """
    print(f"🔵 {description}...")
    try:
        subprocess.run(command, cwd=cwd, shell=True, check=True)
        print(f"✅ {description} completado.")
    except subprocess.CalledProcessError:
        print(f"❌ Error durante: {description}")
        sys.exit(1)

def run_parser():
    """Ejecuta el parser para generar el JSON"""
    run_command("node parser.js", PATH_PARSER, "Generando JSON con Gemini")

def run_seeder():
    """Ejecuta el seed.js para subir el JSON actual a Neon"""
    run_command("node seed.js", PATH_BACKEND, "Actualizando Base de Datos (Seeding)")

def start_servers():
    """Levanta Backend y Frontend en paralelo"""
    print("\n🚀 Iniciando entorno de desarrollo...")
    processes = []
    try:
        print("🔹 Levantando Backend (Server)...")
        backend = subprocess.Popen("npm run dev", cwd=PATH_BACKEND, shell=True)
        print("Información del proceso Backend:", backend.pid)
        processes.append(backend)

        print("🔹 Levantando Frontend (React)...")
        frontend = subprocess.Popen("npm run dev", cwd=PATH_FRONTEND, shell=True)
        processes.append(frontend)

        print("\n✨ ¡Todo corriendo! Presiona CTRL+C para detener.\n")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Deteniendo servidores...")
        for p in processes:
            p.terminate()
        sys.exit(0)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gestor de FIUBA Calendar")
    
    parser.add_argument("-s", "--seed", action="store_true", help="Ejecutar seed.js para actualizar la DB con el JSON actual")
    parser.add_argument("-u", "--update-all", action="store_true", help="⚠️ Regenerar JSON (Parser) Y actualizar DB (Seed)")
    
    args = parser.parse_args()

    if args.update_all:
        print("⚠️  ATENCIÓN: Esto sobrescribirá tus correcciones manuales en el JSON.")
        confirm = input("¿Estás seguro? (s/n): ")
        if confirm.lower() == 's':
            run_parser()
            run_seeder()
        else:
            print("Cancelado.")
            sys.exit(0)
    
    elif args.seed:
        run_seeder()

    start_servers()