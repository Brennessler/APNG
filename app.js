const STORAGE_KEY = "christmasCalendarState";
const TOTAL_DOORS = 24;
const MVP_TEST_MODE = true;
const STATES = Object.freeze({
  SHELF: "SHELF",
  CASE_ZOOMING: "CASE_ZOOMING",
  CASE_OPENING: "CASE_OPENING",
  MEDIA_REMOVING: "MEDIA_REMOVING",
  DEVICE_LOADING: "DEVICE_LOADING",
  CONTENT_PLAYING: "CONTENT_PLAYING",
  CLOSING: "CLOSING"
});

// Shelf centers are percentages of the 3:2 background; adjust all 24 cases here.
const SHELF_POSITIONS = [
  [21.3, 30.0], [30.2, 30.0], [39.1, 30.0], [48.0, 30.0], [56.9, 30.0], [65.8, 30.0],
  [21.3, 46.0], [30.2, 46.0], [39.1, 46.0], [48.0, 46.0], [56.9, 46.0], [65.8, 46.0],
  [21.3, 62.0], [30.2, 62.0], [39.1, 62.0], [48.0, 62.0], [56.9, 62.0], [65.8, 62.0],
  [21.3, 78.0], [30.2, 78.0], [39.1, 78.0], [48.0, 78.0], [56.9, 78.0], [65.8, 78.0]
];

const grid = document.querySelector("#calendar-grid");
const openCount = document.querySelector("#open-count");
const notice = document.querySelector("#notice");
const experience = document.querySelector("#experience");
const experienceClose = document.querySelector("#experience-close");
const experienceStatus = document.querySelector("#experience-status");
const caseAnimation = document.querySelector("#case-animation");
const caseBack = document.querySelector(".case-back");
const caseFront = document.querySelector("#case-front");
const caseCover = document.querySelector("#case-cover");
const caseMedia = document.querySelector("#case-media");
const deviceView = document.querySelector("#device-view");
const deviceTitle = document.querySelector("#device-title");
const tvStack = document.querySelector("#tv-stack");
const tvOff = document.querySelector("#tv-off");
const tvFrame = document.querySelector("#tv-frame");
const tvGlass = document.querySelector("#tv-glass");
const screenVideo = document.querySelector("#screen-video");
const screenImage = document.querySelector("#screen-image");
const staticAudio = document.querySelector("#static-audio");
const deviceEquipment = document.querySelector("#device-equipment");
const radioView = document.querySelector("#radio-view");
const radioSet = document.querySelector("#radio-set");
const radioImage = document.querySelector("#radio-image");
const radioCassette = document.querySelector("#radio-cassette");
const audioPlayer = document.querySelector("#audio-player");
const audioToggle = document.querySelector("#audio-toggle");
const audioTitle = document.querySelector("#audio-title");
const resetButton = document.querySelector("#reset-calendar");

let calendarDoors = [];
let calendarState = { openedDoors: [] };
let currentState = STATES.SHELF;
let currentDoor = null;
let lastFocusedDoor = null;
const timers = new Map();
const pendingMediaCancels = new Set();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
staticAudio.volume = 0.5;

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

function clearNotice() {
  notice.textContent = "";
  notice.hidden = true;
}

function showStatus(message) {
  experienceStatus.textContent = message;
  experienceStatus.hidden = message === "";
}

function normalizeOpenedDoors(value) {
  if (!Array.isArray(value)) {
    throw new TypeError("Calendar state must contain an openedDoors array.");
  }
  return [...new Set(value.filter((day) => Number.isInteger(day) && day >= 1 && day <= TOTAL_DOORS))];
}

function loadCalendarState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState === null) return { openedDoors: [] };
    const parsedState = JSON.parse(savedState);
    return { openedDoors: normalizeOpenedDoors(parsedState.openedDoors) };
  } catch (error) {
    console.error("Could not load calendar state from localStorage.", error);
    showNotice("Saved progress could not be read. You can still use the calendar in this tab.");
    return { openedDoors: [] };
  }
}

function saveCalendarState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendarState));
    clearNotice();
  } catch (error) {
    console.error("Could not save calendar state to localStorage.", error);
    showNotice("Progress could not be saved in this browser.");
  }
}

function isDoorOpened(day) {
  return calendarState.openedDoors.includes(day);
}

function isDateAvailable(day) {
  if (MVP_TEST_MODE) return true;
  const today = new Date();
  return today.getMonth() === 11 && day <= today.getDate();
}

