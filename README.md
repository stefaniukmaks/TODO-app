# Todo App

Простий веб-додаток для керування задачами. Побудований на Node.js + Express + PostgreSQL без Docker.

## 🛠 Технології

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: Vanilla HTML/CSS/JS
- **Process Manager**: systemd

## Структура проекту

```
todo-app/
├── src/
│   └── index.js        # Express сервер і API
├── public/
│   └── index.html      # Фронтенд
├── .env                # Змінні середовища (не в репо)
├── .gitignore
└── package.json
```

## становлення

### 1. Клонувати репозиторій

```bash
git clone https://github.com/stefaniukmaks/TODO-app.git
cd TODO-app
```

### 2. Встановити залежності

```bash
npm install
```

### 3. Налаштувати базу даних

```bash
sudo -u postgres psql
```

```sql
CREATE USER appuser WITH PASSWORD 'apppass';
CREATE DATABASE tododb OWNER appuser;
\q
```

### 4. Створити `.env` файл

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=appuser
DB_PASSWORD=apppass
DB_NAME=tododb
PORT=3000
```

### 5. Запустити

```bash
node src/index.js
```

Відкрий браузер на `http://localhost:3000`

## Запуск через systemd

```bash
sudo nano /etc/systemd/system/todo-app.service
```

```ini
[Unit]
Description=Todo App
After=network.target postgresql.service

[Service]
Type=simple
User=mksym
WorkingDirectory=/home/mksym/todo-app
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
EnvironmentFile=/home/mksym/todo-app/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable todo-app
sudo systemctl start todo-app
```

## API

| Метод | URL | Опис |
|---|---|---|
| GET | /api/todos | Отримати всі задачі |
| POST | /api/todos | Додати задачу |
| PATCH | /api/todos/:id | Відмітити виконаною |
| DELETE | /api/todos/:id | Видалити задачу |
