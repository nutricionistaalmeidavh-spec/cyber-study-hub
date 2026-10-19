@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22+ nao foi encontrado.
  echo Instale em https://nodejs.org/en/download e execute novamente.
  pause
  exit /b 1
)
echo =================================================
echo  ESCOLALAB - Artisys Academy
echo  Abra http://127.0.0.1:4191 no navegador.
echo  Pressione Ctrl+C para encerrar.
echo =================================================
node server.mjs
if errorlevel 1 (
  echo Erro ao iniciar. Verifique se a porta 4191 esta livre.
  pause
)
