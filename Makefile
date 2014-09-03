# Pinball.js
#
# Copyright (C) 2013 Mara Kim
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
# details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see http://www.gnu.org/licenses/.

# to compile, in a shell:
# make


# project specific

MAIN=pinball.js
ASSETS=

# macros

MANIFEST=$(MAIN) $(ASSETS)

DEBUGFILE=$(MAIN:.js=.canvas.debug.js)
JSFILE=$(MAIN:.js=.canvas.js)
HTMLFILE=$(MAIN:.js=.canvas.html)

.PHONY: build debug

build: $(MANIFEST)
	maketzjs --mode canvas -t . -o $(JSFILE) $(MAIN)
	makehtml --mode canvas -t . -o $(HTMLFILE) --code $(JSFILE) $(MAIN)

debug:
	makehtml --mode canvas-debug -t . -o $(DEBUGFILE) $(MAIN)
