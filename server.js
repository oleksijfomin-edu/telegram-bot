const http = require('http');

// Функція-обробник запитів
const requestHandler = (request, response) => {
    console.log('Запит отримано.');
    // Додамо помилку тут, наприклад, спроба доступу до властивості, яка не існує
    console.log(response.someNonExistentProperty); 
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'}); // Встановлюємо правильне кодування
    response.end('Привіт з веб-сервера Node.js!');
};

// Створення сервера
const server = http.createServer(requestHandler);

// Прослуховування на порту 3000
const port = process.env.PORT || 3000;
server.listen(port, (err) => {
    if (err) {
        return console.log('Щось пішло не так:', err);
    }

    console.log('Сервер працює на http://localhost:3000');
});
