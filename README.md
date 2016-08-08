# Optimizing p5.js Code for Performance

Note: this is a work-in-progress wiki for [p5.js](https://github.com/processing/p5.js) on performance.

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:1 -->

1. [Words of Caution!](#words-of-caution)
2. [Identifying Slow Code: Profiling](#identifying-slow-code-profiling)
	1. [Frames Per Second (FPS)](#frames-per-second-fps)
	2. [Manual Profiling](#manual-profiling)
	3. [Automated Profiling](#automated-profiling)
3. [p5 Performance Tips](#p5-performance-tips)
	1. [Disable the Friendly Error System](#disable-the-friendly-error-system)
	2. [Switch Platforms](#switch-platforms)
	3. [Use Native JS in Bottlenecks](#use-native-js-in-bottlenecks)
	4. [Image Processing](#image-processing)
		1. [Sampling/Resizing](#samplingresizing)
		2. [Frontload Image Processing](#frontload-image-processing)
	5. [DOM Manipulation](#dom-manipulation)
		1. [Batch DOM Manipulations](#batch-dom-manipulations)
		2. [Minimize Searching](#minimize-searching)
	6. [Math Tips](#math-tips)

<!-- /TOC -->

## Words of Caution!

When it comes to performance, it's tempting to try to squeeze out as much speed as you can right from the get-go. Writing code is a balancing act between trying to write something that is easy to read & maintain and something that gets the job done. Performance optimizations often come with some sacrifices, so in general, you should only worry about optimizing when you know there is a speed problem.

Along with that, it's important to keep in mind a general mantra of "optimize the algorithm, not the code." Sometimes, you will get nice gains from micro-optimizing a line of code or two. But generally speaking, the biggest gains you get tend to come from changing your approach. E.g. if you have code that loops through every single pixel in an image, you will certainly speed up your code if you decide that you can instead just look through every other pixel.

## Identifying Slow Code: Profiling

The first step in speeding up code is usually to [profile](https://en.wikipedia.org/wiki/Profiling_%28computer_programming%29) it - to try to get an idea of how long each piece of the code takes to run.

### Frames Per Second (FPS)

One general measure of your program's speed is the number of frames per second (FPS) it can render. You generally want to aim for a consistent 30 - 60 FPS if your code involves interaction or animation. (Here's a [demo](http://www.testufo.com/#test=framerates&count=3&background=none&pps=720) showing what 60, 30 and 15 FPS look like.)

You can see your current FPS easily in one of two ways.

In p5, you can call [`frameRate()`](http://p5js.org/reference/#/p5/frameRate) without any parameters to get the current FPS. Then you can dump that to the console or draw it to the screen:

```javascript
// Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
var fps = frameRate();
fill(255);
stroke(0);
text("FPS: " + fps.toFixed(2), 10, height - 10);
```

With Chrome or the p5 editor, you can open up the developer tools and turn on the "Show FPS meter" options to get a graph of FPS. This is nice because it allows you to see how the FPS changes over time.

In Chrome, open the developer tools (Windows hotkey: `Ctrl + Shift + I` or `F12`, Mac hotkey:  `Cmd + Opt + I`) and then follow these instructions:

![Enabling FPS Meter in Chrome](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/chrome-show-fps.gif)

In the p5 Editor:

![Enabling FPS Meter in p5 Editor](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/editor-show-fps.gif)

### Manual Profiling

To find out how long a piece of code takes to run, you want to know the time when the code starts running and the time when it finishes running. In p5, you can get the current time in milliseconds using [`millis()`](http://p5js.org/reference/#/p5/millis). (Under the hood, this function just returns the result of a native JS method: [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now).)

To time a particular piece of code using `millis()`:

```javascript
var start = millis();

// Do the stuff that you want to time
random(0, 100);

var end = millis();
var elapsed = end - start;
console.log("This took: " + elapsed + "ms.")
```

Usually, you will want to run the code you are trying to profile many times and then find the average time that it took to run. See any of the performance tests in [code/](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/) for examples.

Note: `console.log()` and `println()` will definitely slow down your code, so be sure to remove them from the final version of your project!

### Automated Profiling

Again, the developer tools in Chrome and the p5 editor come to the rescue with some automated tools. With the [CPU profiler](https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/js-execution), you can see how much time is spent in each function within your code _without_ adding any manual timing code. When you are dealing with a complicated project and you are not sure where to start optimizing, this is a helpful starting point.

When you want to profile your code, open the developer tools (hamburger icon in the p5 editor). Go to the "Profiles" tab, select "Collect JavaScript CPU Profile" and hit start. This will start timing your code. When you've recorded a large  enough sample, stop the recording and take a look at the results:

![Chrome CPU Profiler](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/chrome-cpu-profile.jpg)

It's helpful to look at the CPU profiler results for some real code. The recording for this section is a p5 sketch that gets an image from the webcam, sorts the pixels by hue and then draws them to the screen (see [code/cpu-profiler-demo](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/cpu-profiler-demo/)). There are  four main functions:

-   `samplePixels` - gets a set of pixels from the camera
-   `sortPixels` - sorts the sampled pixels
-   `sortHue` - compares the hue of two colors in order to decide how they should be ordered
-   `drawPixels` - draw the pixels to the screen as colored rectangles

The default view of the recording is a table of functions with their associated timing. It gives you the "self" and "total" times for all the functions in your code. Self time is the amount of time spent on the statements in a function _excluding_ calls to other functions. Total time is the amount of time that it took to run that function _and_ any functions that it calls.

From the total times, we can see that roughly equal amounts of time were spent in `samplePixels`, `drawPixels` and `sortPixels`, so any of them are candidates for trying optimizations. Here, the easiest optimization with the biggest gains would simply be to reduce the number of pixels sampled from the camera frame. That will speed up all three functions.

If you switch the view of the recording from "Heavy (Bottom Up)" to "Chart," you can get a better sense of the breakdown and interactively explore the recording:

![Chrome CPU Profiler](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/chrome-cpu-flame.gif)

Given that the CPU profiler is simply going to show you a table that has function names, it is important for the functions in your code to actually have names. So you should:

-   Use "p5.js" over "p5.min.js", so that p5 functions have non-minified names.
-   Avoid using [anonymous functions](https://en.wikibooks.org/wiki/JavaScript/Anonymous_functions) in your code.

See the [CPU profiler documentation](https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/js-execution) for more details.

## p5 Performance Tips

### Disable the Friendly Error System

When you use the non-minified p5.js file (as opposed to p5.min.js), there is a friendly error system that will warn you when you try to override a p5 method, e.g. if you try to do `random = 5` or `max = 3`. This error checking system can significantly slow down your code (up to ~10x in some cases). See the [friendly error performance test](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/friendly-error-system/).

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

These are generalizations that depend on the specific code you are trying to run and what version of the platform you are using. See the [particle system performance test](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/platforms-test/) for a real example.

### Use Native JS in Bottlenecks

If you know where your performance bottleneck is in your code, then you can speed up the bottleneck by using native JS methods over p5 methods.

Many of the p5 methods come with an overhead. For example: `sin(...)` needs to check whether p5 is in degree mode or radian mode before it can calculate the sin; `random(...)` needs to check whether you have passed in a max and/or min before calculating a random value. In both of these cases, you can just use `Math.random(...)` or `Math.sin(...)`.

The speed boost you will get depends on the specific p5 methods you are using. In v0.5.3, many methods have been optimized (e.g. `abs`, `sqrt`, `log`), but you can still see a performance boost for using `Math.random`, `Math.sin`, `Math.min` over their p5 counterparts. This is especially true for v0.6.0 of the p5 editor. See the [native vs p5 performance test](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/native-vs-p5/):

    Chrome, running methods 10000000x times:

    	p5.random took:     	283.88ms
    	Math.random took: 		190.01ms

    	p5.sin took:            481.14ms
    	Math.sin took:          338.33ms

    	p5.min took:        	781.41ms
    	Math.min took:    		538.15ms

    p5 Editor, running methods 10000000x times:

    	p5.random took:     	2430.28ms
    	Math.random took: 		85.56ms

    	p5.sin took:        	2337.90ms
    	Math.sin took:    		265.94ms

    	p5.min took:        	8335.63ms
    	Math.min took:    		5308.00ms

### Image Processing

#### Sampling/Resizing

When looping through the pixels in an image, you can get an easy performance boost by simply reducing the size of your image or by sampling it. If you have an 1000 x 1000 image that you are working with, you are iterating through 1000000 pixels.  If you chop that image in half to 500 x 500 (250000 pixels), you now only need to do 1/4th of the iterations you were doing previously. That's a pretty major savings.

You have a number of options when it comes to resizing/sampling:

1.  Resize the image before runtime using Photoshop, GIMP, etc. This will likely yield the best quality shrunken image because you can control the resizing algorithm and apply filters to sharpen the image.
2.  Resize the image using p5.Image's [resize](http://p5js.org/reference/#/p5.Image/resize) method. Here, you are at the whim of the browser for how it handles downsampling interpolation. (Well, you do have some not quite fully supported [control](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering)...)
3.  Sample the image by only using every 2nd (or 3rd or 4th, etc.) pixel.  Dead simple and effective, but you can potentially lose thin details in the image if you skip a lot of pixels.

See [code/resizing-images](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/resizing-images/) for an application of each method. Practically speaking, these appear to have roughly same performance.  Here's a 1200 x 800 image of a blackberry ([source](https://www.flickr.com/photos/lodefink/958569742/)) resized to 120 x 80 with the three methods:

![](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/resizing-comparison.png)

If you can, resizing the image beforehand gives you the most control over the final visuals. If you can't (e.g. processing frames of a video), sampling or resizing should serve you well.

One last note! If you are doing drastic resizing of an image or you have an image with important fine details (e.g. vector art, line drawing, detailed patterns, etc.), sampling or resizing can give pretty poor results. Here's a 1900 x 1900 floral pattern ([source](http://www.publicdomainpictures.net/pictures/60000/velka/vintage-floral-wallpaper-pattern.jpg#.V6ejBINAuqk.link)) resized to 100 x 100:

![](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/drastic-resizing-comparison.png)

That last method - iterative resizing - can also be found in [code/resizing-images](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/resizing-images/). The approach - taken from this [stack overflow answer](http://stackoverflow.com/a/19262385) - is to resize the image in steps. This is helpful when you can't resize an image ahead of time, and the regular resizing approach is dropping important details.

#### Frontload Image Processing

If you can, it's best to frontload image processing. Do as much as you can during `setup()`, so that your `draw()` loop can be as fast as possible. This will help prevent the interactive parts of your sketch from becoming sluggish.

For example, if you need color information from an image for a p5 sketch, extract & store the [p5.Color](http://p5js.org/reference/#/p5/color) objects during `setup()`. Then in `draw()`, you can look up the cached color information when you need it, as opposed to recalculating it on the fly.  

### DOM Manipulation

The [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) (DOM) is the programming interface that gives us access to create, manipulate and remove HTML elements. There are some common DOM pitfalls that will really hurt your performance.  

#### Batch DOM Manipulations

When working with the DOM, you want to avoid causing the browser to unnecessarily "[reflow](https://developers.google.com/speed/articles/reflow)" or re-layout all the elements on the page for every change you make. What you want to do is batch all your DOM changes together, so you can make one large change as opposed to many small changes. When you cause the browser to constantly re-layout the page with many small changes, this is commonly called [layout thrashing](http://kellegous.com/j/2013/01/26/layout-performance/).

Here's a [gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) that lists many of the DOM methods and properties that can trigger a reflow. The browser will try to be "lazy" and put off reflow as long as it can, but some things (like asking for an element's `offsetLeft`) necessitate a reflow.

There are a number of ways you can batch your changes and avoid layout thrashing. Unfortunately, p5.Element and the p5.dom addon do not currently give you a lot of room for batching. For instance, creating a p5.element will cause layout thrashing (via `offsetWidth` and `offsetHeight`).

If you are running into DOM performance issues, your best approach is likely to take control and go with plain JavaScript or use a DOM manipulation library (e.g. [fastdom](https://github.com/wilsonpage/fastdom)). See [code/reflow-dom-manipulation](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/reflow-dom-manipulation/) for a performance test of DOM manipulation in p5 vs native JS. In that case, native JS that avoids reflow is **~400x - 500x** times faster.

Before rewriting your code, make sure that layout thrashing is the problem! The [timeline tool](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/timeline-tool?utm_source=dcc&utm_medium=redirect&utm_campaign=2016q3) in Chrome is a good place to start. It will highlight code that is likely causing a forced reflow, and it can show you how much time is spent rendering the page vs running the JS:

![](https://github.com/mikewesthad/p5-performance-tips/blob/master/images/timeline.png)

#### Minimize Searching

Searching for elements in the DOM can be costly - especially if you are doing the searching during `draw()`. Minimize DOM lookups by storing references to your elements in `setup()`.  For example, if you have a button that you are constantly repositioning so that it runs away from the mouse cursor:

```js
var button;

function setup () {
  // Store a reference to the element in setup
  button = select("#runner");
}

function draw() {
  var x, y;
  // Do some stuff to figure out where to move the button
  button.position(x, y);
}
```

See [code/cache-dom-lookups](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/cache-dom-lookups/) for a performance test. In the test, caching the element was ~10x faster than constantly re-searching for the element. The performance boost will vary depending on the depth of your DOM tree and the complexity of your selector.

### Math Tips

-   When you need to compare distances between points or magnitudes of vectors, try using distance squared or magnitude squared ([p5.Vector.magSq](http://p5js.org/reference/#/p5.Vector/magSq)). See [code/distance-squared](https://github.com/mikewesthad/p5-performance-tips/blob/master/code/distance-squared/) for a performance test.

    ```js
    function distSquared(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return dx * dx + dy * dy;
    }
    ```
