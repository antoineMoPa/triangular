triangular
==========

A cellular automation toy where you define the cell switching pattern

## How to use
1. Draw with your mouse on the canvas
2. Click 'Iterate'
3. Click small blue squares in the pattern selector

## What can I do with it ?
* Observe how complexity gets developed within the canvas when you discover interesting patterns
* Get inspired with the crazy patterns that may happen
* Increase the canvas size and create some random form of art

## How it works

The algorithm parses the canvas from left to right (And top to bottom).
Each time it encounters a pixel that is turned on, it switches on/off the pixels around it
in a manner defined by the pattern selector.


## Problems

* The borders may cause 'interferences' (noise). 
* It becomes slower as more pixels get filled (because it needs to test more pixels)
