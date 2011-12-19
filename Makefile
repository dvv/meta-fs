ROOT    := $(shell pwd)
PATH    := $(ROOT)/node_modules/.bin:$(PATH)

PROJECT :=  $(notdir $(ROOT))

test: tmp/usr/bin/busybox
	#NODE_ENV=test vows test/smoke.js --spec
	( cd test ; sudo ./test )

tmp/usr/bin/busybox:
	mkdir -p tmp
	wget -qct3 http://www.landley.net/aboriginal/downloads/binaries/root-filesystem/simple-root-filesystem-i686.tar.bz2 -O - | tar -xjpf - --strip 1 -C tmp
	sudo chown -R 500:500 tmp/home

docs:
	#ndoc

.PHONY: test docs
.SILENT:
