const axios = require('axios');

async function getRoyaleStats(playerTag) {
    const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjFmYThkYzczLTNmNzgtNGI4Yy1mY2Y5LTU2MDc4YmU3NDYwZSIsImlhdCI6MTcxMjU3MjI2MiwiZXhwIjoxNzEyNTc1ODYyLCJzdWIiOiJkZXZlbG9wZXIvZWVlM2JiNDgtYzRhYy1kMGNkLTY2NTYtMjEyNTRiYWMxMzc0Iiwic2NvcGVzIjpbInJveWFsZSJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvYnJvbnplIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjIxMy4xMDkuODIuODAvMzIiXSwidHlwZSI6ImNsaWVudCJ9LHsib3JpZ2lucyI6WyJkZXZlbG9wZXIuY2xhc2hyb3lhbGUuY29tIl0sInR5cGUiOiJjb3JzIn1dfQ.BK4TrGMz8B4cORYyBqEEn7lWmHq_cN5ZaV9YeakcMp6mB0w50cI1TlUnojQdv7Zw5Z89JKup5QWnMg-BQgUv5g';
    const url = `https://api.clashroyale.com/v1/players/%23${playerTag}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

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
