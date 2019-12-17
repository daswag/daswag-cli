"""Setup application information"""
from setuptools import setup, find_packages
from os import path
# io.open is needed for projects that support Python 2.7
# It ensures open() defaults to text mode with universal newlines,
# and accepts an argument to specify the text encoding
# Python 3 only projects can skip this import
from io import open

here = path.abspath(path.dirname(__file__))

with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

with open(path.join(here, 'VERSION'), encoding='utf-8') as v:
    version = v.read()

REQUIRED_EGGS = [
    'boto3',
]

DEV_REQUIRED_EGGS = []
TEST_REQUIRED_EGGS = []

setup(
    name='<%= baseNameCamelCase %>',
    version=version,
    long_description=long_description,
    long_description_content_type='text/markdown',
    author="daSWAG",
    author_email='',
    url='',
    packages=find_packages(exclude=['docs', 'tests', 'specs']),
    namespace_packages=['src'],
    install_requires=REQUIRED_EGGS,
    extras_require=dict(
        test=REQUIRED_EGGS + DEV_REQUIRED_EGGS + TEST_REQUIRED_EGGS,
        dev=REQUIRED_EGGS + DEV_REQUIRED_EGGS),
    zip_safe=False,
    project_urls={  # Optional
        'Bug Reports': 'https://github.com/daswag/daswag-cli/issues',
        'Source': 'https://github.com/daswag/daswag-cli/',
    }
)
