import json
import src.core.config as config

from random import random
from src.main import logger, get_resource

DEBUG_HEADER = 'debug-log-enabled'


class Request:

  def __init__(self, event, aws_request_id, resource=None):
    self.event = event
    self.request_id = aws_request_id
    self.params = {}
    self.request_context = {}
    self.resource = resource or get_resource()

    # Log newly created request
    logger.debug('Received event: %s', json.dumps(self.event, indent=2))
    logger.debug('Lambda Request ID: %s', self.request_id)

    # Initialize request context
    if 'requestContext' in self.event:
      self.request_context = self.event['requestContext']

  def set_request_context(self):

    self.request_context['aws-request-id'] = self.request_id

    if 'headers' not in self.event:
      logger.warning('Request %s is missing headers', self.request_id)
      return

    # Push correlation headers to context
    for header in self.event.get('headers', []):
      if header.lower().startswith("x-correlation-"):
        self.request_context[header] = self.event['headers'][header]

    if 'x-correlation-id' not in self.request_context:
      self.request_context['x-correlation-id'] = self.request_id

    if 'User-Agent' in self.event.get('headers'):
      self.request_context['User-Agent'] = self.event.get('headers')['User-Agent']

    if DEBUG_HEADER in self.event.get('headers') and self.event.get('headers')[DEBUG_HEADER] == 'true':
      self.request_context[DEBUG_HEADER] = "true"
    else:
      # enable debug logging on 5% of cases
      self.request_context['debug-log-enabled'] = "true" if random() < 0.05 else "false"

    # Propagate context to global
    config.global_context = self.request_context

  def get_and_check_params(self, mandatory, optional):
    params = {}
    if self.event.get('pathParameters'):
      params.update(self.event.get('pathParameters', {}))
    if self.event.get('queryStringParameters'):
      params.update(self.event.get('queryStringParameters', {}))
    err, res = self.check_params(params, mandatory, optional)
    if err:
      logger.error(err)
      return err, False
    else:
      self.params.update(res)
      return None, True

  @staticmethod
  def operation_not_authorised():
    logger.info('Operation not authorised')
    err = ValueError('Operation not authorised')
    err.status_code = '401'
    return err, False

  @staticmethod
  def check_params(params, mandatory, optional):
    """
    Check request params
    :param params: Params to verify
    :param mandatory:
    :param optional:
    :return:
    """
    values = {}
    missing = []
    for param in mandatory:
      value = params.get(param)
      if not value:
        missing.append(param)
      else:
        values[param] = value
    for param in optional:
      value = params.get(param)
      if param in params:
        values[param] = value
    if missing:
      msg = 'Empty or missing mandatory parameter(s): %s' % ', '.join(missing)
      return ValueError(msg), None
    else:
      return None, values
