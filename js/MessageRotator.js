import { MODE_PROFILES, MODES, TOTAL_TRANSITION } from './constants.js';

export class MessageRotator {
  constructor(board, contentEngine, modeManager) {
    this.board = board;
    this.contentEngine = contentEngine;
    this.modeManager = modeManager;
    this.pages = [];
    this.currentIndex = -1;
    this._timer = null;
    this._paused = false;

    if (this.modeManager) {
      this.modeManager.onChange(async () => {
        await this.refreshPages(true);
        this.currentIndex = -1;
        this.next();
        this._resetAutoRotation();
      });
    }
  }

  async start() {
    await this.refreshPages(true);

    // Show first message immediately
    this.next();

    // Begin auto-rotation
    this._timer = setInterval(() => {
      if (!this._paused && !this.board.isTransitioning) {
        this.next();
      }
    }, this._getCurrentInterval() + TOTAL_TRANSITION);
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  async refreshPages(force = false) {
    if (!this.contentEngine) return;

    if (!force && this.pages.length) {
      return;
    }

    const mode = this.modeManager?.mode || MODES.SHOWCASE;
    const pages = await this.contentEngine.getPages(mode);
    this.pages = pages && pages.length
      ? pages
      : [['', 'FLIPOFF READY', 'NO CONTENT', '', '']];

    if (this.currentIndex >= this.pages.length) {
      this.currentIndex = -1;
    }
  }

  next() {
    if (!this.pages.length) return;

    this.currentIndex = (this.currentIndex + 1) % this.pages.length;
    this.board.displayMessage(this.pages[this.currentIndex]);

    // Refresh periodically so weather/time stay current.
    if (this.currentIndex === this.pages.length - 1) {
      this.refreshPages(true);
    }

    this._resetAutoRotation();
  }

  prev() {
    if (!this.pages.length) return;

    this.currentIndex = (this.currentIndex - 1 + this.pages.length) % this.pages.length;
    this.board.displayMessage(this.pages[this.currentIndex]);
    this._resetAutoRotation();
  }

  _getCurrentInterval() {
    const mode = this.modeManager?.mode || MODES.SHOWCASE;
    return (MODE_PROFILES[mode] || MODE_PROFILES[MODES.SHOWCASE]).messageInterval;
  }

  _resetAutoRotation() {
    // Reset timer when user manually navigates
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = setInterval(() => {
        if (!this._paused && !this.board.isTransitioning) {
          this.next();
        }
      }, this._getCurrentInterval() + TOTAL_TRANSITION);
    }
  }
}