function getDoorState(day) {
  if (isDoorOpened(day)) return "opened";
  return isDateAvailable(day) ? "available" : "locked";
}

function markDoorOpened(day) {
  if (!isDoorOpened(day)) {
    calendarState.openedDoors.push(day);
    calendarState.openedDoors.sort((a, b) => a - b);
    saveCalendarState();
  }
}

function createDoorButton(door, index) {
  const [x, y] = SHELF_POSITIONS[index];
  const button = document.createElement("button");
  button.className = "shelf-case";
  button.type = "button";
  button.dataset.day = String(door.day);
  button.style.setProperty("--case-x", `${x}%`);
  button.style.setProperty("--case-y", `${y}%`);
  button.setAttribute("aria-label", `Door ${door.day}: ${door.title}. ${getDoorState(door.day)}.`);

  const image = document.createElement("img");
  image.src = door.cover;
  image.alt = "";
  image.draggable = false;
  image.decoding = "async";
  button.append(image);
  button.addEventListener("click", () => openDoor(door, button));
  return button;
}

function renderCalendar() {
  grid.replaceChildren();
  calendarDoors.forEach((door, index) => grid.append(createDoorButton(door, index)));
  updateDoorStates();
}

function updateDoorStates() {
  let openedCount = 0;
  grid.querySelectorAll(".shelf-case").forEach((button) => {
    const day = Number(button.dataset.day);
    const state = getDoorState(day);
    button.dataset.state = state;
    button.disabled = state === "locked";
    const door = calendarDoors.find((item) => item.day === day);
    button.setAttribute("aria-label", `Door ${day}: ${door.title}. ${state}.`);
    if (state === "opened") openedCount += 1;
  });
  openCount.textContent = `${openedCount} of ${TOTAL_DOORS} opened`;
}

function addTimer(callback, duration) {
  const timer = window.setTimeout(() => {
    timers.delete(timer);
    callback();
  }, duration);
  timers.set(timer, null);
  return timer;
}

function wait(duration) {
  return new Promise((resolve) => {
    const timer = addTimer(() => resolve(), duration);
    timers.set(timer, resolve);
  });
}

function clearTimers() {
  timers.forEach((resolve, timer) => {
    window.clearTimeout(timer);
    if (resolve) resolve();
  });
  timers.clear();
}

function cancelPendingMedia() {
  [...pendingMediaCancels].forEach((cancel) => cancel());
  pendingMediaCancels.clear();
}

function waitForMedia(media, path, readyEvent = "loadeddata") {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      media.removeEventListener(readyEvent, onReady);
      media.removeEventListener("error", onError);
      pendingMediaCancels.delete(onCancel);
      window.clearTimeout(timeout);
      timers.delete(timeout);
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const onReady = () => finish();
    const onError = () => finish(new Error(`The browser could not load ${path}.`));
    const onCancel = () => finish(new Error("Playback was cancelled."));
    media.addEventListener(readyEvent, onReady, { once: true });
    media.addEventListener("error", onError, { once: true });
    pendingMediaCancels.add(onCancel);
    const timeout = window.setTimeout(() => finish(new Error(`Loading ${path} timed out.`)), 15000);
    timers.set(timeout, null);
    if (media.readyState >= (readyEvent === "canplay" ? 3 : 2)) finish();
  });
}

function waitForImage(image, path) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timeout;
    const cleanup = () => {
      image.removeEventListener("load", onReady);
      image.removeEventListener("error", onError);
      pendingMediaCancels.delete(onCancel);
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        timers.delete(timeout);
      }
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const onReady = () => finish();
    const onError = () => finish(new Error(`The browser could not load ${path}.`));
    const onCancel = () => finish(new Error("Image loading was cancelled."));
    image.addEventListener("load", onReady, { once: true });
    image.addEventListener("error", onError, { once: true });
    pendingMediaCancels.add(onCancel);
    timeout = window.setTimeout(() => finish(new Error(`Loading ${path} timed out.`)), 15000);
    timers.set(timeout, null);
    image.src = path;
    if (image.complete && image.naturalWidth > 0) finish();
  });
}

function pauseAndReset(media) {
  media.pause();
  try {
    media.currentTime = 0;
  } catch (error) {
    if (error.name !== "InvalidStateError") console.error("Could not reset media playback.", error);
  }
}

