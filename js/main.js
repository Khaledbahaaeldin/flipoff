import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';
import { ModeManager } from './ModeManager.js';
import { ContentEngine } from './ContentEngine.js';
import { MODE_PROFILES, MODES } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  const entryScreen = document.getElementById('entry-screen');
  const appShell = document.getElementById('app-shell');
  const launchShowcaseBtn = document.getElementById('launch-showcase');
  const launchSleepBtn = document.getElementById('launch-sleep');

  const boardContainer = document.getElementById('board-container');
  const modeManager = new ModeManager(MODES.SHOWCASE);
  const soundEngine = new SoundEngine();
  const board = new Board(boardContainer, soundEngine);
  const contentEngine = new ContentEngine();
  const rotator = new MessageRotator(board, contentEngine, modeManager);
  const keyboard = new KeyboardController(rotator, soundEngine, modeManager);
  let appStarted = false;

  const applyMode = (mode) => {
    const profile = MODE_PROFILES[mode] || MODE_PROFILES[MODES.SHOWCASE];
    board.setMode(mode);
    soundEngine.applyModeProfile(profile);

    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.body.classList.toggle('showcase-kiosk', mode === MODES.SHOWCASE);

    const volumeBtn = document.getElementById('volume-btn');
    if (volumeBtn) {
      volumeBtn.classList.toggle('muted', soundEngine.muted);
    }

    if (mode === MODES.SHOWCASE && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  modeManager.onChange((mode) => {
    applyMode(mode);
  });

  // Initialize audio on first user interaction (browser autoplay policy)
  let audioInitialized = false;
  const initAudio = async () => {
    if (audioInitialized) return;
    audioInitialized = true;
    await soundEngine.init();
    soundEngine.resume();
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };
  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);

  const startApp = async (targetMode) => {
    if (appStarted) {
      modeManager.setMode(targetMode);
      return;
    }

    appStarted = true;
    if (entryScreen) {
      entryScreen.classList.add('hidden');
    }
    if (appShell) {
      appShell.classList.remove('app-hidden');
    }

    modeManager.setMode(targetMode);
    applyMode(targetMode);
    await rotator.start();
  };

  if (launchShowcaseBtn) {
    launchShowcaseBtn.addEventListener('click', () => {
      initAudio();
      startApp(MODES.SHOWCASE);
    });
  }

  if (launchSleepBtn) {
    launchSleepBtn.addEventListener('click', () => {
      initAudio();
      startApp(MODES.SLEEP);
    });
  }

  const directMode = new URLSearchParams(window.location.search).get('mode');
  if (directMode === MODES.SHOWCASE || directMode === MODES.SLEEP) {
    startApp(directMode);
  }

  // Volume toggle button in header
  const volumeBtn = document.getElementById('volume-btn');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      initAudio();
      const muted = soundEngine.toggleMute();
      volumeBtn.classList.toggle('muted', muted);
    });
  }

  // "Get Early Access" button: scroll to board and go fullscreen
  const ctaBtn = document.getElementById('cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      boardContainer.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.documentElement.requestFullscreen().catch(() => {});
      }, 400);
    });
  }

  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAudio();
      modeManager.setMode(btn.dataset.mode);
    });
  });
});
