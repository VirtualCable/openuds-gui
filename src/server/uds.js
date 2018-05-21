var udsData = {
  "plugins": [{
    "name": "Windows",
    "description": "Windows plugin",
    "url": "/static/clients/UDSClientSetup-3.x.x-DEVEL.exe"
  }, {
    "name": "MacOS",
    "description": "Mac OS X plugin",
    "url": "/static/clients/UDSClient-3.x.x-DEVEL.pkg"
  }, {
    "name": "Linux",
    "description": "Debian based Linux (requires Python-2.7)",
    "url": "/static/udsclient_3.x.x-DEVEL_all.deb"
  }, {
    "name": "Linux",
    "description": "Red Hat based Linux (RH, Fedora, Centos, ...) (requires Python-2.7)",
    "url": "/static/udsclient-3.x.x-DEVEL-1.noarch.rpm"
  }, {
    "name": "Linux",
    "description": "Suse based Linux (requires Python-2.7)",
    "url": "/static/udsclient-opensuse-3.x.x-DEVEL-1.noarch.rpm"
  }, {
    "name": "Linux",
    "description": "Generic .tar.gz Linux (requires Python-2.7)",
    "url": "/static/udsclient-3.x.x-DEVEL.tar.gz"
  }],
  "config": {
    "urls": {
      "login": "/login/",
      "logout": "/logout",
      "lang": "/i18n/setlang/"
    },
    "language": "en",
    "authenticators": [{
      "priority": 1,
      "id": "d875c59c-7e19-5e3d-afac-f52f54789f10",
      "label": "adregexp",
      "is_custom": false,
      "name": "00-AD W2012 REGEXP"
    }, {
      "priority": 1,
      "id": "fbf0727a-e754-5f17-a0fd-bd8c1850b355",
      "label": "ad",
      "is_custom": false,
      "name": "AD"
    }, {
      "priority": 2,
      "id": "3613AA7E-E32A-5D05-BCFE-4E2C3E735EE3",
      "label": "casa",
      "is_custom": true,
      "name": "Casa"
    }, {
      "priority": 1,
      "id": "9EB0689D-DF66-54FF-8E7A-3C11E3F42A1A",
      "label": "differ",
      "is_custom": false,
      "name": "different"
    }, {
      "priority": -2,
      "id": "9803FC06-D8B3-5F11-9A6E-EEC905C017FD",
      "label": "int",
      "is_custom": false,
      "name": "Interna"
    }, {
      "priority": 1,
      "id": "53a53965-8a90-5e3b-96c4-91937d0042f0",
      "label": "read",
      "is_custom": false,
      "name": "Ldap AD por RegEx"
    }, {
      "priority": 1,
      "id": "729B2DB5-115F-5AA6-8C0A-32F3FBACF1D4",
      "label": "sldap",
      "is_custom": false,
      "name": "Ldap AUTH"
    }, {
      "priority": 1,
      "id": "4A574A66-65DD-5B6B-8D6F-5A53B95A0A58",
      "label": "luca",
      "is_custom": false,
      "name": "LDAP UCA"
    }, {
      "priority": 1,
      "id": "9f111569-d608-5426-b9f7-a9b4b928fd2d",
      "label": "inval",
      "is_custom": true,
      "name": "Red invalida"
    }, {
      "priority": 1,
      "id": "35698ffd-597a-5daa-9699-c87abed274f0",
      "label": "sam",
      "is_custom": true,
      "name": "SAM"
    }, {
      "priority": 1,
      "id": "8e2d796e-5f69-55c7-86c9-ccc1437ae8fe",
      "label": "saml2",
      "is_custom": true,
      "name": "saml"
    }, {
      "priority": 1,
      "id": "cd996fec-fd5a-59eb-9eb4-ec28af3cc8f7",
      "label": "saml",
      "is_custom": true,
      "name": "SAMLOCAL"
    }, {
      "priority": 1,
      "id": "3EAC3F30-0148-5041-986D-CE25737FEF81",
      "label": "test",
      "is_custom": false,
      "name": "test"
    }],
    "csrf": "TX38YikWuXAmThwdOM9gbbjTnDffQQewl57xH7IVFJTEIbHdYDO0bwoI9uWuhuiI",
    "csrf_field": "csrfmiddlewaretoken",
    "os": "Windows",
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
    }]
  },
  "actors": [],
  "profile": {
    "user": null,
    "role": "user"
  }
};