function clearPlayback() {
  [screenVideo, audioPlayer, staticAudio].forEach((media) => {
    pauseAndReset(media);
    media.removeAttribute("src");
    media.load();
  });
  screenVideo.hidden = true;
  screenVideo.controls = false;
  screenImage.hidden = true;
  screenImage.removeAttribute("src");
  screenImage.onerror = null;
  audioToggle.disabled = false;
  audioToggle.textContent = "Pause";
}

function resetView() {
  clearTimers();
  cancelPendingMedia();
  clearPlayback();
  currentDoor = null;
  experience.classList.remove("is-closing", "is-case-open", "is-media-removing");
  caseFront.classList.remove("is-open");
  caseAnimation.hidden = false;
  caseAnimation.removeAttribute("style");
  caseCover.removeAttribute("src");
  caseMedia.removeAttribute("src");
  deviceView.hidden = true;
  deviceView.classList.remove("is-visible");
  tvStack.hidden = true;
  radioView.hidden = true;
  tvOff.hidden = false;
  radioSet.classList.remove("is-inserting", "is-playing");
  radioImage.removeAttribute("src");
  radioCassette.removeAttribute("src");
  tvOff.removeAttribute("src");
  tvFrame.removeAttribute("src");
  tvGlass.removeAttribute("src");
  deviceEquipment.removeAttribute("src");
  showStatus("");
}

function getCenteredCaseSize() {
  const width = Math.min(300, Math.max(190, window.innerWidth * 0.27));
  return { width, height: width * 1.5 };
}

// The shared case moves through zoom, hinged-front opening, and media-removal states.
async function openDoor(door, button) {
  if (currentState !== STATES.SHELF || (!MVP_TEST_MODE && !isDateAvailable(door.day))) return;
  currentState = STATES.CASE_ZOOMING;
  currentDoor = door;
  lastFocusedDoor = button;
  markDoorOpened(door.day);
  updateDoorStates();

  const bounds = button.getBoundingClientRect();
  const size = getCenteredCaseSize();
  caseAnimation.style.left = `${bounds.left}px`;
  caseAnimation.style.top = `${bounds.top}px`;
  caseAnimation.style.width = `${bounds.width}px`;
  caseAnimation.style.height = `${bounds.height}px`;
  caseBack.src = caseBack.dataset.src;
  caseCover.src = door.cover;
  caseMedia.src = door.mediaType === "vhs" ? "assets/tapes/VHS.png" :
    door.mediaType === "cassette" ? "assets/tapes/cassette.png" : "assets/tapes/cartridge.png";
  caseMedia.className = `case-media media-${door.mediaType}`;
  caseMedia.alt = `${door.mediaType} for door ${door.day}`;
  deviceTitle.textContent = door.title;
  audioTitle.textContent = `Lucka ${door.day} — ${door.title}`;

  experience.hidden = false;
  experience.setAttribute("aria-hidden", "false");
  document.body.classList.add("experience-open");
  experienceClose.focus();
  showStatus("");

  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  if (currentState !== STATES.CASE_ZOOMING) return;
  caseAnimation.style.left = `${(window.innerWidth - size.width) / 2}px`;
  caseAnimation.style.top = `${(window.innerHeight - size.height) / 2}px`;
  caseAnimation.style.width = `${size.width}px`;
  caseAnimation.style.height = `${size.height}px`;
  await wait(reducedMotion.matches ? 50 : 560);
  if (currentState !== STATES.CASE_ZOOMING) return;

  currentState = STATES.CASE_OPENING;
  experience.classList.add("is-case-open");
  caseFront.classList.add("is-open");
  await wait(reducedMotion.matches ? 60 : 650);
  if (currentState !== STATES.CASE_OPENING) return;

  currentState = STATES.MEDIA_REMOVING;
  experience.classList.add("is-media-removing");
  await wait(reducedMotion.matches ? 60 : 650);
  if (currentState !== STATES.MEDIA_REMOVING) return;
  caseAnimation.hidden = true;
  await presentDestination(door);
}

async function presentDestination(door) {
  currentState = STATES.DEVICE_LOADING;
  deviceView.hidden = false;
  deviceView.classList.add("is-visible");
  showStatus(`Preparing door ${door.day}…`);

  try {
    if (door.destinationView === "radio") await playRadio(door);
    else await playTelevision(door);
    if (currentState === STATES.DEVICE_LOADING) currentState = STATES.CONTENT_PLAYING;
  } catch (error) {
    if (currentState !== STATES.CLOSING) {
      console.error(`Could not prepare content for door ${door.day}.`, error);
      showStatus(`Door ${door.day}: could not load ${door.source}. ${error.message}`);
      currentState = STATES.CONTENT_PLAYING;
    }
  }
}

