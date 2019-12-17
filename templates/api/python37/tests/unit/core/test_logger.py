import unittest
import json
import datetime

from src.core.logger import create_logger
import src.core.config as config

try:
    from StringIO import StringIO
except ImportError:
    # Python 3 Support
    from io import StringIO


class TestLogger(unittest.TestCase):

    def setUp(self):
        self.buffer = StringIO()
        self.logger = create_logger('test-logging', self.buffer)
        config.global_context = {}

    def test_default_format(self):
        msg = "testing logging format"
        self.logger.info(msg)
        log_json = json.loads(self.buffer.getvalue())

        self.assertEqual(log_json["message"], msg)
        self.assertEqual(log_json.get("context"), config.global_context)

    def test_default_format_with_context(self):
        config.global_context = {'test': 'testValue'}
        msg = "testing logging format"
        self.logger.info(msg)
        log_json = json.loads(self.buffer.getvalue())

        self.assertEqual(log_json["message"], msg)
        self.assertEqual(log_json.get("context"), config.global_context)

    def test_json_default_encoder(self):
        msg = {"adate": datetime.datetime(1999, 12, 31, 23, 59),
               "otherdate": datetime.date(1789, 7, 14),
               "otherdatetime": datetime.datetime(1789, 7, 14, 23, 59),
               "otherdatetimeagain": datetime.datetime(1900, 1, 1)}
        self.logger.info(msg)
        log_json = json.loads(self.buffer.getvalue())
        self.assertEqual(log_json.get("adate"), "1999-12-31T23:59:00")
        self.assertEqual(log_json.get("otherdate"), "1789-07-14")
        self.assertEqual(log_json.get("otherdatetime"), "1789-07-14T23:59:00")
        self.assertEqual(log_json.get("otherdatetimeagain"),
                         "1900-01-01T00:00:00")
        self.assertEqual(log_json.get("context"), config.global_context)

    def test_log_a_dict(self):
        msg = {"text": "testing logging", "num": 1, 5: "9",
               "nested": {"more": "data"}}
        self.logger.info(msg)
        log_json = json.loads(self.buffer.getvalue())
        self.assertEqual(log_json.get("text"), msg["text"])
        self.assertEqual(log_json.get("num"), msg["num"])
        self.assertEqual(log_json.get("5"), msg[5])
        self.assertEqual(log_json.get("nested"), msg["nested"])
        self.assertEqual(log_json["message"], None)
        self.assertEqual(log_json.get("context"), config.global_context)

    def test_log_extra(self):
        extra = {"text": "testing logging", "num": 1, 5: "9",
                 "nested": {"more": "data"}}
        self.logger.info("hello", extra=extra)
        log_json = json.loads(self.buffer.getvalue())
        self.assertEqual(log_json.get("text"), extra["text"])
        self.assertEqual(log_json.get("num"), extra["num"])
        self.assertEqual(log_json.get("5"), extra[5])
        self.assertEqual(log_json.get("nested"), extra["nested"])
        self.assertEqual(log_json["message"], "hello")
        self.assertEqual(log_json.get("context"), config.global_context)

    def test_ensure_ascii_true(self):
        self.logger.info('Привет')
        msg = self.buffer.getvalue().split('"message": "', 1)[1].split('"', 1)[0]
        self.assertEqual(msg, r"\u041f\u0440\u0438\u0432\u0435\u0442")




