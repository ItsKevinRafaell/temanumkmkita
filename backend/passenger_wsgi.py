import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from deploy.wsgi_app import application
