const STORAGE_KEY = "christmasCalendarState";
const TOTAL_DOORS = 24;
const grid = document.querySelector("#calendar-grid");
const openCount = document.querySelector("#open-count");
const notice = document.querySelector("#notice");
const modal = document.querySelector("#content-modal");
const modalDay = document.querySelector("#modal-day");
const modalTitle = document.querySelector("#modal-title");
const modalContent = document.querySelector("#modal-content");
const closeModalButton = document.querySelector("#modal-close");
const sceneDoorFace = document.querySelector("#scene-door-face");
const sceneDoorNumber = document.querySelector("#scene-door-number");
const sceneReturnButton = document.querySelector("#scene-return");
const resetButton = document.querySelector("#reset-calendar");

let calendarDoors = [];
let calendarState = { openedDoors: [] };
let lastFocusedDoor = null;
let closeTimer = null;

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

function clearNotice() {
  notice.textContent = "";
  notice.hidden = true;
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
    if (savedState === null) {
      return { openedDoors: [] };
    }

    const parsedState = JSON.parse(savedState);
    return { openedDoors: normalizeOpenedDoors(parsedState.openedDoors) };
  } catch (error) {
    console.error("Could not load calendar state from localStorage.", error);
    showNotice("Your saved calendar progress could not be read. You can still use the calendar in this tab; resetting it will clear the saved entry.");
    return { openedDoors: [] };
  }
}

function saveCalendarState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendarState));
    clearNotice();
    return true;
  } catch (error) {
    console.error("Could not save calendar state to localStorage.", error);
    showNotice("Your browser could not save calendar progress. Opened doors may not remain open after you leave this page.");
    return false;
  }
}

function isDoorOpened(day) {
  return calendarState.openedDoors.includes(day);
}

function getDoorState(day) {
  if (isDoorOpened(day)) {
    return "opened";
  }

  return "available";
}

function markDoorOpened(day) {
  if (!isDoorOpened(day)) {
    calendarState.openedDoors.push(day);
    calendarState.openedDoors.sort((a, b) => a - b);
    saveCalendarState();
  }
}

function createDoorButton(day) {
  const button = document.createElement("button");
  button.className = "door";
  button.type = "button";
  button.dataset.day = String(day);

  const reveal = document.createElement("span");
  reveal.className = "door-reveal";
  reveal.setAttribute("aria-hidden", "true");
  reveal.textContent = "\u2726";

  const face = document.createElement("span");
  face.className = "door-face";

  const number = document.createElement("span");
  number.className = "door-number";
  number.textContent = String(day);

  const hint = document.createElement("span");
  hint.className = "door-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.textContent = "Open me";

  face.append(number, hint);
  button.append(reveal, face);
  button.addEventListener("click", () => handleDoorClick(day, button));
  return button;
}

function renderCalendar() {
  grid.replaceChildren();

  for (let day = 1; day <= TOTAL_DOORS; day += 1) {
    grid.append(createDoorButton(day));
  }

  updateDoorStates();
}

function updateDoorStates() {
  const doorButtons = grid.querySelectorAll(".door");
  let openedCount = 0;

  doorButtons.forEach((button) => {
    const day = Number(button.dataset.day);
    const state = getDoorState(day);
    const isOpened = state === "opened";
    button.dataset.state = state;
    button.disabled = state === "locked";
    button.setAttribute("aria-label", `Day ${day}, ${state}`);
    button.querySelector(".door-hint").textContent = isOpened ? "Opened" : state === "locked" ? "Locked" : "Open me";
    button.querySelector(".door-number").setAttribute("aria-hidden", "true");
    if (isOpened) {
      openedCount += 1;
    }
  });

  openCount.textContent = `${openedCount} of ${TOTAL_DOORS} opened`;
}

function isSafeUrl(value, allowExternal = false) {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  if (value.startsWith("#") || value.startsWith("./") || value.startsWith("../")) {
    return true;
  }

  try {
    const url = new URL(value, window.location.href);
    return url.origin === window.location.origin || (allowExternal && url.protocol === "https:");
  } catch {
    return false;
  }
}

function addText(parent, text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = typeof text === "string" ? text : "";
  parent.append(paragraph);
}

