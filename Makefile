SHELL:=/bin/bash

BASE := $(shell /bin/pwd)

export DEBUG_LOG := false

.DEFAULT_GOAL := lint
.PHONY: lint test

PROJECT_NAME ?= daswag-cli
STAGE_NAME ?= dev
AWS_REGION = eu-west-1

export SONAR_SCANNER_VERSION := 4.2.0.1873
export SONAR_SCANNER_HOME := $(HOME)/.sonar/sonar-scanner-$(SONAR_SCANNER_VERSION)-linux
export PATH := $(SONAR_SCANNER_HOME)/bin:$(PATH)

CODECOV_TOKEN ?=
GITHUB_TOKEN ?=
NPM_TOKEN ?=
SONAR_TOKEN ?=

PIPELINE_CFN_PARAMS := ProjectName=$(PROJECT_NAME) \
        StageName=$(STAGE_NAME) \
        CodeCovToken=$(CODECOV_TOKEN) \
        GithubToken=$(GITHUB_TOKEN) \
        NpmToken=$(NPM_TOKEN) \
        SonarToken=$(SONAR_TOKEN)

PIPELINE_TAGS_PARAMS := "daswag:project"="${PROJECT_NAME}" \
        "daswag:owner"="shouel" \
        "daswag:environment"=$(STAGE_NAME)

install:
	yarn install

install-sonar:
	rm -rf ${SONAR_SCANNER_HOME}
	mkdir -p ${SONAR_SCANNER_HOME}
	curl -sSLo ${HOME}/.sonar/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip
	unzip ${HOME}/.sonar/sonar-scanner.zip -d ${HOME}/.sonar/
	rm ${HOME}/.sonar/sonar-scanner.zip


test:
	yarn test

codecov:
	./node_modules/.bin/nyc report --reporter text-lcov > coverage.lcov
	./node_modules/.bin/codecov

release-beta:
	np patch --tag=beta

release-patch:
	np patch

release-minor:
	np minor

release-major:
	np major

semantic-release:
	npm run semantic-release

sonar:
	sonar-scanner \
	-Dsonar.projectKey=daswag_daswag-cli \
	-Dsonar.organization=daswag \
	-Dsonar.sources=src \
	-Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.exclusions=**/node_modules/**,**/*.spec.ts \
  -Dsonar.language=ts \
  -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
	-Dsonar.login=${SONAR_TOKEN}

deploy-pipeline:
	aws cloudformation deploy \
		--template-file cfn/pipeline.yaml \
		--stack-name ${PROJECT_NAME}-${STAGE_NAME}-pipeline \
		--parameter-overrides $(PIPELINE_CFN_PARAMS) \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(AWS_REGION) \
		--tags $(PIPELINE_TAGS_PARAMS)


delete-pipeline:
	aws cloudformation delete-stack \
	--stack-name $(PROJECT_NAME)-${STAGE_NAME}-pipeline \
	--region $(AWS_REGION)

output:
	aws cloudformation describe-stacks \
		--stack-name ${PROJECT_NAME}-${STAGE_NAME}-pipeline \
		--query 'Stacks[].Outputs'

