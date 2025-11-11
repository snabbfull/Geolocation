/* eslint-disable import/extensions */
import InputInterface from './inputInterface/inputInterface';

const body = document.querySelector('body');

const container = document.createElement('div');
container.classList.add('container');
body.append(container);

const textInput = document.createElement('input');
textInput.classList.add('input');
textInput.id = 'text';
textInput.placeholder = 'Введите сообщение и нажмите Enter...';
container.append(textInput);

const geoBtn = document.createElement('button');
geoBtn.classList.add('geo-btn');
geoBtn.textContent = 'Определить ваше местоположение';
container.append(geoBtn);

async function getIPGeolocation() {
  try {
    const response = await fetch('https://ipinfo.io/json');
    const data = await response.json();

    if (data.loc) {
      const [latitude, longitude] = data.loc.split(',').map(Number);
      return { latitude, longitude };
    }
    console.error('Местоположение по IP не найдено');
    return null;
  } catch (err) {
    console.error('Ошибка получения геолокации по IP:', err);
    return null;
  }
}

function handleIPResult(coords) {
  if (coords) {
    console.log(`Местоположение (IP): ${coords.latitude}, ${coords.longitude}`);
    geoBtn.textContent = 'Местоположение получено (через IP)';
  } else {
    geoBtn.textContent = 'Не удалось получить местоположение';
    geoBtn.disabled = false;
  }
}

geoBtn.addEventListener('click', () => {
  geoBtn.disabled = true;
  geoBtn.textContent = 'Определяем...';

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Широта: ${latitude}, Долгота: ${longitude}`);
        geoBtn.textContent = 'Местоположение получено ✅';
      },
      (error) => {
        console.error('Ошибка геолокации:', error.message || 'Неизвестная ошибка');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('Пользователь запретил доступ к геолокации');
            geoBtn.textContent = 'Доступ запрещён';
            geoBtn.disabled = false;
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Информация о местоположении недоступна');
            geoBtn.textContent = 'Пробуем через IP...';
            getIPGeolocation().then(handleIPResult);
            break;
          case error.TIMEOUT:
            console.error('Время ожидания истекло');
            geoBtn.textContent = 'Пробуем через IP...';
            getIPGeolocation().then(handleIPResult);
            break;
          default:
            console.error('Неизвестная ошибка');
            geoBtn.textContent = 'Ошибка получения местоположения';
            geoBtn.disabled = false;
            break;
        }
      },
      {
        timeout: 30000, // 30 секунд
        maximumAge: 900000, // 15 минут
      },
    );
  } else {
    console.error('Геолокация не поддерживается вашим браузером');
    geoBtn.textContent = 'Геолокация не поддерживается';
    geoBtn.disabled = true;
  }
});

// eslint-disable-next-line no-new
new InputInterface(container);
