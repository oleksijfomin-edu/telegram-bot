const axios = require('axios');

async function getWeather(city) {
    try {
        const apiKey = '9d8b7911add32dd26e062b424804dd79';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data; // Отримуємо дані з результату запиту

        const playerData = response.data;

        if (playerData) {
            const trophies = playerData.trophies;
            const playerLevel = playerData.expLevel;
            const clanName = playerData.clan ? playerData.clan.name : 'Не в клане';
            const clanRole = playerData.clan ? playerData.role : 'Не в клане';

            return `
                Имя игрока: ${playerData.name}
                Кубков: ${trophies}
                Уровень: ${playerLevel}
                Клан: ${clanName} (${clanRole})
            `;
        } else {
            return 'Информация об игроке не найдена.';
        }
    } catch (error) {
        console.error('Ошибка при получении данных игрока:', error);
        return 'Произошла ошибка при получении данных игрока. Пожалуйста, попробуйте позже.';
    }
}

// Для тестирования
const playerTag = '2YVQ20V8U'; // Замените на реальный хэштег игрока (без символа хештега)
getRoyaleStats(playerTag)
    .then(result => console.log(result))
    .catch(error => console.error(error));

module.exports = getRoyaleStats;
