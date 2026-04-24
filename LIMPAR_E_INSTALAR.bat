@echo off
chcp 65001 > nul
echo.
echo ==========================================
echo   LIMPEZA E REINSTALACAO
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/4] Removendo node_modules corrompido...
if exist "node_modules\" (
    rmdir /s /q "node_modules"
    if errorlevel 1 (
        echo Tentando via PowerShell...
        powershell -Command "Remove-Item -Recurse -Force '.\node_modules'"
    )
    echo Removido!
) else (
    echo node_modules nao encontrado, pulando...
)

echo.
echo [2/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo Falhou. Tentando com --force...
    call npm install --force
    if errorlevel 1 goto :erro
)
echo.

echo [3/4] Gerando cliente do banco de dados...
call npx prisma generate --schema=lib/database/schema.prisma
if errorlevel 1 (
    prisma generate --schema=lib/database/schema.prisma
)
echo.

echo [4/4] Iniciando servidor...
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
echo ERRO: Falha na instalacao.
echo Tente fechar todos os programas que usam Node.js e rodar novamente.
pause

:fim
