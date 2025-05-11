@echo off
chcp 65001
cd ./backend

echo ================================
echo 🚀 Đang chạy Spring Boot...
echo ================================
mvn clean install && mvn spring-boot:run

pause
