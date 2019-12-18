SHELL:=/bin/bash
PY_VERSION := 3.7

BASE := $(shell /bin/pwd)
VENV_DIR := $(BASE)/.venv

PYTHON := $(shell /usr/bin/which python$(PY_VERSION))
VIRTUALENV := $(PYTHON) -m venv

export PYTHONUNBUFFERED := 1
export PATH := var:$(PATH):$(VENV_DIR)/bin

.DEFAULT_GOAL := lint
.PHONY: lint test bootstrap

PROJECT_NAME ?= <%= baseNameKebabCase %>
STAGE_NAME ?= dev

export AWS_REGION ?= eu-west-1
export TABLE_NAME ?= $(PROJECT_NAME)-$(STAGE_NAME)

INIT_CFN_PARAMS := ProjectName=$(PROJECT_NAME) \
		StageName=$(STAGE_NAME)

CFN_PARAMS := ProjectName=$(PROJECT_NAME) \
		StageName=$(STAGE_NAME) \
		TableName=$(TABLE_NAME)

INIT_TAGS_PARAMS := "daswag:project"="${PROJECT_NAME}-init" \
		"daswag:owner"="daswag" \
		"daswag:environment"=$(STAGE_NAME)

TAGS_PARAMS := "daswag:project"="${PROJECT_NAME}" \
		"daswag:owner"="daswag" \
		"daswag:environment"=$(STAGE_NAME)

lint:
	sh -c '. .venv/bin/activate; flake8 --tee --output-file=pylint.out --exclude=src/python-libs src'

test:
	sh -c '. .venv/bin/activate; py.test -x tests'

test-with-cov:
	sh -c '. .venv/bin/activate; py.test tests -x --cov --cov-report xml --cov-report=term-missing'

start-db:
	docker container run --rm -p 8000:8000 --name dynamodb-local -d amazon/dynamodb-local:latest

stop-db:
	docker container stop dynamodb-local

create-table:
	sh -c '. .venv/bin/activate; aws dynamodb create-table \
	--cli-input-json file://tests/data/create-table.json \
	--endpoint-url http://localhost:8000 \
	--region eu-west-1'

delete-table:
	sh -c '. .venv/bin/activate; aws dynamodb delete-table \
	--table-name ${TABLE_NAME} \
	--endpoint-url http://localhost:8000 \
	--region ${AWS_REGION}'

build:
	sh -c '. .venv/bin/activate; sam build'

build-container:
	sh -c '. .venv/bin/activate; sam build --use-container'

package:
	sh -c '. .venv/bin/activate; sam package \
		--s3-bucket $(PROJECT_NAME)-${STAGE_NAME}-resources \
		--output-template-file packaged.yaml'

deploy-init:
	sh -c '. .venv/bin/activate; aws cloudformation deploy \
		--template-file template-init.yaml \
		--stack-name $(PROJECT_NAME)-${STAGE_NAME}-init \
		--parameter-overrides $(INIT_CFN_PARAMS) \
		--capabilities CAPABILITY_NAMED_IAM \
		--region ${AWS_REGION} \
		--tags $(INIT_TAGS_PARAMS)'

deploy:
	sh -c '. .venv/bin/activate; sam deploy \
		--template-file packaged.yaml \
		--stack-name ${PROJECT_NAME}-${STAGE_NAME} \
		--parameter-overrides $(CFN_PARAMS) \
		--capabilities CAPABILITY_NAMED_IAM \
		--region ${AWS_REGION} \
		--tags $(TAGS_PARAMS)'

delete-init:
	sh -c '. .venv/bin/activate; aws cloudformation delete-stack \
	--stack-name $(PROJECT_NAME)-${STAGE_NAME}-init'

delete:
	sh -c '. .venv/bin/activate; aws cloudformation delete-stack \
	--stack-name $(PROJECT_NAME)-${STAGE_NAME}'

release:
	@make build
	@make package
	@make deploy

generate-doc:
	docker run -v $$PWD:/var/task -it ruby:latest /bin/bash -c 'gem install asciidoctor && asciidoctor -b html5 -B docs -D target/ docs/index.adoc'

bootstrap: .venv
	.venv/bin/pip install -e .
ifneq ($(wildcard test-requirements.txt),)
	.venv/bin/pip install -r test-requirements.txt
endif

.venv:
	$(VIRTUALENV) .venv
	.venv/bin/pip install --upgrade pip
	.venv/bin/pip install --upgrade setuptools
	.venv/bin/pip install --upgrade wheel
