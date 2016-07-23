// Results in Chrome:
// 
//  p5 random took:     283.88ms.
//  Native random took: 190.01ms.
//  
//  p5 sin took:        481.14ms.
//  Native sin took:    338.33ms.
//  
//  p5 min took:        244.60ms.
//  Native min took:    100.97ms.
//  
// Results in p5 Editor:
// 
//  p5 random took:     2430.28ms.
//  Native random took: 85.56ms.
//  
//  p5 sin took:        2337.90ms.
//  Native sin took:    265.94ms.
//  
//  p5 min took:        3046.78ms.
//  Native min took:    289.42ms.

p5.disableFriendlyErrors = true;

var iterations = 10000000;

function setup() {
  createCanvas(800, 600);

  // -- RANDOM -----------------------------------------------------------
  
  var start = millis();
  for (var i = 0; i < iterations; i++) {
    random(0, 100);
  }
  var elapsed = millis() - start;
  console.log("p5 random took: " + elapsed.toFixed(2) + "ms.")


  var start = millis();
  for (var i = 0; i < iterations; i++) {
    Math.random() * 100;
  }
  var elapsed = millis() - start;
  console.log("Native random took: " + elapsed.toFixed(2) + "ms.")

  // -- SIN -----------------------------------------------------------
  
  var start = millis();
  for (var i = 0; i < iterations; i++) {
    sin(i / iterations * (10 * TWO_PI));
  }
  var elapsed = millis() - start;
  console.log("p5 sin took: " + elapsed.toFixed(2) + "ms.")


  var start = millis();
  for (var i = 0; i < iterations; i++) {
    Math.sin(i / iterations * (10 * TWO_PI));
  }
  var elapsed = millis() - start;
  console.log("Native sin took: " + elapsed.toFixed(2) + "ms.")

  // -- MIN -----------------------------------------------------------
  
  var start = millis();
  for (var i = 0; i < iterations; i++) {
    min(30, 20, 100, 400);
  }
  var elapsed = millis() - start;
  console.log("p5 min took: " + elapsed.toFixed(2) + "ms.")


  var start = millis();
  for (var i = 0; i < iterations; i++) {
    Math.min(30, 20, 100, 400);
  }
  var elapsed = millis() - start;
  console.log("Native min took: " + elapsed.toFixed(2) + "ms.")
}