.PHONY: dist clean install build package

PLUGIN_ID := com.mattermost.html-preview
VERSION := 1.0.0

dist: clean build package
	@echo "Plugin bundle created: $(PLUGIN_ID)-$(VERSION).tar.gz"

clean:
	rm -rf dist
	rm -rf webapp/dist
	rm -rf webapp/node_modules
	rm -f $(PLUGIN_ID)-$(VERSION).tar.gz

install:
	cd webapp && npm install

build: install
	cd webapp && npm run build
	mkdir -p dist
	cp plugin.json dist/
	cp -r assets dist/
	cp -r webapp/dist dist/webapp

package: build
	cd dist && tar -czf ../$(PLUGIN_ID)-$(VERSION).tar.gz .
