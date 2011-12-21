ROOT    := $(shell pwd)
PATH    := $(ROOT)/node_modules/.bin:$(PATH)

PROJECT :=  $(notdir $(ROOT))

test:
	-rm -fr sandbox
	mkdir -p sandbox
	tar -xzpf tests/mod.tgz -C sandbox
	NODE_ENV=test vows tests/find.js tests/cp_a.js tests/mkdir_p.js --spec

test_chroot: tmp/usr/bin/busybox
	( cd test ; sudo ./test )

tmp/usr/bin/busybox:
	mkdir -p tmp
	wget -qct3 http://www.landley.net/aboriginal/downloads/binaries/root-filesystem/simple-root-filesystem-i686.tar.bz2 -O - | tar -xjpf - --strip 1 -C tmp
	sudo chown -R 500:500 tmp/home

docs:
	#ndoc

.PHONY: test test_chroot docs
.SILENT:
