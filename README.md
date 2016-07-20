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
