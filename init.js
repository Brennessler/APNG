const gamepad = document.getElementById("snake-gamepad");
const gamepadReserve = gamepad.offsetWidth ? gamepad.offsetWidth + 10 : 0;
const initialGameWidth = Math.max(80, window.innerWidth - gamepadReserve);

const mySnakeBoard = new SNAKE.Board({
  boardContainer: "game-area",
  fullScreen: false,
  width: initialGameWidth,
  height: window.innerHeight,
  premoveOnPause: false,
  dialogControls: document.getElementById("snake-dialog-controls"),
});

const gameContainer = mySnakeBoard.getBoardContainer();

function fitGameToViewport() {
  const width = gameContainer.offsetWidth;
  const height = gameContainer.offsetHeight;
  if (!width || !height) return;

  const availableWidth = Math.max(80, window.innerWidth - gamepadReserve);
  const scale = Math.min(availableWidth / width, window.innerHeight / height);
  const left = (availableWidth - width * scale) / 2;
  const top = (window.innerHeight - height * scale) / 2;
  gameContainer.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
}

if ("ResizeObserver" in window) {
  new ResizeObserver(fitGameToViewport).observe(document.documentElement);
} else {
  window.addEventListener("resize", fitGameToViewport);
}
fitGameToViewport();

document.addEventListener("keydown", (event) => {
  const isArrowKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
    event.key,
  );
  const isFormControl =
    event.target instanceof Element &&
    event.target.matches("button, select, input, textarea");
  if (isArrowKey && !isFormControl) {
    event.preventDefault();
  }
}, true);

// Wire up the on-screen gamepad shown on touch devices (markup in index.html).
document.querySelectorAll("#snake-gamepad button").forEach((btn) => {
  btn.addEventListener("pointerdown", (evt) => {
    evt.preventDefault();
    mySnakeBoard.simulateKeyPress(parseInt(btn.dataset.key, 10));
  });
});
