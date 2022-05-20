var udsData = {
  "actors": [{
    "url": "/idown/3ca8c66a-bae0-5b4b-a6c9-04e5f629e73d",
    "name": "udsactor-3.x.x-DEVEL-1.noarch.rpm",
    "description": "UDS Actor for Centos, Fedora, RH, ... Linux machines <b>(Requires python 2.7)</b>"
  }, {
    "url": "/idown/e4762fa1-87ab-57e8-9407-502ce3675f7c",
    "name": "RDSActorSetup-3.x.x-DEVEL.exe",
    "description": "RDS UDS Actor (for remote apps on Windows Server 2012 and 2016)"
  }, {
    "url": "/idown/5ecccab6-b95b-554f-8a9c-8905d2828246",
    "name": "udsactor_3.x.x-DEVEL_all.deb",
    "description": "UDS Actor for Debian, Ubuntu, ... Linux machines <b>(Requires python 2.7)</b>"
  }, {
    "url": "/idown/fa713816-525f-52fc-b3a7-955cc6f35143",
    "name": "UDSActorSetup-3.x.x-DEVEL.exe",
    "description": "UDS Actor for windows machines"
  }, {
    "url": "/idown/64ca757e-7aaa-5655-9c0d-fea70db80739",
    "name": "udsactor-opensuse-3.x.x-DEVEL-1.noarch.rpm",
    "description": "UDS Actor for openSUSE, ... Linux machines <b>(Requires python 2.7)</b>"
  }],
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
    "role": "staff",
    "user": "172.27.0.8"
  },
  "config": {
    "version_stamp": "20180831-DEVEL",
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
    "language": "en",
    "os": "Windows",
    "version": "3.x.x-DEVEL",
    "authenticators": [{
      "name": "00-AD W2012 REGEXP",
      "priority": 1,
      "id": "d875c59c-7e19-5e3d-afac-f52f54789f10",
      "is_custom": false,
      "label": "adregexp"
    }, {
      "name": "AD",
      "priority": 1,
      "id": "fbf0727a-e754-5f17-a0fd-bd8c1850b355",
      "is_custom": false,
      "label": "ad"
    }, {
      "name": "Casa",
      "priority": 2,
      "id": "3613AA7E-E32A-5D05-BCFE-4E2C3E735EE3",
      "is_custom": true,
      "label": "casa"
    }, {
      "name": "different",
      "priority": 1,
      "id": "9EB0689D-DF66-54FF-8E7A-3C11E3F42A1A",
      "is_custom": false,
      "label": "differ"
    }, {
      "name": "Interna",
      "priority": -2,
      "id": "9803FC06-D8B3-5F11-9A6E-EEC905C017FD",
      "is_custom": false,
      "label": "int"
    }, {
      "name": "Ldap AD por RegEx",
      "priority": 1,
      "id": "53a53965-8a90-5e3b-96c4-91937d0042f0",
      "is_custom": false,
      "label": "read"
    }, {
      "name": "Ldap AUTH",
      "priority": 1,
      "id": "729B2DB5-115F-5AA6-8C0A-32F3FBACF1D4",
      "is_custom": false,
      "label": "sldap"
    }, {
      "name": "LDAP UCA",
      "priority": 1,
      "id": "4A574A66-65DD-5B6B-8D6F-5A53B95A0A58",
      "is_custom": false,
      "label": "luca"
    }, {
      "name": "Red invalida",
      "priority": 1,
      "id": "9f111569-d608-5426-b9f7-a9b4b928fd2d",
      "is_custom": true,
      "label": "inval"
    }, {
      "name": "SAM",
      "priority": 1,
      "id": "35698ffd-597a-5daa-9699-c87abed274f0",
      "is_custom": true,
      "label": "sam"
    }, {
      "name": "saml",
      "priority": 1,
      "id": "8e2d796e-5f69-55c7-86c9-ccc1437ae8fe",
      "is_custom": true,
      "label": "saml2"
    }, {
      "name": "SAMLOCAL",
      "priority": 1,
      "id": "cd996fec-fd5a-59eb-9eb4-ec28af3cc8f7",
      "is_custom": true,
      "label": "saml"
    }, {
      "name": "test",
      "priority": 1,
      "id": "3EAC3F30-0148-5041-986D-CE25737FEF81",
      "is_custom": false,
      "label": "test"
    }],
    "urls": {
      "services": "/modern/services/",
      "login": "/modern/login/",
      "customAuth": "/customAuth/",
      "admin": "/adm/",
      "changeLang": "/i18n/setlang/",
      "logout": "/modern/logout/"
    }
  }
};
