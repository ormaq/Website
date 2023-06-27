let p2sketch = function(p) {
    p.setup = function() {

      let renderer = p.createCanvas(400,400);
      renderer.parent("part2");
    };
  
    p.draw = function() {
      p.background('blue');
    };
  };
  
  let part2 = new p5(p2sketch);