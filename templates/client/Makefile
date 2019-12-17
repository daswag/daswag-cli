SHELL:=/bin/bash

BASE := $(shell /bin/pwd)

CONFIG_FILE_PATH := src/assets/config/app-config.json

export PATH := var:$(PATH):$(VENV_DIR)/bin

.DEFAULT_GOAL := output

PROJECT_NAME ?= <%= baseNameKebabCase %>
STAGE_NAME ?= dev
AWS_REGION = eu-west-1

PRICE_CLASS ?= PriceClass_100

CFN_PARAMS := ProjectName=$(PROJECT_NAME) \
		StageName=$(STAGE_NAME) \
		PriceClass=$(PRICE_CLASS)

TAGS_PARAMS := "daswag:project"="${PROJECT_NAME}" \
		"daswag:owner"="daswag" \
		"daswag:environment"=$(STAGE_NAME)

lint:
	yarn lint

serve:
	yarn start

build:
	yarn build

test:
	yarn test

deploy:
	aws cloudformation deploy \
		--template-file template.yaml \
		--stack-name ${PROJECT_NAME}-${STAGE_NAME} \
		--parameter-overrides $(CFN_PARAMS) \
		--capabilities CAPABILITY_NAMED_IAM \
		--tags $(TAGS_PARAMS)

update-content:
	@make generate-config CONFIG_FILE_PATH=dist/assets/config/app-config.json
	# Get stack variables
	bucket_name=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "WebBucketName") | .OutputValue')
	distribution_id=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} | jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "DistributionId") | .OutputValue')
	# Sync content and invalidate distribution
	aws s3 sync dist/ s3://${bucket_name} --delete
	aws cloudfront create-invalidation --distribution-id ${distribution_id} --paths /

delete:
	aws cloudformation delete-stack \
	--stack-name $(PROJECT_NAME)-${STAGE_NAME}

generate-config:
	node scripts/generate-config.js ${PROJECT_NAME}-${STAGE_NAME} ${CONFIG_FILE_PATH}

output-init:
	aws cloudformation describe-stacks \
		--stack-name ${PROJECT_NAME}-${STAGE_NAME}-init \
		--query 'Stacks[].Outputs'

boostrap:
	yarn install
