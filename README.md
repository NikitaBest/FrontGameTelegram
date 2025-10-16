# FrontGameTelegram

React приложение для Telegram Mini App с интеграцией платежей.

## Настройка конфигурации

### Переменные окружения

Для настройки адреса бекенда создайте файл `.env` в корне проекта:

```bash
# Базовый URL API бекенда
VITE_API_BASE_URL=https://telegram-games.tg-projects.ru
```

### Доступные переменные:

- `VITE_API_BASE_URL` - базовый URL API бекенда (по умолчанию: https://telegram-games.tg-projects.ru)

### Примеры конфигурации:

**Для локальной разработки:**
```bash
VITE_API_BASE_URL=http://localhost:3000
```

**Для продакшена:**
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Запуск проекта

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```
