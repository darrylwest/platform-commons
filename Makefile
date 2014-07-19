
all:
	@make test

npm:
	@( npm install )

jshint:
	@( [ -d node_modules ] || make npm )
	@( grunt jshint )

test:
	@( [ -d node_modules ] || make npm )
	@( grunt test jshint )

watch:
	@( grunt test jshint watch )

less:
	@( grunt less )

docs:
	@( grunt jsdoc )

deploy:
	@( echo "not complete yet..." )

.PHONY: deploy
.PHONY: less
.PHONY: jshint
.PHONY: npm
.PHONY: docs
