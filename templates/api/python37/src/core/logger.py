import os
import logging

from pythonjsonlogger import jsonlogger
import src.core.config as config


class ContextJsonFormatter(jsonlogger.JsonFormatter):

  def process_log_record(self, log_record):
    log_record["context"] = config.global_context
    # Old Style "super" since Python 2.6's logging.Formatter is old
    # style
    return jsonlogger.JsonFormatter.process_log_record(self, log_record)


def create_logger(name=None, stream=None):
  logger = logging.getLogger(name)
  logger.setLevel(logging.DEBUG if is_debug_enabled() else logging.INFO)
  logger.propagate = True

  log_handler = logging.StreamHandler(stream)
  log_handler.setFormatter(ContextJsonFormatter())
  logger.addHandler(log_handler)
  return logger


def is_debug_enabled():
  # disable debug logging by default, but allow override via env variables
  # or if enabled via forwarded request context
  return os.getenv("DEBUG_LOG", 'false') == 'true'
