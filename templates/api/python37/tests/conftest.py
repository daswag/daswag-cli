import decimal
import json
import boto3
import os

from pytest import fixture, skip
from aws_xray_sdk import global_sdk_config
from src.main import logger

# Init Global vars
global_sdk_config.set_sdk_enabled(False)
region = os.environ.get('AWS_REGION')


@fixture(scope='session')
def resource():
  try:
    resource = boto3.resource('dynamodb', endpoint_url="http://localhost:8000/", region_name=region)
    table = resource.Table(os.environ.get('TABLE_NAME'))
    dir_path = os.path.dirname(os.path.realpath(__file__))
    logger.info(dir_path)
    with open(dir_path + "/data/data.json") as json_file:
      items = json.load(json_file, parse_float=decimal.Decimal)
      for item in items:
        table.put_item(
          Item=item
        )
    logger.info("Testing data have been inserted correctly")
    yield resource
    # Remove All Items
    remove_all_items(table)
    logger.info("Testing data have been removed correctly")
  except Exception as e:
    logger.error(e)
    skip('unable to connect to local endpoint')


def remove_all_items(table):
  scan = table.scan()
  with table.batch_writer() as batch:
    for each in scan['Items']:
      batch.delete_item(
        Key={
          'pk': each['pk'],
          'sk': each['sk']
        }
      )


