Optimizing p5.js Code for Performance
=====================================

Note: this is a work-in-progress wiki for [p5.js](https://github.com/processing/p5.js) on performance.

**Add some intro here**

A Word of Caution
-----------------

When it comes to performance, it's tempting to try to squeeze out as much speed as you can right from the get-go. Writing code is a balancing act between trying to write something that is easy to read & maintain and something that gets the job done. Performance optimizations often come with some sacrifices, so in general, you should only worry about optimizing when you know there is a speed problem.

Profiling
---------

The first step in speeding up code is usually to [profile](https://en.wikipedia.org/wiki/Profiling_(computer_programming)) it - to try to get an idea of how long each piece of the code takes to run.

### Frames Per Second (FPS)

One general measure of your program's speed is the number of frames per second (FPS) is can run. You generally want to aim for a consistent 30 - 60 FPS if your code involves interaction or animation.

You can see your FPS easily in one of two ways:

In p5, you can call `frameRate()` without any parameters to get the current FPS. Then you can dump that to the console or draw it to the screen.

With Chrome or the p5 editor, you can open up the developer tools and turn on "Show FPS meter" (**describe how to do this, use this [link](https://developers.google.com/web/tools/chrome-devtools/settings?hl=en#drawer-tabs)**). You'll then see a gray overlay in the browser with an FPS graph. This is nice because it allows you to see how FPS changes over time:

![Chrome FPS Meter](images/chrome-fps.jpg)

### Manual Profiling

**TODO: section on using performance.now/millis**

### Automated Profiling

Again, developer tools in Chrome and the p5 editor to the rescue.

With both of these tools, it will make your life easier if you use non-minified code (i.e. use "p5.js" over "p5.min.js").

**TODO:** [Timeline panel](https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/timeline-tool#profile-js)

**TODO:** [CPU profiler](https://developers.google.com/web/tools/chrome-devtools/profile/rendering-tools/js-execution?hl=en)

![Chrome CPU Profiler](images/chrome-cpu-profiler.png)
