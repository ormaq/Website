let p1sketch = function(p) {
    p.setup = function() {

      let renderer = p.createCanvas(100,100);
      renderer.parent("part1");
    };
  
    p.draw = function() {
      p.background('red');
    };
  };
  
  let part1 = new p5(p1sketch);