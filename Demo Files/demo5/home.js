let mainpage = function (p) {
  let colors = [
    '#FF2744',
    '#D32F2F',
    '#c62828',
    '#faa613',
    '#ffa531',
    '#ff6700',
    '#FF9F00',
    '#FFC107',
    '#FFE04D',
    '#FFEB3B',
    '#FFED71',
    '#C6DBFD',
    '#2196F3',
    '#2656A7',
    '#311b92',
  ];

  let darkColors = [
    '#470F1D',
    '#3D0D0D',
    '#351414',
    '#5F3D0E',
    '#5F3B0F',
    '#5F2600',
    '#5F4B00',
    '#5F510A',
    '#5F560D',
    '#5F5710',
    '#5F582B',
    '#253B55',
    '#0F3463',
    '#0F1C3B',
    '#130B24'
  ];

  var darkThemepage = false;
  var bit8 = 0;
  let yoffs = []; // Array to store random y-offsets for each layer
  let maxX = 0;
  const yoffsScaled = [];

  p.setup = function () {
    let renderer = p.createCanvas(p.windowWidth, p.windowHeight);
    renderer.parent("homebackground");


    for (let i = 0; i < colors.length; i++) {
      yoffs[i] = p.random(10); // Generate a random y-offset for each layer
      yoffsScaled[i] = yoffs[i] * 0.35;
    }
  };

  function calculateY(x, i) {
    let xScaled = x * 0.002;
    let iScaled = i * 140;
    let xSinScaled = x * 0.01;
    let noiseVal = p.noise(xScaled + yoffsScaled[i], yoffs[i]) * 2;
    let scalingFactor = p.map(x, 0, p.width, 0.4, .8);
    let yStart = iScaled;
    let y = p.map(noiseVal, 0, 1, yStart - 80, yStart + 110) * scalingFactor;
    y += p.sin(xSinScaled + yoffs[i]) * 100;
    return y;
  }

  p.draw = function () {
    var currentcolor = colors;
    if (!darkThemepage)
      p.background(222);
    else {
      p.background(40);
      currentcolor = darkColors;
    }

    p.noStroke();
    let windowWidth = p.windowWidth;


    if (!darkThemepage) {
      for (let i = 0; i < currentcolor.length; i++) {
        p.fill(currentcolor[i]);
        p.beginShape();

        let frameOffset = yoffs[i] * 2;
        let normFrameCount = p.map(p.frameCount - i * frameOffset, 0, 80, 0, 1);
        maxX = Math.pow(normFrameCount, .8) * p.width;
        if (maxX > p.width) {
          maxX = p.width;
        }

        let y1;
        for (let x = 0; x < maxX + 40; x += 20) {
          y1 = calculateY(x, i);
          p.vertex(x, y1);

          if (bit8 > 6) {
            // make the wave look 8-bit
            let bitWidth = 40;  // Controls the width of each 'bit'. Adjust this value as needed.

            let y1 = calculateY(Math.floor(x / bitWidth) * bitWidth, i);
            let y2 = calculateY(Math.floor((x + bitWidth) / bitWidth) * bitWidth, i);

            p.vertex(x, y1);
            p.vertex(x + bitWidth, y1);
            p.vertex(x + bitWidth, y2);
          }
        }
        p.vertex(maxX, p.height);
        p.vertex(0, p.height);
        p.endShape(p.CLOSE);
      }
    }
    else {
      for (let i = 0; i < currentcolor.length; i++) {
        p.fill(currentcolor[i]);
        p.beginShape();

        let frameOffset = yoffs[i] * 2;
        let normFrameCount = p.map(p.frameCount - i * frameOffset, 0, 80, 0, 1);
        maxX = Math.pow(normFrameCount, .8) * p.width;
        if (maxX > p.width) {
          maxX = p.width;
        }

        for (let x = 0; x <= maxX; x += 40) {
          let y1 = calculateY(x, i);
          p.vertex(windowWidth - x, y1);
        }
        p.vertex(windowWidth - maxX, p.height);
        p.vertex(windowWidth, p.height);
        p.endShape(p.CLOSE);
      }
    }

    for (let i = 0; i < yoffs.length; i++) {
      yoffs[i] += 0.001;
    }
  };


  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  window.setDarkTheme = function (darkTheme) {
    p.frameCount = 0;
    darkThemepage = darkTheme;
    bit8++;
  };
};

let homepage = new p5(mainpage);
