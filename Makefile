PATH    := $(shell pwd)/node_modules/.bin:$(PATH)

test:
	rm -fr sandbox
	mkdir -p sandbox/foo/bar/baz
	touch sandbox/foo/bar/baz/file
	touch sandbox/foo/bar/file
	touch sandbox/foo/file
	touch sandbox/file
	ln -s ../../.. sandbox/foo/bar/baz/link
	ln -s ../.. sandbox/foo/bar/link
	ln -s .. sandbox/foo/link
	ln -s . sandbox/link
	NODE_ENV=test vows tests/find.js tests/cp_a.js tests/mkdir_p.js tests/ln_s.js tests/rm_rf.js --spec

docs:
	#ndoc

.PHONY: test docs
.SILENT:
