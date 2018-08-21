var udsData = {
  "plugins": [{
    "url": "/static/clients/UDSClientSetup-3.x.x-DEVEL.exe",
    "name": "Windows",
    "description": "Windows plugin"
  }, {
    "url": "/static/clients/UDSClient-3.x.x-DEVEL.pkg",
    "name": "MacOS",
    "description": "Mac OS X plugin"
  }, {
    "url": "/static/udsclient_3.x.x-DEVEL_all.deb",
    "name": "Linux",
    "description": "Debian based Linux (requires Python-2.7)"
  }, {
    "url": "/static/udsclient-3.x.x-DEVEL-1.noarch.rpm",
    "name": "Linux",
    "description": "Red Hat based Linux (RH, Fedora, Centos, ...) (requires Python-2.7)"
  }, {
    "url": "/static/udsclient-opensuse-3.x.x-DEVEL-1.noarch.rpm",
    "name": "Linux",
    "description": "Suse based Linux (requires Python-2.7)"
  }, {
    "url": "/static/udsclient-3.x.x-DEVEL.tar.gz",
    "name": "Linux",
    "description": "Generic .tar.gz Linux (requires Python-2.7)"
  }],
  "profile": {
    "user": null,
    "role": "user"
  },
  "urls": {
    "customAuth": "/customAuth/"
  },
  "config": {
    "authenticators": [{
      "label": "adregexp",
      "is_custom": false,
      "name": "00-AD W2012 REGEXP",
      "id": "d875c59c-7e19-5e3d-afac-f52f54789f10",
      "priority": 1
    }, {
      "label": "ad",
      "is_custom": false,
      "name": "AD",
      "id": "fbf0727a-e754-5f17-a0fd-bd8c1850b355",
      "priority": 1
    }, {
      "label": "casa",
      "is_custom": true,
      "name": "Casa",
      "id": "3613AA7E-E32A-5D05-BCFE-4E2C3E735EE3",
      "priority": 2
    }, {
      "label": "differ",
      "is_custom": false,
      "name": "different",
      "id": "9EB0689D-DF66-54FF-8E7A-3C11E3F42A1A",
      "priority": 1
    }, {
      "label": "int",
      "is_custom": false,
      "name": "Interna",
      "id": "9803FC06-D8B3-5F11-9A6E-EEC905C017FD",
      "priority": -2
    }, {
      "label": "read",
      "is_custom": false,
      "name": "Ldap AD por RegEx",
      "id": "53a53965-8a90-5e3b-96c4-91937d0042f0",
      "priority": 1
    }, {
      "label": "sldap",
      "is_custom": false,
      "name": "Ldap AUTH",
      "id": "729B2DB5-115F-5AA6-8C0A-32F3FBACF1D4",
      "priority": 1
    }, {
      "label": "luca",
      "is_custom": false,
      "name": "LDAP UCA",
      "id": "4A574A66-65DD-5B6B-8D6F-5A53B95A0A58",
      "priority": 1
    }, {
      "label": "inval",
      "is_custom": true,
      "name": "Red invalida",
      "id": "9f111569-d608-5426-b9f7-a9b4b928fd2d",
      "priority": 1
    }, {
      "label": "sam",
      "is_custom": true,
      "name": "SAM",
      "id": "35698ffd-597a-5daa-9699-c87abed274f0",
      "priority": 1
    }, {
      "label": "saml2",
      "is_custom": true,
      "name": "saml",
      "id": "8e2d796e-5f69-55c7-86c9-ccc1437ae8fe",
      "priority": 1
    }, {
      "label": "saml",
      "is_custom": true,
      "name": "SAMLOCAL",
      "id": "cd996fec-fd5a-59eb-9eb4-ec28af3cc8f7",
      "priority": 1
    }, {
      "label": "test",
      "is_custom": false,
      "name": "test",
      "id": "3EAC3F30-0148-5041-986D-CE25737FEF81",
      "priority": 1
    }],
    "urls": {
      "changeLang": "/i18n/setlang/",
      "login": "/login/",
      "logout": "/logout"
    },
    "language": "en",
    "csrf_field": "csrfmiddlewaretoken",
    "os": "Unknown",
    "available_languages": [{
      "name": "Spanish",
      "id": "es"
    }, {
      "name": "English",
      "id": "en"
    }, {
      "name": "French",
      "id": "fr"
    }, {
      "name": "German",
      "id": "de"
    }, {
      "name": "Portuguese",
      "id": "pt"
    }, {
      "name": "Italian",
      "id": "it"
    }, {
      "name": "Basque",
      "id": "eu"
    }, {
      "name": "Arabian",
      "id": "ar"
    }, {
      "name": "Russian",
      "id": "ru"
    }, {
      "name": "Catalan",
      "id": "ca"
    }],
    "csrf": "qXZDMXz5VCXKijMb4Olx2hyVzJL8cirNNBKtVGTivRZl8mlagGIq08ov3ScIxhUn"
  },
  "actors": []
};
