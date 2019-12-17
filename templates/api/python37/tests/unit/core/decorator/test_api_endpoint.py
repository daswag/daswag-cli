import unittest
import mock

from src.core.decorator.api_endpoint import api_endpoint
from src.main import init

init()


class TestApiEndpoint(unittest.TestCase):

    def test_api_endpoint_without_parameters(self):

        def dummy_func(event, context, resource):
            pass
        dummy_func(None, None, None)

        # Call api_endpoint without parameters
        dummy_func = api_endpoint()(dummy_func)
        dummy_func({}, mock.MagicMock())
