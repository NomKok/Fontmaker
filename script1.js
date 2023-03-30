var previousCanvas = null;
console.log("start");

function addCanvas(letter) {
  console.log(letter);
  // Create a new canvas element

  if (previousCanvas) {
    //previousCanvas.remove();
    previousCanvas.remove();
    function loadCanvas() {
      console.log("load");

      const dataURL = localStorage.getItem(letter);
      const img = new Image();
    
      img.src = dataURL;
      img.onload = function() {
        context.drawImage(img, 0, 0);
      };
    }
    loadCanvas();
  }

  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  canvas.setAttribute("width", "600px");
  canvas.setAttribute("height", "600px");
  canvas.style.position = "center";

  // Add the canvas element to the container div
  var container = document.getElementById("main");
  container.appendChild(canvas);
  previousCanvas = canvas;

  const context = canvas.getContext('2d');
  const svg = SVG().addTo(canvas);

  let isDrawing = false;
  let isErasing = false;
  let lastX = 0;
  let lastY = 0;
  let path = null;
  let lineWidth = 10;

  let undoStack = [];
  let redoStack = [];

  
  canvas.addEventListener('mousemove', function (e) {
    if (isDrawing) {
      if (isErasing) {
        context.clearRect(e.offsetX - (lineWidth / 2), e.offsetY - (lineWidth / 2), lineWidth, lineWidth);
      }
      else {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;

        undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
        previousCanvas = canvas;
        function saveCanvas() {
          console.log("save");
          localStorage.setItem(letter, canvas.toDataURL());
        }
        saveCanvas();
      }
    }
    if (!path) {
      path = svg.path(`M${lastX} ${lastY}`);
      path.stroke({ width: lineWidth, color: '#000000' });
    } else if (path.array() && path.array().value) {
      path.plot(path.array().value.concat([lastX, lastY]));
    }
  });


  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  });


  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    redoStack = [];
    path = null;
  });


  canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    path = null;
  });


	document.getElementById('Brush').addEventListener('click', function() {
    isErasing = false;
		canvas.style.cursor = 'default';
	});
  

	document.getElementById('Eraser').addEventListener('click', function() {
    isErasing = true;
		canvas.style.cursor = 'cell';
	});

	document.getElementById('Undo').addEventListener('click', function() {
		if (undoStack.length > 0) {
			redoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
			context.putImageData(undoStack.pop(), 0, 0);
		}
	});

	document.getElementById('Redo').addEventListener('click', function() {
		if (redoStack.length > 0) {
			undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
			context.putImageData(redoStack.pop(), 0, 0);
		}
	});

	document.getElementById('clear').addEventListener('click', function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
			undoStack = [];
			redoStack = [];
      localStorage.removeItem(letter);
	});

	document.getElementById('lineWidth').addEventListener('change', function() {
		lineWidth = this.value;
	});

}

function generateTTF() {
  console.log("generate");
  var font = fontforgeJS.new();
  font.version = "1.0";
  font.fontname = "MyFont";
  font.fullname = "MyFont";
  font.familyname = "MyFont";
  font.encoding = "UnicodeFull";

  for (var i = 0; i < letters.length; i++) {
    var letter = letters[i];    
    console.log(letter);
    var glyph = font.createChar(letter.charCodeAt(0));
    console.log(glyph);
    var svgData = localStorage.getItem(letter + '.svg');
    var path = font.createPath(svgData);
    glyph.addReference(letter, path);
  }
  console.log("havettfdata");
  var ttfData = font.write("ttf");
  var blob = new Blob([ttfData], { type: "font/ttf" });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = "MyFont.ttf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

var fontForgeLoaded = false;

document.getElementById('Export').addEventListener('click', function() {
  console.log("export...");
  // Loop through all the keys in local storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Check if the key is a PNG file
    console.log(key);
      // Convert the PNG file to SVG
    const dataURL = localStorage.getItem(key);
    //console.log(dataURL);
    const img = new Image();
    img.src = dataURL;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><img src="${canvas.toDataURL('image/png')}"/></div></foreignObject></svg>`;
      //console.log(svgData);
        // Store the SVG data in local storage
      localStorage.setItem(key.replace('.png', '.svg'), svgData);
        // Convert the SVG file to OTF or TTF format
      if (!fontForgeLoaded) {
        console.log(!fontForgeLoaded);
        const script = document.createElement('script');
        script.src = 'work/Try 4/fontforge.js';
        script.onload = function() {
          console.log("scriptonload");
          fontForgeLoaded = true;
          // Code to execute after the library has finished loading
          generateTTF();
        };
        document.head.appendChild(script);
      } else {
        console.log(!fontForgeLoaded);
        generateTTF();
      }
    };
  }
});