function stopStaticAudio() {
  pauseAndReset(staticAudio);
}

async function playStaticSegment(door, duration) {
  const staticVideoPath = "assets/TV/static.mp4";
  const staticAudioPath = "assets/sound/static.mp3";
  stopStaticAudio();
  staticAudio.removeAttribute("src");
  staticAudio.load();
  staticAudio.src = staticAudioPath;
  staticAudio.load();

  screenVideo.hidden = false;
  screenVideo.controls = false;
  screenVideo.src = staticVideoPath;
  screenVideo.load();
  await waitForMedia(screenVideo, staticVideoPath);
  if (currentState !== STATES.DEVICE_LOADING) return false;

  const visualPlayback = screenVideo.play();
  staticAudio.play().catch((error) => {
    console.warn(`Static audio could not play for door ${door.day}; continuing with visual static.`, error);
    if (currentState === STATES.DEVICE_LOADING) {
      showStatus("Static audio is unavailable; continuing with visual static.");
    }
  });
  try {
    await visualPlayback;
  } catch (error) {
    stopStaticAudio();
    throw error;
  }

  await wait(duration);
  stopStaticAudio();
  screenVideo.pause();
  screenVideo.currentTime = 0;
  screenVideo.removeAttribute("src");
  screenVideo.load();
  screenVideo.hidden = true;
  return currentState === STATES.DEVICE_LOADING;
}

// Both VCR and NES use the same off → static → test card startup sequence.
async function playTvStartup(door) {
  screenVideo.hidden = true;
  screenImage.hidden = true;
  tvOff.hidden = false;
  showStatus(`Powering on the television for door ${door.day}…`);
  await Promise.all([
    waitForImage(tvOff, tvOff.dataset.src),
    waitForImage(tvFrame, tvFrame.dataset.src),
    waitForImage(tvGlass, tvGlass.dataset.src)
  ]);
  if (currentState !== STATES.DEVICE_LOADING) return false;
  await wait(reducedMotion.matches ? 40 : 320);
  if (currentState !== STATES.DEVICE_LOADING) return false;

  tvOff.hidden = true;
  showStatus(`Tuning in door ${door.day}…`);
  const staticFinished = await playStaticSegment(door, reducedMotion.matches ? 80 : 650);
  if (!staticFinished || currentState !== STATES.DEVICE_LOADING) return false;

  showStatus(`Displaying the test card for door ${door.day}…`);
  screenImage.hidden = false;
  await waitForImage(screenImage, "assets/TV/testbild.png");
  if (currentState !== STATES.DEVICE_LOADING) return false;
  await wait(reducedMotion.matches ? 100 : 950);
  if (currentState !== STATES.DEVICE_LOADING) return false;
  screenImage.hidden = true;
  screenImage.removeAttribute("src");
  return true;
}

// TV content uses the same clipped CRT and layered frame/glass for VHS and NES.
async function playTelevision(door) {
  radioView.hidden = true;
  tvStack.hidden = false;
  deviceEquipment.src = door.destinationView === "vcr" ? "assets/TV/VCR.png" : "assets/TV/NES.png";
  deviceEquipment.alt = door.destinationView === "vcr" ? "VHS video cassette recorder" : "Nintendo Entertainment System";
  const startupFinished = await playTvStartup(door);
  if (!startupFinished || currentState !== STATES.DEVICE_LOADING) return;

  showStatus(`Loading door ${door.day}…`);
  if (door.contentType === "image") {
    await waitForImage(screenImage, door.source);
    if (currentState !== STATES.DEVICE_LOADING) return;
    screenImage.hidden = false;
  } else {
    screenVideo.src = door.source;
    screenVideo.controls = true;
    screenVideo.hidden = false;
    screenVideo.load();
    await waitForMedia(screenVideo, door.source);
    if (currentState !== STATES.DEVICE_LOADING) return;
    await screenVideo.play();
  }
  showStatus("");
}

