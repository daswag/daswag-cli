# flake8: noqa
import sys
import os
import boto3

# Import XRay to enable tracing
from aws_xray_sdk.core import patch
from src.core.logger import create_logger

# XRay patching third party libs
libs_to_patch = (['boto3'])
patch(libs_to_patch)

# Global variables
region = os.environ.get('AWS_REGION')
resource = None
initialized = False
logger = create_logger(__name__)


def build_dynamodb_resource():
  global resource
  logger.debug("Building DynamoDB resource")
  if os.getenv("AWS_SAM_LOCAL") == 'true':
    logger.info('Using local endpoint to access DynamoDB service')
    resource = boto3.resource('dynamodb', region_name='localhost', endpoint_url="http://localhost:8000/")
  else:
    resource = boto3.resource('dynamodb', region_name=region)


def get_resource():
  return resource


def init():
  global initialized
  try:
    if initialized:
      return
    else:
      initialized = True
      build_dynamodb_resource()
  except Exception as e:
    logger.error("An error occurred during initialization phase", e)
    sys.exit()

