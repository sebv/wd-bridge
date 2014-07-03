JSHINT_BIN=./node_modules/.bin/jshint
JSCS_BIN=./node_modules/.bin/jscs
MOCHA=./node_modules/.bin/mocha
PROTRACTOR=./node_modules/.bin/protractor
default: jshint jscs

jshint:
	@$(JSHINT_BIN) lib test examples

jscs:
	@$(JSCS_BIN) lib test examples

test:
	./node_modules/.bin/mocha --recursive test/midway
	./node_modules/.bin/protractor test/protractor/conf.js

test_sauce:
	SAUCE=1 ./node_modules/.bin/mocha --recursive test/midway
	./node_modules/.bin/protractor test/protractor/conf-sauce.js

clean_trace:
	rm -rf instrumentscli*.trace

.PHONY: \
	DEFAULT \
	jscs \
	jshint \
	test
	