// Radio/audio starts only after the cassette reaches the stereo compartment.
async function playRadio(door) {
  tvStack.hidden = true;
  radioView.hidden = false;
  radioImage.src = radioImage.dataset.idleSrc;
  radioCassette.src = radioCassette.dataset.src;
  radioSet.classList.add("is-inserting");
  audioPlayer.src = door.source;
  audioPlayer.load();
  showStatus(`Loading audio for door ${door.day}…`);
  await wait(reducedMotion.matches ? 50 : 650);
  if (currentState !== STATES.DEVICE_LOADING) return;

  radioSet.classList.remove("is-inserting");
  radioSet.classList.add("is-playing");
  radioImage.src = radioImage.dataset.playingSrc;
  await waitForMedia(audioPlayer, door.source, "canplay");
  if (currentState !== STATES.DEVICE_LOADING) return;
  await audioPlayer.play();
  audioToggle.textContent = "Pause";
  showStatus("");
}

async function closeExperience() {
  if (currentState === STATES.SHELF || currentState === STATES.CLOSING) return;
  currentState = STATES.CLOSING;
  clearTimers();
  cancelPendingMedia();
  clearPlayback();
  experience.classList.add("is-closing");
  await wait(reducedMotion.matches ? 0 : 280);
  resetView();
  experience.hidden = true;
  experience.setAttribute("aria-hidden", "true");
  document.body.classList.remove("experience-open");
  currentState = STATES.SHELF;
  if (lastFocusedDoor && document.contains(lastFocusedDoor)) lastFocusedDoor.focus();
}

function resetCalendar() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    calendarState = { openedDoors: [] };
    clearNotice();
  } catch (error) {
    console.error("Could not clear calendar state from localStorage.", error);
    showNotice("Saved progress could not be cleared. Check this browser's storage settings.");
    return;
  }
  updateDoorStates();
  if (currentState !== STATES.SHELF) closeExperience();
}

function validateCalendarData(data) {
  if (!Array.isArray(data) || data.length !== TOTAL_DOORS) {
    throw new TypeError(`calendar.json must contain exactly ${TOTAL_DOORS} doors.`);
  }
  const days = new Set();
  data.forEach((door) => {
    if (!door || !Number.isInteger(door.day) || door.day < 1 || door.day > TOTAL_DOORS ||
      typeof door.title !== "string" || typeof door.cover !== "string" ||
      !["vhs", "cassette", "nes"].includes(door.mediaType) ||
      !["video", "image", "audio"].includes(door.contentType) ||
      typeof door.source !== "string" ||
      !["vcr", "radio", "nes"].includes(door.destinationView)) {
      throw new TypeError("Every door needs valid title, cover, media, content, source, and destination data.");
    }
    if (days.has(door.day)) throw new TypeError(`calendar.json contains day ${door.day} more than once.`);
    days.add(door.day);
    const expectedDestination = door.mediaType === "vhs" ? "vcr" : door.mediaType === "cassette" ? "radio" : "nes";
    if (door.destinationView !== expectedDestination) {
      throw new TypeError(`Door ${door.day} has a destination that does not match its media type.`);
    }
  });
  return [...data].sort((a, b) => a.day - b.day);
}

// Calendar data is fetched at runtime so all door behavior stays data-driven.
async function initializeCalendar() {
  calendarState = loadCalendarState();
  try {
    const response = await fetch("calendar.json");
    if (!response.ok) throw new Error(`calendar.json request failed with status ${response.status}.`);
    calendarDoors = validateCalendarData(await response.json());
    renderCalendar();
  } catch (error) {
    console.error("Could not initialize the video-store calendar.", error);
    showNotice("The calendar could not load. Check calendar.json and open this site through a local web server.");
  }
}

audioToggle.addEventListener("click", async () => {
  if (audioPlayer.paused) {
    try {
      await audioPlayer.play();
      audioToggle.textContent = "Pause";
    } catch (error) {
      console.error("Audio playback could not start.", error);
      showStatus(`Door ${currentDoor.day}: audio could not start. Try again with the play button.`);
    }
  } else {
    audioPlayer.pause();
    audioToggle.textContent = "Play";
  }
});

experienceClose.addEventListener("click", closeExperience);
experience.addEventListener("click", (event) => {
  if (event.target === experience) closeExperience();
});
experience.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...experience.querySelectorAll("button:not([disabled]), video[controls]")]
    .filter((element) => !element.closest("[hidden]"));
  if (focusable.length === 0) {
    event.preventDefault();
    experienceClose.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && currentState !== STATES.SHELF) {
    event.preventDefault();
    closeExperience();
  }
});
resetButton.addEventListener("click", resetCalendar);

initializeCalendar();
