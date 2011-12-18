ROOT    := $(shell pwd)
PATH    := $(ROOT)/node_modules/.bin:$(PATH)

PROJECT :=  $(notdir $(ROOT))

test:
	NODE_ENV=test vows test/smoke.js --spec

docs:
	#ndoc

.PHONY: test docs
.SILENT:
