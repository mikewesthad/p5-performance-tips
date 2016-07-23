# Optimizing p5.js Code for Performance

Note: this is a work-in-progress wiki for [p5.js](https://github.com/processing/p5.js) on performance.

**Add some intro here**

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:1 -->

1. [A Word of Caution](#a-word-of-caution)
2. [Identifying Slow Code: Profiling](#identifying-slow-code-profiling)
	1. [Frames Per Second (FPS)](#frames-per-second-fps)
	2. [Manual Profiling](#manual-profiling)
	3. [Automated Profiling](#automated-profiling)
3. [General p5 Tips](#general-p5-tips)
	1. [Disable the Friendly Error System](#disable-the-friendly-error-system)
	2. [Switch Platforms](#switch-platforms)
	3. [Use Native JS in Bottlenecks](#use-native-js-in-bottlenecks)

<!-- /TOC -->

## A Word of Caution

When it comes to performance, it's tempting to try to squeeze out as much speed as you can right from the get-go. Writing code is a balancing act between trying to write something that is easy to read & maintain and something that gets the job done. Performance optimizations often come with some sacrifices, so in general, you should only worry about optimizing when you know there is a speed problem.

## Identifying Slow Code: Profiling

The first step in speeding up code is usually to [profile](https://en.wikipedia.org/wiki/Profiling_%28computer_programming%29) it - to try to get an idea of how long each piece of the code takes to run.

### Frames Per Second (FPS)

One general measure of your program's speed is the number of frames per second (FPS) is can run. You generally want to aim for a consistent 30 - 60 FPS if your code involves interaction or animation.

You can see your current FPS easily in one of two ways.

In p5, you can call `frameRate()` without any parameters to get the current FPS. Then you can dump that to the console or draw it to the screen:

```javascript
// Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
var fps = frameRate();
fill(255);
stroke(0);
text("FPS: " + fps.toFixed(2), 10, height - 10);
```

With Chrome or the p5 editor, you can open up the developer tools and turn on the "Show FPS meter" options to get a graph of FPS. This is nice because it allows you to see how the FPS changes over time.

In Chrome, open the developer tools (Windows hotkey: `Ctrl + Shift + I` or `F12`, Mac hotkey:  `Cmd + Opt + I`) and then follow these instructions:

![Enabling FPS Meter in Chrome](images/chrome-show-fps.gif)

In the p5 Editor:

![Enabling FPS Meter in p5 Editor](images/editor-show-fps.gif)

### Manual Profiling

To find out how long a piece of code takes to run, you want to know the what time it is when the code starts running and what time it is right after the code ends. In p5, you can get the current time in milliseconds using [`millis()`](http://p5js.org/reference/#/p5/millis). (Under the hood, this function just returns the result of a native JS method: [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now).)

To time a particular piece of code using `millis()`:

```javascript
var start = millis();

// Do the stuff that you want to time
random(0, 100);

var end = millis();
var elapsed = end - start;
console.log("This took: " + elapsed + "ms.")
```

**TODO: explain why you might want to run something multiple times when timing**

### Automated Profiling

Again, developer tools in Chrome and the p5 editor to the rescue.

With both of these tools, it will make your life easier if you use non-minified code (i.e. use "p5.js" over "p5.min.js").

**TODO:** [Timeline panel](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/timeline-tool#profile-js)

**TODO:** [CPU profiler](https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/js-execution?hl=en)

![Chrome CPU Profiler](images/chrome-cpu-profiler.png)

## General p5 Tips

### Disable the Friendly Error System

When you use the non-minified p5.js file (as opposed to p5.min.js), there is a friendly error system that will warn you when you try to override a p5 method, e.g. if you try to do `random = 5;` or `max = 3;`. This error checking system can significantly slow down your code (up to ~10x in some cases). (**Link to test**)

If you are running p5.js version 0.5.3 or greater, you can disable this with one line of code at the top of your sketch:

```javascript
p5.disableFriendlyErrors = true;

function setup() {
  // Do setup stuff
}

function draw() {
  // Do drawing stuff
}
```

If you are running p5.js v0.5.2 or lower, you can disable it in one of two ways: switch over to using `p5.min.js` or use p5 in [instance mode](https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace).

### Switch Platforms

If possible, you can try switching platforms. As of p5.js v0.5.2 and p5 editor v0.6.0:

-   Chrome outperforms the p5 editor.
-   Chrome outperforms Firefox, IE & Edge.
-   Firefox outperforms IE & Edge.

These are generalizations that depend on the specific code you are trying to run and what version of the platform you are using. See the [particle system performance test](code/platforms-test/) for a real example.

### Use Native JS in Bottlenecks

If you know where your performance bottleneck is in your code, then you can speed up the bottleneck by using native JS methods over p5 methods.

Many of the p5 methods come with an overhead. For example: `sin(...)` needs to check whether p5 is in degree mode or radian mode before it can calculate the sin; `random(...)` needs to check whether you have passed in a max and/or min before calculating a random value. In both of these cases, you can just use `Math.random(...)` or `Math.sin(...)`.

The speed boost you will get depends on the specific p5 methods you are using. In v0.5.3, many methods have been optimized (e.g. `abs`, `sqrt`, `log`), but you can still see a performance boost for using `Math.random`, `Math.sin`, `Math.min` over their p5 counterparts. This is especially true for v0.6.0 of the p5 editor. See the [native vs p5 performance test](code/native-vs-p5/):

    Chrome, running methods 10000000x times:

    	p5.random took:     	283.88ms
    	Math.random took: 		190.01ms

    	p5.sin took:            481.14ms
    	Math.sin took:          338.33ms

    	p5.min took:        	244.60ms
    	Math.min took:    		100.97ms

    p5 Editor, running methods 10000000x times:

    	p5.random took:     	2430.28ms
    	Math.random took: 		85.56ms

    	p5.sin took:        	2337.90ms
    	Math.sin took:    		265.94ms

    	p5.min took:        	3046.78ms
    	Math.min took:    		289.42ms
