# SpeedReader

### REF Codepen: https://codepen.io/andrewj117/pen/eYgZdXz?editors=0110

## Goal
> Create a interactive speed reader that takes text input and shows the output. 
> The output will be both full and single word. 

## Preview
![Speed Reader](https://github.com/andrewg117/SpeedReader/blob/main/speedReaderPreview.JPG)

___
## Tasks:
```
COMPLETE: Create menu with user controls(start, pause, reset, speed, etc.)
COMPLETE: Create timer that selects the next word block
FIXED: Create word speed algorithm (words per second, words per block) 
      UPDATE: After testing using timestamps in the startReader function, it seems to be 2 seconds off. This could be due to the delay at the start. I'll work on reducing the startup time.
      After researching, I found that both setTimeout and setInterval accuracy drifts increasingly every interval. I decided to use setTimeout's recursive solution to solve the drift.
      REF:  https://www.sitepoint.com/creating-accurate-timers-in-javascript/ by James Edwards
            https://stackoverflow.com/questions/8173580/setinterval-timing-slowly-drifts-away-from-staying-accurate by Alex Wayne
COMPLETE: Allow user to select word block to start from
COMPLETE: Allow previews to toggle fullscreen 
COMPLETE: Highlight one block at a time
COMPLETE: Allow user to change the word block size
COMPLETE: Add comments
TODO: Clean-up code 
      UPDATE:
      - I will create a new version of the project to implement SRP (Single Responsibility Principle) so that the code is easier to understand and have independent functionality.
```

# Version 2.0

## Goal
> Implement SRP (Single Responsibility Principle) for each component
> Create meaningful names for each variable and function to reduce the need for comments

# Version 3.0

## Goal
> Rewrite class components to functions and implement Hooks.