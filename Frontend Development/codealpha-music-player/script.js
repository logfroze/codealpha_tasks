/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CodeAlpha Music Player — Vanilla JavaScript Core
 * Frontend Development Internship Portfolio Project
 * 
 * Demonstrates:
 * - HTML5 Audio API state management
 * - Responsive DOM manipulation & micro-interactions
 * - Accessible keyboard navigation & seek handlers
 * - Playlist management, shuffle & repeat state engines
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Song Data Structure (Public Domain & Royalty-Free Masterpieces)
  // =========================================================================
  const playlist = [
    {
      id: 1,
      title: 'Clair de Lune',
      artist: 'Claude Debussy',
      album: 'Suite bergamasque',
      audio: 'assets/audio/song1.mp3',
      artwork: 'assets/images/cover1.jpg',
      durationText: '05:12'
    },
    {
      id: 2,
      title: 'The Entertainer',
      artist: 'Scott Joplin',
      album: 'Classic Ragtime',
      audio: 'assets/audio/song2.mp3',
      artwork: 'assets/images/cover2.jpg',
      durationText: '03:48'
    },
    {
      id: 3,
      title: 'Maple Leaf Rag',
      artist: 'Scott Joplin',
      album: 'Sedalia Sessions',
      audio: 'assets/audio/song3.mp3',
      artwork: 'assets/images/cover3.jpg',
      durationText: '03:22'
    },
    {
      id: 4,
      title: 'Für Elise',
      artist: 'Ludwig van Beethoven',
      album: 'Bagatelle in A Minor',
      audio: 'assets/audio/song4.mp3',
      artwork: 'assets/images/cover4.jpg',
      durationText: '02:56'
    },
    {
      id: 5,
      title: 'Spring Allegro',
      artist: 'Antonio Vivaldi',
      album: 'The Four Seasons, Op. 8',
      audio: 'assets/audio/song5.mp3',
      artwork: 'assets/images/cover5.jpg',
      durationText: '04:15'
    }
  ];

  // =========================================================================
  // 2. Application State Engine
  // =========================================================================
  const state = {
    currentIndex: 0,
    isPlaying: false,
    volume: 0.8,
    previousVolume: 0.8,
    isMuted: false,
    isShuffle: false,
    repeatMode: 'all', // 'off' | 'all' | 'one'
    isDraggingProgress: false,
    shuffledIndices: []
  };

  // =========================================================================
  // 3. DOM Element References
  // =========================================================================
  const audio = document.getElementById('audio-element');

  // Player Card & Artwork
  const playerCard = document.getElementById('player-card');
  const trackArt = document.getElementById('track-art');
  const badgeDot = document.getElementById('badge-dot');
  const badgeText = document.getElementById('badge-text');

  // Metadata
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');
  const trackAlbum = document.getElementById('track-album');

  // Progress Bar & Times
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const progressHoverLine = document.getElementById('progress-hover-line');
  const progressTooltip = document.getElementById('progress-tooltip');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');

  // Controls
  const btnPlayPause = document.getElementById('btn-play-pause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnRepeat = document.getElementById('btn-repeat');
  const repeatIndicator = document.getElementById('repeat-indicator');

  // Volume
  const btnMute = document.getElementById('btn-mute');
  const volIconHigh = document.getElementById('vol-icon-high');
  const volIconLow = document.getElementById('vol-icon-low');
  const volIconMuted = document.getElementById('vol-icon-muted');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeFill = document.getElementById('volume-fill');
  const volumeLabel = document.getElementById('volume-label');

  // Playlist & Status
  const playlistItemsList = document.getElementById('playlist-items');
  const headerTrackCount = document.getElementById('header-track-count');
  const statusModeTag = document.getElementById('status-mode-tag');
  const statusShuffleTag = document.getElementById('status-shuffle-tag');

  // Shortcuts Modal
  const btnToggleShortcuts = document.getElementById('btn-toggle-shortcuts');
  const btnCloseShortcuts = document.getElementById('btn-close-shortcuts');
  const shortcutsModal = document.getElementById('shortcuts-modal');

  // Error Banner
  const audioErrorBanner = document.getElementById('audio-error-banner');
  const errorMessage = document.getElementById('error-message');
  const btnErrorRetry = document.getElementById('btn-error-retry');

  // =========================================================================
  // 4. Helper Utilities
  // =========================================================================

  /**
   * Formats seconds into MM:SS string.
   * Handles NaN, Infinity, and undefined gracefully.
   */
  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedMins = mins < 10 ? '0' + mins : mins;
    const paddedSecs = secs < 10 ? '0' + secs : secs;
    return `${paddedMins}:${paddedSecs}`;
  }

  // =========================================================================
  // 5. Track Loading & Rendering
  // =========================================================================

  /**
   * Loads a track by index and synchronizes all UI elements.
   * @param {number} index - Index in the playlist array
   * @param {boolean} autoPlay - Whether to immediately start playback
   */
  function loadSong(index, autoPlay = false) {
    // Validate bounds
    if (index < 0) index = playlist.length - 1;
    if (index >= playlist.length) index = 0;
    state.currentIndex = index;

    const song = playlist[index];
    if (!song) return;

    // Hide any previous error
    hideError();

    // Smooth Artwork Transition
    trackArt.classList.add('fade-out');
    setTimeout(() => {
      trackArt.src = song.artwork;
      trackArt.alt = `${song.title} by ${song.artist}`;
      trackArt.classList.remove('fade-out');
    }, 150);

    // Update Text Metadata
    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist;
    trackAlbum.textContent = song.album;

    // Reset Progress Interface
    progressBar.value = '0';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '00:00';
    totalDurationEl.textContent = song.durationText || '--:--';

    // Synchronize Audio Element Source
    // Only change source if different to avoid reloading
    const currentSrc = audio.getAttribute('src');
    if (currentSrc !== song.audio) {
      audio.src = song.audio;
      audio.load();
    }

    // Update Active Class in Playlist
    updatePlaylistActiveItem();

    if (autoPlay) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  /**
   * Plays the current audio track with promise error handling.
   */
  function playAudio() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.isPlaying = true;
          updatePlaybackUI(true);
        })
        .catch((error) => {
          console.warn('Playback interrupted or prevented by browser policy:', error);
          state.isPlaying = false;
          updatePlaybackUI(false);
        });
    }
  }

  /**
   * Pauses the audio track and synchronizes UI.
   */
  function pauseAudio() {
    audio.pause();
    state.isPlaying = false;
    updatePlaybackUI(false);
  }

  /**
   * Toggles between play and pause.
   */
  function togglePlayPause() {
    if (state.isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  /**
   * Updates all UI elements reflecting play/pause status.
   */
  function updatePlaybackUI(isPlaying) {
    if (isPlaying) {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
      btnPlayPause.setAttribute('aria-label', 'Pause Track');
      btnPlayPause.setAttribute('title', 'Pause');
      playerCard.classList.add('is-playing');
      badgeText.textContent = 'Playing';
    } else {
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
      btnPlayPause.setAttribute('aria-label', 'Play Track');
      btnPlayPause.setAttribute('title', 'Play');
      playerCard.classList.remove('is-playing');
      badgeText.textContent = 'Paused';
    }
    updatePlaylistActiveItem();
  }

  /**
   * Advances to next track based on shuffle/repeat rules.
   * @param {boolean} isAutomatic - True if triggered by song ending
   */
  function nextSong(isAutomatic = false) {
    if (state.repeatMode === 'one' && isAutomatic) {
      audio.currentTime = 0;
      playAudio();
      return;
    }

    let nextIndex;
    if (state.isShuffle) {
      // Pick a random track index different from current
      if (playlist.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === state.currentIndex);
      } else {
        nextIndex = 0;
      }
    } else {
      nextIndex = state.currentIndex + 1;
      // Handle end of playlist
      if (nextIndex >= playlist.length) {
        if (state.repeatMode === 'off' && isAutomatic) {
          // Reached end of playlist without repeat
          loadSong(0, false);
          return;
        }
        nextIndex = 0; // Wrap around for Repeat All
      }
    }

    loadSong(nextIndex, true);
  }

  /**
   * Moves to previous track or restarts current track if > 3s.
   */
  function prevSong() {
    // If song has played for more than 3 seconds, restart it first
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }
    loadSong(prevIndex, true);
  }

  // =========================================================================
  // 6. Progress & Seeking
  // =========================================================================

  /**
   * Updates progress bar during playback.
   */
  function onTimeUpdate() {
    if (state.isDraggingProgress) return;

    const current = audio.currentTime;
    const duration = audio.duration;

    currentTimeEl.textContent = formatTime(current);

    if (duration && !isNaN(duration) && duration > 0) {
      const progressPercent = (current / duration) * 100;
      progressBar.value = progressPercent.toString();
      progressBar.setAttribute('aria-valuenow', Math.round(progressPercent).toString());
      progressFill.style.width = `${progressPercent}%`;
      totalDurationEl.textContent = formatTime(duration);
    }
  }

  /**
   * Sets audio position from progress bar input.
   */
  function seekAudio() {
    const seekPercent = parseFloat(progressBar.value);
    progressFill.style.width = `${seekPercent}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(seekPercent).toString());

    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = (seekPercent / 100) * audio.duration;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }

  /**
   * Hover preview time tooltip on progress bar.
   */
  function onProgressMouseMove(e) {
    if (!audio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const hoverTime = percent * audio.duration;

    progressHoverLine.style.left = `${x}px`;
    progressHoverLine.classList.remove('hidden');

    progressTooltip.style.left = `${x}px`;
    progressTooltip.textContent = formatTime(hoverTime);
    progressTooltip.classList.remove('hidden');
  }

  function onProgressMouseLeave() {
    progressHoverLine.classList.add('hidden');
    progressTooltip.classList.add('hidden');
  }

  // =========================================================================
  // 7. Volume & Mute Controls
  // =========================================================================

  /**
   * Updates audio volume and UI indicators.
   * @param {number} val - Integer volume between 0 and 100
   */
  function updateVolume(val) {
    const num = Math.max(0, Math.min(100, parseInt(val, 10)));
    state.volume = num / 100;
    audio.volume = state.volume;

    volumeSlider.value = num.toString();
    volumeSlider.setAttribute('aria-valuenow', num.toString());
    volumeFill.style.width = `${num}%`;
    volumeLabel.textContent = `${num}%`;

    // Update Speaker Icon
    if (num === 0) {
      state.isMuted = true;
      volIconHigh.classList.add('hidden');
      volIconLow.classList.add('hidden');
      volIconMuted.classList.remove('hidden');
      btnMute.setAttribute('aria-label', 'Unmute audio');
    } else if (num < 45) {
      state.isMuted = false;
      volIconHigh.classList.add('hidden');
      volIconLow.classList.remove('hidden');
      volIconMuted.classList.add('hidden');
      btnMute.setAttribute('aria-label', 'Mute audio');
    } else {
      state.isMuted = false;
      volIconHigh.classList.remove('hidden');
      volIconLow.classList.add('hidden');
      volIconMuted.classList.add('hidden');
      btnMute.setAttribute('aria-label', 'Mute audio');
    }
  }

  /**
   * Toggles between mute and previous volume.
   */
  function toggleMute() {
    if (state.isMuted || state.volume === 0) {
      const restored = state.previousVolume > 0 ? state.previousVolume * 100 : 80;
      updateVolume(restored);
    } else {
      state.previousVolume = state.volume;
      updateVolume(0);
    }
  }

  // =========================================================================
  // 8. Shuffle & Repeat Modes
  // =========================================================================

  /**
   * Toggles Shuffle on/off.
   */
  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    btnShuffle.classList.toggle('is-active', state.isShuffle);
    btnShuffle.setAttribute('aria-pressed', state.isShuffle.toString());
    btnShuffle.setAttribute('title', `Shuffle: ${state.isShuffle ? 'On' : 'Off'}`);
    if (statusShuffleTag) {
      statusShuffleTag.textContent = `Shuffle: ${state.isShuffle ? 'On' : 'Off'}`;
    }
  }

  /**
   * Cycles Repeat Mode: 'all' -> 'one' -> 'off' -> 'all'.
   */
  function cycleRepeatMode() {
    if (state.repeatMode === 'all') {
      state.repeatMode = 'one';
      btnRepeat.classList.add('is-active', 'repeat-one');
      repeatIndicator.textContent = '1';
      btnRepeat.setAttribute('title', 'Repeat: Track (One)');
      if (statusModeTag) statusModeTag.textContent = 'Repeat: One';
    } else if (state.repeatMode === 'one') {
      state.repeatMode = 'off';
      btnRepeat.classList.remove('is-active', 'repeat-one');
      btnRepeat.setAttribute('title', 'Repeat: Off');
      if (statusModeTag) statusModeTag.textContent = 'Repeat: Off';
    } else {
      state.repeatMode = 'all';
      btnRepeat.classList.add('is-active');
      btnRepeat.classList.remove('repeat-one');
      btnRepeat.setAttribute('title', 'Repeat: All Tracks');
      if (statusModeTag) statusModeTag.textContent = 'Repeat: All';
    }
    btnRepeat.setAttribute('aria-label', `Repeat mode: ${state.repeatMode}`);
  }

  // =========================================================================
  // 9. Playlist Rendering & Interaction
  // =========================================================================

  /**
   * Renders the playlist list items to the DOM.
   */
  function renderPlaylist() {
    playlistItemsList.innerHTML = '';
    headerTrackCount.textContent = `${playlist.length} Tracks`;

    playlist.forEach((song, idx) => {
      const li = document.createElement('li');
      li.className = 'playlist-item';
      li.id = `playlist-item-${idx}`;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-label', `Play ${song.title} by ${song.artist}`);

      const formattedIndex = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`;

      li.innerHTML = `
        <span class="track-index">${formattedIndex}</span>
        <div class="track-thumb-wrapper">
          <img class="track-thumb" src="${song.artwork}" alt="" loading="lazy" />
          <div class="equalizer-mini" aria-hidden="true">
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
          </div>
        </div>
        <div class="track-meta-col">
          <p class="playlist-song-title">${song.title}${song.isUploaded ? '<span class="track-uploaded-badge">NEW</span>' : ''}</p>
          <p class="playlist-song-artist">${song.artist}</p>
        </div>
        <span class="track-duration-badge">${song.durationText}</span>
      `;

      // Click to play
      li.addEventListener('click', () => {
        if (state.currentIndex === idx && state.isPlaying) {
          pauseAudio();
        } else {
          loadSong(idx, true);
        }
      });

      // Keyboard selection (Enter or Space)
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadSong(idx, true);
        }
      });

      playlistItemsList.appendChild(li);
    });

    updatePlaylistActiveItem();
  }

  /**
   * Highlights the active track item and manages playing state equalizer.
   */
  function updatePlaylistActiveItem() {
    const items = playlistItemsList.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
      const isActive = idx === state.currentIndex;
      item.classList.toggle('is-active', isActive);
      item.classList.toggle('is-playing', isActive && state.isPlaying);
      item.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  // =========================================================================
  // 10. Error Handling & Recovery
  // =========================================================================

  function showError(msg) {
    errorMessage.textContent = msg || 'Audio file could not be loaded.';
    audioErrorBanner.classList.remove('hidden');
  }

  function hideError() {
    audioErrorBanner.classList.add('hidden');
  }

  // =========================================================================
  // 11. Keyboard Shortcuts & Global Handlers
  // =========================================================================

  function setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            nextSong();
          } else {
            // Seek forward 5s
            if (audio.duration) {
              audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            }
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            prevSong();
          } else {
            // Seek backward 5s
            audio.currentTime = Math.max(0, audio.currentTime - 5);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          updateVolume(Math.min(100, Math.round(state.volume * 100) + 5));
          break;

        case 'ArrowDown':
          e.preventDefault();
          updateVolume(Math.max(0, Math.round(state.volume * 100) - 5));
          break;

        case 'KeyM':
          toggleMute();
          break;

        case 'KeyS':
          toggleShuffle();
          break;

        case 'KeyR':
          cycleRepeatMode();
          break;

        case 'Escape':
          shortcutsModal.classList.add('hidden');
          break;
      }
    });
  }

  // =========================================================================
  // 12. Event Listeners Setup
  // =========================================================================

  function bindEvents() {
    // Primary Controls
    btnPlayPause.addEventListener('click', togglePlayPause);
    btnPrev.addEventListener('click', prevSong);
    btnNext.addEventListener('click', () => nextSong(false));
    btnShuffle.addEventListener('click', toggleShuffle);
    btnRepeat.addEventListener('click', cycleRepeatMode);

    // Progress Range Events
    progressBar.addEventListener('input', () => {
      state.isDraggingProgress = true;
      const percent = parseFloat(progressBar.value);
      progressFill.style.width = `${percent}%`;
      if (audio.duration) {
        currentTimeEl.textContent = formatTime((percent / 100) * audio.duration);
      }
    });

    progressBar.addEventListener('change', () => {
      seekAudio();
      state.isDraggingProgress = false;
    });

    // Progress Bar Hover Preview
    progressContainer.addEventListener('mousemove', onProgressMouseMove);
    progressContainer.addEventListener('mouseleave', onProgressMouseLeave);

    // Volume Events
    volumeSlider.addEventListener('input', (e) => {
      updateVolume(e.target.value);
    });
    btnMute.addEventListener('click', toggleMute);

    // Audio API Lifecycle Events
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        totalDurationEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('timeupdate', onTimeUpdate);

    audio.addEventListener('ended', () => {
      nextSong(true);
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      showError(`Unable to play "${playlist[state.currentIndex].title}". Click to advance.`);
      pauseAudio();
    });

    // Error retry button
    btnErrorRetry.addEventListener('click', () => {
      hideError();
      nextSong(true);
    });

    // Shortcuts Modal (if present)
    if (btnToggleShortcuts && shortcutsModal) {
      btnToggleShortcuts.addEventListener('click', () => {
        shortcutsModal.classList.toggle('hidden');
      });
    }

    if (btnCloseShortcuts && shortcutsModal) {
      btnCloseShortcuts.addEventListener('click', () => {
        shortcutsModal.classList.add('hidden');
      });
    }

    // Theme Preset Switcher (Midnight Aura, Porcelain Studio, Sunset Vibe)
    const themeButtons = document.querySelectorAll('.theme-pill');
    themeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedTheme = btn.getAttribute('data-theme-set');
        setAppTheme(selectedTheme);
      });
    });

    // Favorite / Heart Toggle
    const btnFavorite = document.getElementById('btn-favorite');
    if (btnFavorite) {
      btnFavorite.addEventListener('click', () => {
        btnFavorite.classList.toggle('is-favorited');
      });
    }

    // Search filter for playlist
    const searchInput = document.getElementById('playlist-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = playlistItemsList.querySelectorAll('.playlist-item');
        items.forEach((item, idx) => {
          const song = playlist[idx];
          const match = song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query);
          item.style.display = match ? 'flex' : 'none';
        });
      });
    }

    // Top action buttons (Back)
    const btnBack = document.getElementById('btn-back-action');
    if (btnBack) {
      btnBack.addEventListener('click', prevSong);
    }

    // Curated discovery cards (Top 10 Classical & Piano Ragtime)
    const curatedCards = document.querySelectorAll('.curated-card');
    curatedCards.forEach((card, i) => {
      card.addEventListener('click', () => {
        const targetIndex = i === 0 ? 0 : 1;
        loadSong(targetIndex, true);
      });
    });

    // Quick action buttons
    const btnDownload = document.getElementById('btn-download-action');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        badgeText.textContent = 'Acoustic HD';
        setTimeout(() => {
          badgeText.textContent = state.isPlaying ? 'Playing' : 'Paused';
        }, 1500);
      });
    }
    const btnShare = document.getElementById('btn-share-action');
    if (btnShare) {
      btnShare.addEventListener('click', () => {
        badgeText.textContent = 'Link Copied';
        setTimeout(() => {
          badgeText.textContent = state.isPlaying ? 'Playing' : 'Paused';
        }, 1500);
      });
    }
  }

  /**
   * Switches theme between midnight, porcelain, and sunset
   * @param {string} themeName 
   */
  function setAppTheme(themeName) {
    if (!['midnight', 'porcelain', 'sunset'].includes(themeName)) {
      themeName = 'midnight';
    }
    document.documentElement.setAttribute('data-theme', themeName);
    const themeButtons = document.querySelectorAll('.theme-pill');
    themeButtons.forEach((btn) => {
      if (btn.getAttribute('data-theme-set') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    try {
      localStorage.setItem('vibetunes_theme', themeName);
    } catch (e) {
      // Ignore private browsing storage restriction
    }
  }

  // =========================================================================
  // 13. Upload Music Feature
  // =========================================================================

  /**
   * Shows a toast notification with a message, then auto-hides after a delay.
   * @param {string} message
   */
  function showUploadToast(message) {
    const toast = document.getElementById('upload-toast');
    const toastMsg = document.getElementById('upload-toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    // Auto-hide after 2.8 seconds
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  /**
   * Formats a raw filename into a readable track title.
   * E.g. "my_favourite-song.mp3" => "My Favourite Song"
   * @param {string} filename
   * @returns {string}
   */
  function fileNameToTitle(filename) {
    return filename
      .replace(/\.[^/.]+$/, '')         // Remove file extension
      .replace(/[_\-]+/g, ' ')          // Replace underscores/hyphens with spaces
      .replace(/\s+/g, ' ')             // Collapse multiple spaces
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
  }

  /**
   * Handles uploaded audio files: creates blob URLs, adds songs to playlist,
   * re-renders the list, and shows a toast confirmation.
   * @param {FileList} files
   */
  function handleUploadedFiles(files) {
    if (!files || files.length === 0) return;

    let addedCount = 0;
    const nextId = playlist.length + 1;

    Array.from(files).forEach((file, i) => {
      // Only accept audio files
      if (!file.type.startsWith('audio/')) return;

      const blobUrl = URL.createObjectURL(file);
      const title = fileNameToTitle(file.name);

      playlist.push({
        id: nextId + i,
        title: title,
        artist: 'Unknown Artist',
        album: 'Uploaded',
        audio: blobUrl,
        artwork: 'assets/images/cover1.jpg', // Default artwork
        durationText: '--:--',
        isUploaded: true // Flag to show "NEW" badge
      });

      addedCount++;
    });

    if (addedCount === 0) {
      showUploadToast('No valid audio files were selected.');
      return;
    }

    // Re-render with updated playlist
    renderPlaylist();

    // Show confirmation toast
    const msg = addedCount === 1
      ? `"${playlist[playlist.length - addedCount].title}" added to playlist!`
      : `${addedCount} tracks added to playlist!`;
    showUploadToast(msg);
  }

  /**
   * Wires up the "Upload Music" button to open the file picker,
   * and processes selected files on change.
   */
  function setupUploadMusic() {
    const btnUpload = document.getElementById('btn-upload-music');
    const fileInput = document.getElementById('upload-music-input');
    if (!btnUpload || !fileInput) return;

    // Clicking the styled button triggers the hidden file input
    btnUpload.addEventListener('click', () => {
      fileInput.value = ''; // Allow re-selecting the same file
      fileInput.click();
    });

    // Handle files once user picks them
    fileInput.addEventListener('change', (e) => {
      handleUploadedFiles(e.target.files);
    });

    // Also support drag & drop on the playlist panel
    const playlistPanel = document.getElementById('playlist-panel');
    if (playlistPanel) {
      playlistPanel.addEventListener('dragover', (e) => {
        e.preventDefault();
        playlistPanel.classList.add('drag-over');
      });

      playlistPanel.addEventListener('dragleave', () => {
        playlistPanel.classList.remove('drag-over');
      });

      playlistPanel.addEventListener('drop', (e) => {
        e.preventDefault();
        playlistPanel.classList.remove('drag-over');
        handleUploadedFiles(e.dataTransfer.files);
      });
    }
  }

  // =========================================================================
  // 14. Initialization Entrypoint
  // =========================================================================
  function init() {
    // Restore user theme preference if previously saved
    try {
      const savedTheme = localStorage.getItem('vibetunes_theme');
      if (savedTheme) {
        setAppTheme(savedTheme);
      }
    } catch (e) {
      // Ignore storage errors
    }

    renderPlaylist();
    bindEvents();
    setupKeyboardControls();
    setupUploadMusic();

    // Default Repeat Mode UI setup (Default: 'all')
    btnRepeat.classList.add('is-active');
    btnRepeat.setAttribute('title', 'Repeat: All Tracks');
    if (statusModeTag) {
      statusModeTag.textContent = 'Repeat: All';
    }

    // Set initial volume
    updateVolume(80);

    // Load initial track without autoplay
    loadSong(0, false);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