function addLink(parent, href, label, download = false) {
  if (!isSafeUrl(href, true)) {
    addText(parent, "This item has an invalid or unsupported link.");
    return;
  }

  const link = document.createElement("a");
  link.className = "content-link";
  link.href = href;
  link.textContent = label || (download ? "Download file" : "Open link");
  if (download) {
    link.download = "";
  } else {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  parent.append(link);
}

function renderDoorContent(door) {
  modalContent.replaceChildren();

  switch (door.type) {
    case "message":
      addText(modalContent, door.content);
      break;
    case "image": {
      if (typeof door.src !== "string" || !isSafeUrl(door.src)) {
        addText(modalContent, "This image has an invalid or unsupported path.");
        break;
      }

      const image = document.createElement("img");
      image.src = door.src;
      image.alt = door.alt || "";
      modalContent.append(image);
      if (door.content) {
        addText(modalContent, door.content);
      }
      break;
    }
    case "download":
      addText(modalContent, door.content);
      addLink(modalContent, door.href, door.label || "Download file", true);
      break;
    case "link":
      addText(modalContent, door.content);
      addLink(modalContent, door.href, door.label);
      break;
    case "embed":
      if (!isSafeUrl(door.src, true)) {
        addText(modalContent, "This embedded item has an invalid or unsupported link.");
        break;
      }
      modalContent.append(createFrame(door.src, door.title || "Embedded content"));
      break;
    case "game":
    case "page":
      if (!isSafeUrl(door.src)) {
        addText(modalContent, "This custom page has an invalid or unsupported path.");
        break;
      }
      modalContent.append(createFrame(door.src, door.title || "Door activity"));
      break;
    default:
      addText(modalContent, "There is a little surprise coming soon.");
  }
}

function createFrame(src, title) {
  const frame = document.createElement("iframe");
  frame.src = src;
  frame.title = title;
  frame.loading = "lazy";
  frame.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  return frame;
}

function openDoorContent(day, button) {
  const door = calendarDoors.find((item) => item.day === day);
  if (!door) {
    showNotice(`Content for day ${day} could not be found.`);
    return;
  }

  const bounds = button.getBoundingClientRect();
  modal.style.setProperty("--zoom-origin-x", `${bounds.left + bounds.width / 2}px`);
  modal.style.setProperty("--zoom-origin-y", `${bounds.top + bounds.height / 2}px`);
  modalDay.textContent = `December ${day}`;
  modalTitle.textContent = door.title;
  sceneDoorNumber.textContent = String(day);
  renderDoorContent(door);
  modal.classList.remove("is-closing", "is-open");
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
  modal.showModal();
  window.requestAnimationFrame(() => modal.classList.add("is-open"));
  closeModalButton.focus();
}

function handleDoorClick(day, button) {
  const state = getDoorState(day);
  if (state === "locked") {
    return;
  }

  lastFocusedDoor = button;
  if (state === "available") {
    markDoorOpened(day);
    updateDoorStates();
  }

  openDoorContent(day, button);
}

function closeModal() {
  if (!modal.open || modal.classList.contains("is-closing")) {
    return;
  }

  modal.classList.remove("is-open");
  modal.classList.add("is-closing");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 560;
  closeTimer = window.setTimeout(() => {
    if (modal.open) {
      modal.close();
    }
    closeTimer = null;
  }, delay);
}

function resetCalendar() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    calendarState = { openedDoors: [] };
    clearNotice();
  } catch (error) {
    console.error("Could not clear calendar state from localStorage.", error);
    showNotice("The saved calendar progress could not be cleared. Check your browser's storage settings and try again.");
    return;
  }

  updateDoorStates();
  closeModal();
}

function validateCalendarData(data) {
  if (!Array.isArray(data) || data.length !== TOTAL_DOORS) {
    throw new TypeError(`calendar.json must contain exactly ${TOTAL_DOORS} doors.`);
  }

  const days = new Set();
  data.forEach((door) => {
    if (!door || !Number.isInteger(door.day) || door.day < 1 || door.day > TOTAL_DOORS || typeof door.title !== "string" || typeof door.type !== "string") {
      throw new TypeError("Each calendar door needs a valid day, title, and type.");
    }
    if (days.has(door.day)) {
      throw new TypeError(`calendar.json contains day ${door.day} more than once.`);
    }
    days.add(door.day);
  });

  return [...data].sort((a, b) => a.day - b.day);
}

async function initializeCalendar() {
  calendarState = loadCalendarState();
  updateDoorStates();

  try {
    const response = await fetch("calendar.json");
    if (!response.ok) {
      throw new Error(`calendar.json request failed with status ${response.status}.`);
    }
    calendarDoors = validateCalendarData(await response.json());
    renderCalendar();
  } catch (error) {
    console.error("Could not initialize the Christmas calendar.", error);
    showNotice("The calendar content could not be loaded. Make sure calendar.json is available beside index.html and open this site through a web server.");
  }
}

grid.addEventListener("keydown", (event) => {
  const directions = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").length),
    ArrowDown: Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").length)
  };
  const offset = directions[event.key];
  if (offset === undefined) {
    return;
  }

  const buttons = [...grid.querySelectorAll(".door")];
  const currentIndex = buttons.indexOf(document.activeElement);
  if (currentIndex === -1) {
    return;
  }

  event.preventDefault();
  const nextIndex = (currentIndex + offset + buttons.length) % buttons.length;
  buttons[nextIndex].focus();
});

closeModalButton.addEventListener("click", closeModal);
sceneReturnButton.addEventListener("click", closeModal);
sceneDoorFace.addEventListener("click", () => {
  if (modal.classList.contains("is-open")) {
    closeModal();
  }
});
modal.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
  }
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
modal.addEventListener("close", () => {
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
  modal.classList.remove("is-open", "is-closing");
  if (lastFocusedDoor && document.contains(lastFocusedDoor)) {
    lastFocusedDoor.focus();
  }
});
// DEVELOPMENT ONLY: remove this handler with the reset button before production release.
resetButton.addEventListener("click", resetCalendar);

initializeCalendar();
