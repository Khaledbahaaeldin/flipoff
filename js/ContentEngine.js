import {
  CITIES,
  MODE_PROFILES,
  MODES,
  SOFTWARE_QUOTES,
  MESSAGES
} from './constants.js';

const WEATHER_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

export class ContentEngine {
  constructor() {
    this.weatherCache = new Map();
    this.weatherFetchedAt = 0;
    this.quoteCursor = 0;
  }

  async getPages(mode) {
    const profile = MODE_PROFILES[mode] || MODE_PROFILES[MODES.SHOWCASE];
    await this._refreshWeatherIfNeeded(profile.weatherRefreshMs);

    const pages = [];
    pages.push(...this._buildClockPages());
    pages.push(...this._buildWeatherPages());
    pages.push(...this._buildCurrentQuotePages(mode));

    return pages.length ? pages : this._fallbackPages();
  }

  _fallbackPages() {
    return MESSAGES.length ? MESSAGES : [['', 'FLIPOFF READY', 'NO CONTENT', '', '']];
  }

  _buildClockPages() {
    const now = new Date();
    return CITIES.map((city) => {
      const time = this._formatTime(now, city.timezone);
      const gregorian = this._formatGregorianDate(now, city.timezone);
      const hijri = this._formatHijriDate(now, city.timezone);

      return [
        city.display,
        `TIME ${time}`,
        `GREG ${gregorian}`,
        `HIJR ${hijri}`,
        ''
      ];
    });
  }

  _buildWeatherPages() {
    return CITIES.map((city) => {
      const weather = this.weatherCache.get(city.id);
      if (!weather) {
        return [
          city.display,
          'WEATHER LOADING',
          'PLEASE WAIT...',
          '',
          ''
        ];
      }

      return [
        city.display,
        `${weather.summary} ${weather.temp}C`,
        `FEELS ${weather.feelsLike}C`,
        `HUM ${weather.humidity}% WIND ${weather.wind}K`,
        `WX ${weather.updated}`
      ];
    });
  }

  _buildCurrentQuotePages(mode) {
    if (!SOFTWARE_QUOTES.length) {
      return [];
    }

    const quote = SOFTWARE_QUOTES[this.quoteCursor % SOFTWARE_QUOTES.length];
    this.quoteCursor = (this.quoteCursor + 1) % SOFTWARE_QUOTES.length;

    return this._toQuotePages(quote, mode);
  }

  _toQuotePages(quote, mode) {
    const wrapped = this._wrapText(quote.text, 20);
    const author = this._fit(`- ${quote.author}`, 20);

    const pages = [];
    const chunkSize = 3;
    const totalChunks = Math.ceil(wrapped.length / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = wrapped.slice(i * chunkSize, (i + 1) * chunkSize);
      const isLast = i === totalChunks - 1;

      pages.push([
        i === 0 ? (mode === MODES.SLEEP ? 'SLEEP QUOTE' : 'FUNNY QUOTE') : `QUOTE CONT ${i + 1}`,
        chunk[0] || '',
        chunk[1] || '',
        chunk[2] || '',
        isLast ? author : '...'
      ]);
    }

    return pages;
  }

  _wrapText(text, maxWidth) {
    const words = text.toUpperCase().split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';

    for (const word of words) {
      if (word.length > maxWidth) {
        if (current) {
          lines.push(current);
          current = '';
        }

        for (let i = 0; i < word.length; i += maxWidth) {
          lines.push(word.slice(i, i + maxWidth));
        }
        continue;
      }

      const next = current ? `${current} ${word}` : word;
      if (next.length <= maxWidth) {
        current = next;
        continue;
      }

      if (current) {
        lines.push(current);
      }
      current = word;
    }

    if (current) {
      lines.push(current);
    }

    return lines.length ? lines : [''];
  }

  _fit(value, maxWidth) {
    const upper = String(value || '').toUpperCase();
    return upper.length <= maxWidth ? upper : `${upper.slice(0, Math.max(0, maxWidth - 3))}...`;
  }

  _formatTime(now, timezone) {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone
    }).format(now);
  }

  _formatGregorianDate(now, timezone) {
    const value = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: timezone
    }).format(now);
    return value.toUpperCase();
  }

  _formatHijriDate(now, timezone) {
    const value = new Intl.DateTimeFormat('en-GB-u-ca-islamic', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: timezone
    }).format(now);
    return value.toUpperCase();
  }

  async _refreshWeatherIfNeeded(refreshMs) {
    const now = Date.now();
    if (this.weatherFetchedAt && now - this.weatherFetchedAt < refreshMs) {
      return;
    }

    try {
      const responses = await Promise.all(
        CITIES.map((city) => this._fetchWeather(city))
      );

      responses.forEach((weather, index) => {
        if (!weather) {
          return;
        }
        this.weatherCache.set(CITIES[index].id, weather);
      });

      this.weatherFetchedAt = now;
    } catch (e) {
      // Keep existing cache on weather failures.
    }
  }

  async _fetchWeather(city) {
    const params = new URLSearchParams({
      latitude: String(city.latitude),
      longitude: String(city.longitude),
      current: 'temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m',
      timezone: city.timezone
    });

    const response = await fetch(`${WEATHER_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const current = payload.current;
    if (!current) {
      return null;
    }

    const updated = this._extractClockTime(current.time, city.timezone);
    return {
      temp: Math.round(current.temperature_2m ?? 0),
      feelsLike: Math.round(current.apparent_temperature ?? 0),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      wind: Math.round(current.wind_speed_10m ?? 0),
      summary: this._weatherCodeToLabel(current.weather_code),
      updated
    };
  }

  _extractClockTime(iso, timezone) {
    if (!iso) {
      return this._formatTime(new Date(), timezone);
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return this._formatTime(new Date(), timezone);
    }
    return this._formatTime(date, timezone);
  }

  _weatherCodeToLabel(code) {
    const map = {
      0: 'CLEAR',
      1: 'MAINLY CLR',
      2: 'PART CLOUD',
      3: 'OVERCAST',
      45: 'FOG',
      48: 'RIME FOG',
      51: 'LIGHT DRIZ',
      53: 'DRIZZLE',
      55: 'HEAVY DRIZ',
      56: 'FREEZ DRIZ',
      57: 'FREEZ DRIZ',
      61: 'LIGHT RAIN',
      63: 'RAIN',
      65: 'HEAVY RAIN',
      66: 'FRZ RAIN',
      67: 'FRZ RAIN',
      71: 'LIGHT SNOW',
      73: 'SNOW',
      75: 'HEAVY SNOW',
      77: 'SNOW GRAIN',
      80: 'RAIN SHWR',
      81: 'RAIN SHWR',
      82: 'HVY SHWR',
      85: 'SNOW SHWR',
      86: 'SNOW SHWR',
      95: 'TSTORM',
      96: 'TSTM HAIL',
      99: 'TSTM HAIL'
    };

    return map[code] || 'WEATHER';
  }
}
