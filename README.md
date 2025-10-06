# Cars SPA

SPA-приложение для просмотра, сортировки, редактирования и удаления автомобилей, полученных через REST API.  
Реализовано на **React + TypeScript + Redux Toolkit**.

---

## Цель

Реализовать одностраничное приложение (SPA) с возможностью:
- просмотра списка машин,
- сортировки по году выпуска и цене,
- редактирования данных,
- удаления,
- добавления новых автомобилей.

## Реализованный функционал
- Вывод списка машин (name, model, year, price),
- Создание машины (name, model, year, color, price),
- Редактирование машины по полям name и price (инлайн),
- Удаление машины,
- Сортировка по year и price (переключение asc/desc),
- Дополнительно: Карта (Leaflet) с маркерами по latitude, longitude,
- Проект на TypeScript,
- Состояние через Redux Toolkit.

## Стек
- React (Vite)
- TypeScript
- Redux Toolkit, react-redux
- Axios — запросы к API
- Leaflet / react-leaflet — карта
- json-server — локальный REST API
- CSS

## Запуск проекта

1. Клонировать репозиторий:
```bash
git clone https://github.com/Viktorikata/Cars-spa.git
```

2. Перейти в папку проекта
```bash
cd cars-spa
```

3. Установить зависимости: 
```bash
npm install
```

4. Запустить локальный API (json-server) 
```bash
npm run server
```

5. Запустить фронтенд 
```bash
npm run dev
```

