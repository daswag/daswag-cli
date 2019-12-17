import logging

import src.core.config as config

from functools import wraps
from src.main import logger, get_resource
from src.core.request import Request
from src.core.response import response
from src.core.request import DEBUG_HEADER


def api_endpoint():
  """Decorate a lambda function endpoint with user access checking"""
  def decorator(func):
    @wraps(func)
    def decorated(event, context):
      try:
        # Create ApiRequest layer and init context
        # Get DB Session
        resource = get_resource()
        req = Request(event=event, aws_request_id=context.aws_request_id, resource=resource)
        req.set_request_context()

        # Assign request to context
        context.request = req

        # Update logging level
        if DEBUG_HEADER in config.global_context and config.global_context[DEBUG_HEADER] == 'true':
          logger.setLevel(logging.DEBUG)
        else:
          logger.setLevel(logging.INFO)

        # Call method and manage session in case of error
        err, res = func(event, context, resource)
      except Exception as e:
        logger.error(e)
        err, res = e, None
        err.status_code = '500'

      return response(err, res)
    return decorated
  return decorator
