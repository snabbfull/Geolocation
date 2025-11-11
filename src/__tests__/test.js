import parseCoordinates from '../js/utils/parseCoordinates';

describe('parseCoordinates', () => {
  test('корректно парсит "51.50851, -0.12572" (с пробелом)', () => {
    const result = parseCoordinates('51.50851, -0.12572');
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  test('корректно парсит "51.50851,-0.12572" (без пробела)', () => {
    const result = parseCoordinates('51.50851,-0.12572');
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  test('корректно парсит "[51.50851, -0.12572]" (со скобками)', () => {
    const result = parseCoordinates('[51.50851, -0.12572]');
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  test('генерирует ошибку при неверном формате', () => {
    expect(() => parseCoordinates('abc, def')).toThrow();
  });
});
