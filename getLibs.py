#!/usr/bin/python
import urllib2

#Fetch Q (shortcutlib) from github
with open('q.js', 'w') as outfile:
	qLib = urllib2.urlopen('https://raw.github.com/Rockerfeller/shortcutlib/master/q.js')
	outfile.write(qLib.read())
