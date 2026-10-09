@echo off
chcp 65001 >nul
title NOVA - 本地预览服务器
cd /d "%~dp0"

set PORT=8000
where python >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有找到 python 命令。
  echo 请先安装 Python，或用其他方式启动一个静态服务器后访问本目录。
  pause
  exit /b 1
)

echo ================================================
echo   NOVA 网站本地预览
echo   地址:  http://127.0.0.1:%PORT%
echo   关闭本窗口即停止服务
echo ================================================
echo.

start "" "http://127.0.0.1:%PORT%/index.html"
python -m http.server %PORT% --bind 127.0.0.1
pause
