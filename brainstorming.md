# Brainstorming for p5 Performance Wiki

## General Performance Advice

- Worry about performance when performance is a problem
- Think about changes to your algorithm
- Optimize the parts that need it by profiling your code
- Define your target: does it need to run fast on all devices?

## General p5 Advice

- Update to the latest p5.js
- Disable friendly errors
- Browser is generally faster than the p5 editor
- Instance mode is generally faster than global mode
- Prefer native JS functions in intensive code
- Sometimes, using the underlying canvas context can be faster
- Do as much as you can in setup
- Check for slowdowns specifically in `draw` or event handlers (e.g. `mousePressed`)

## Profiling

- Manual timing via [Performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
- Browser dev tools
- Editor dev tools?
- View FPS in the browser

## Miscellaneous Thoughts

- Caching
- Shrink images
- Loop over a smaller range
- Pixels[] over get
- Set text size up front
