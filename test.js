// set canvas id to variable
const canvas = document.getElementById("draw");
const clear = document.getElementById("clear");

// get canvas 2D context and set it to the correct size
const ctx = canvas.getContext("2d");
resize();

// resize canvas when window is resized
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

// add event listeners to specify when functions should be triggered
window.addEventListener("resize", () => {
  resize();
  loadCanvas();
});
document.addEventListener("mousemove", draw);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);

// last known position
const pos = { x: 0, y: 0 };

// new position from mouse events
function setPosition(e) {
  pos.x = e.clientX - 65;
  pos.y = e.clientY - 125;
}

function draw(e) {
  if (e.buttons !== 1) return; // if mouse is pressed.....

  const color = document.querySelector(".pcr-result").value;

  ctx.beginPath(); // begin the drawing path

  ctx.lineWidth = 16; // width of line
  ctx.lineCap = "round"; // rounded end cap
  ctx.strokeStyle = color; // hex color of line

  ctx.moveTo(pos.x, pos.y); // from position
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to position

  ctx.stroke(); // draw it!
  saveCanvas();
}

function saveCanvas() {
  localStorage.setItem("myCanvas", canvas.toDataURL());
}

function loadCanvas() {
  const dataURL = localStorage.getItem("myCanvas");
  const img = new Image();

  img.src = dataURL;
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  };
}

function clearCanvas() {
  localStorage.removeItem("myCanvas");
}

loadCanvas();

const pickr = Pickr.create({
  el: ".color-picker",
  theme: "nano",

  swatches: [
    "rgba(244, 67, 54, 1)",
    "rgba(233, 30, 99, 0.95)",
    "rgba(156, 39, 176, 0.9)",
    "rgba(103, 58, 183, 0.85)",
    "rgba(63, 81, 181, 0.8)",
    "rgba(33, 150, 243, 0.75)",
    "rgba(3, 169, 244, 0.7)",
    "rgba(0, 188, 212, 0.7)",
    "rgba(0, 150, 136, 0.75)",
    "rgba(76, 175, 80, 0.8)",
    "rgba(139, 195, 74, 0.85)",
    "rgba(205, 220, 57, 0.9)",
    "rgba(255, 235, 59, 0.95)",
    "rgba(255, 193, 7, 1)"
  ],

  components: {
    // Main components
    preview: true,
    opacity: true,
    hue: true,

    // Input / output Options
    interaction: {
      hex: true,
      rgba: true,
      hsla: true,
      hsva: true,
      cmyk: true,
      input: true,
      clear: true,
      save: true
    }
  }
});

clear.addEventListener("click", e => {
  localStorage.setItem("myCanvas", null);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
