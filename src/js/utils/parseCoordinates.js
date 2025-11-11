export default function parseCoordinates(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Некорректный ввод');
  }

  // 1️⃣ Нормализуем строку
  const cleaned = input
    .replace(/\[|\]/g, '') // убираем квадратные скобки
    .replace(/-|–|—/g, '-') // заменяем длинные тире и типографские минусы на обычный минус
    .trim();

  // 2️⃣ Разбиваем по запятой
  const parts = cleaned.split(',').map((p) => p.trim());

  if (parts.length !== 2) {
    throw new Error('Ожидался формат "lat, lon"');
  }

  // 3️⃣ Преобразуем в числа
  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);

  // 4️⃣ Проверяем диапазоны
  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error('Некорректные координаты');
  }

  return { latitude, longitude };
}
