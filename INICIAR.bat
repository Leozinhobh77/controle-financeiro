@echo off
chcp 65001 > nul
echo.
echo ==========================================
echo   CONTROLE FINANCEIRO v2 — Obsidian Gold
echo ==========================================
echo.

:: Vai para a pasta do projeto
cd /d "%~dp0"

:: Verifica se node_modules existe
if not exist "node_modules\" (
    echo [1/3] Instalando dependencias...
    call npm install
    if errorlevel 1 goto :erro
    echo.
)

:: Gera o cliente Prisma
echo [2/3] Gerando cliente do banco de dados...
call prisma generate --schema=lib/database/schema.prisma
if errorlevel 1 (
    echo Tentando via npx...
    call npx prisma generate --schema=lib/database/schema.prisma
)
echo.

:: Inicia o servidor
echo [3/3] Iniciando servidor...
echo.
echo ==========================================
echo   App rodando em: http://localhost:3000
echo   Pressione Ctrl+C para parar
echo ==========================================
echo.
call npm run dev
goto :fim

:erro
echo.
echo ERRO: Falha na instalacao. Tente rodar manualmente:
echo   npm install
echo   prisma generate --schema=lib/database/schema.prisma
echo   npm run dev
pause

:fim
