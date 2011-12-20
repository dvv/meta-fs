REPO    := /home/dvv/LUA/MOD/repo

DEPS    := $(shell luvit -e "for name, url in pairs(require('./config').dependencies or {}) do print(name .. ': ' .. url) end")

all:
	#echo $(DEPS)
	mkdir -p modules
	luvit -e "for name, url in pairs(require('./config').dependencies or {}) do print(name .. ' ' .. url) end" \
		| while read N U; do echo modules/$$N: $(REPO)/$$U; done

#$(DEPS):
#	echo $@

.SILENT:
.PHONY: all
