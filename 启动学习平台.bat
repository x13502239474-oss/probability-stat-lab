@echo off
chcp 65001 >nul
title 概率论与数理统计 · 系统学习平台
cd /d "%~dp0"
echo.
echo   ============================================
echo    概率论与数理统计 · 系统学习平台
echo   ============================================
echo.
echo   正在启动本地服务器…
echo   启动后浏览器会自动打开；若未自动打开，
echo   请手动访问：http://localhost:8899
echo.
echo   关闭本窗口即可停止服务。
echo.
start "" http://localhost:8899/index.html
python -m http.server 8899
pause
