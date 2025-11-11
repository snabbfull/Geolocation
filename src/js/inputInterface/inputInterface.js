// eslint-disable-next-line import/extensions
import parseCoordinates from '../utils/parseCoordinates';

export default class InputInterface {
  constructor(container) {
    this.container = container;
    this.input = this.container.querySelector('.input');
    this.textCounter = 0;

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.textAdd();
      }
    });
  }

  textAdd() {
    const value = this.input.value.trim();
    if (!value) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.addMessage(value, latitude, longitude);
        },
        () => this.showModal(), // вызов модалки при ошибке
        {
          timeout: 30000,
          maximumAge: 900000, // кэшировать до 15 минут
        },
      );
    } else {
      this.showModal();
    }
  }

  addMessage(text, lat, lon) {
    this.textCounter += 1;
    const newText = document.createElement('div');
    newText.classList.add('newText');
    newText.id = `newText-id${this.textCounter}`;
    newText.innerText = `${text} | ${this.dateInfo} | широта: ${lat.toFixed(4)}, долгота: ${lon.toFixed(4)}`;
    this.container.prepend(newText);
    this.input.value = '';
  }

  get dateInfo() {
    return new Date().toLocaleString();
  }

  showModal() {
    const existing = document.querySelector('.modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const content = document.createElement('div');
    content.style.background = 'white';
    content.style.padding = '16px';
    content.style.borderRadius = '10px';
    content.style.width = '280px';
    content.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    modal.append(content);

    const modalText = document.createElement('span');
    modalText.classList.add('modal-text');
    modalText.textContent = `Что-то пошло не так!\nК сожалению, мы не можем определить ваше местоположение.\nВведите координаты вручную через запятую (широта, долгота):`;
    content.append(modalText);

    const geoInput = document.createElement('input');
    geoInput.classList.add('geo-input');
    geoInput.placeholder = 'Широта, долгота';
    content.append(geoInput);

    geoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        try {
          const coords = parseCoordinates(geoInput.value);
          this.addMessage(this.input.value, coords.latitude, coords.longitude);
          modal.remove();
        } catch (err) {
          geoInput.classList.add('input-error');
          setTimeout(() => geoInput.classList.remove('input-error'), 500);
        }
      }
    });

    document.body.append(modal);
  }
}
