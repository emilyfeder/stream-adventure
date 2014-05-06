workshop_path=node_modules/.bin/stream-adventure

menu:
	$(workshop_path)

print:
	$(workshop_path) print

run:
	$(workshop_path) run $(P)

verify:
		$(workshop_path) verify $(P)

.PHONY: menu print run verify