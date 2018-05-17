// Simple test data
var udsData = {
  "profile": {
    "csrf": "Sk0qbYaiV2W4kY2LfFZQ9TTrzZ7eiYLGpuAdBJkFMMgv0gZDbJeLifILZWvd32xo",
    "user": "172.27.0.8",
    "role": "staff"
  },
  "plugins": [{
    "os": "Windows",
    "url": "/static/clients/UDSClientSetup-3.x.x-DEVEL.exe",
    "description": "Windows plugin"
  }, {
    "os": "MacOS",
    "url": "/static/clients/UDSClient-3.x.x-DEVEL.pkg",
    "description": "Mac OS X plugin"
  }, {
    "os": "Linux",
    "url": "/static/udsclient_3.x.x-DEVEL_all.deb",
    "description": "Debian based Linux (requires Python-2.7)"
  }, {
    "os": "Linux",
    "url": "/static/udsclient-3.x.x-DEVEL-1.noarch.rpm",
    "description": "Red Hat based Linux (RH, Fedora, Centos, ...) (requires Python-2.7)"
  }, {
    "os": "Linux",
    "url": "/static/udsclient-opensuse-3.x.x-DEVEL-1.noarch.rpm",
    "description": "Suse based Linux (requires Python-2.7)"
  }, {
    "os": "Linux",
    "url": "/static/udsclient-3.x.x-DEVEL.tar.gz",
    "description": "Generic .tar.gz Linux (requires Python-2.7)"
  }],
  "config": {
    "csrf_field": "csrfmiddlewaretoken",
    "available_languages": [{
      "id": "es",
      "name": "Spanish"
    }, {
      "id": "en",
      "name": "English"
    }, {
      "id": "fr",
      "name": "French"
    }, {
      "id": "de",
      "name": "German"
    }, {
      "id": "pt",
      "name": "Portuguese"
    }, {
      "id": "it",
      "name": "Italian"
    }, {
      "id": "eu",
      "name": "Basque"
    }, {
      "id": "ar",
      "name": "Arabian"
    }, {
      "id": "ca",
      "name": "Catalan"
    }],
    "os": "Windows",
    "change_lang_url": "/i18n/setlang/",
    "language": "en"
  }
};
