import { MODES } from './constants.js';

const STORAGE_KEY = 'flipoff.mode';

export class ModeManager {
  constructor(initialMode = MODES.SHOWCASE) {
    this.listeners = new Set();
    this.mode = this._loadMode(initialMode);
  }

  _loadMode(fallback) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === MODES.SHOWCASE || stored === MODES.SLEEP) {
        return stored;
      }
    } catch (e) {
      // Ignore localStorage errors and use fallback mode.
    }
    return fallback;
  }

  setMode(nextMode) {
    if (nextMode !== MODES.SHOWCASE && nextMode !== MODES.SLEEP) {
      return;
    }
    if (this.mode === nextMode) {
      return;
    }

    this.mode = nextMode;

    try {
      localStorage.setItem(STORAGE_KEY, this.mode);
    } catch (e) {
      // Ignore localStorage errors.
    }

    this.listeners.forEach((listener) => listener(this.mode));
  }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
