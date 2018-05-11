#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright (c) 2018 Virtual Cable S.L.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without modification,
# are permitted provided that the following conditions are met:
#
#    * Redistributions of source code must retain the above copyright notice,
#      this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above copyright notice,
#      this list of conditions and the following disclaimer in the documentation
#      and/or other materials provided with the distribution.
#    * Neither the name of Virtual Cable S.L. nor the names of its contributors
#      may be used to endorse or promote products derived from this software
#      without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import os
import shutil
import glob
import re

DIST = 'dist'
SRC = 'src'
UDS = os.path.join(DIST, 'uds')
STATIC = 'static/modern'
TEMPLATE = 'templates/uds/modern'


def mkPath(path):
    folder = ''
    for p in path.split(os.path.sep):
        folder = os.path.join(folder, p)
        try:
            os.mkdir(folder)
        except OSError as e:
            pass  # Already exits, ignore


def locateHtmlFiles():
    def locator(files, folder):
        for f in glob.glob(folder+"/*"):
            if os.path.isdir(f):
                # Recurse
                locator(files, os.path.join(f))
            else:
                if os.path.splitext(f)[1] == '.html':
                    files.append(f)
    files = []
    locator(files, SRC)
    return files


def fixIndex():
    print('Fixing index.html...')
    translations = '<script src="{% url \'uds.web.views.jsCatalog\' LANGUAGE_CODE %}"></script>'
    jsdata = '{% jsdata %}'
    # Change index.html, to include django required staff
    translatePattern = re.compile(
        '<!-- DYNAMIC_DATA -->.*<!-- ENDDYNAMIC_DATA -->', re.MULTILINE | re.DOTALL)
    with open(os.path.join(DIST, 'index.html'), 'r', encoding='utf8') as f:
        html = f.read()
    # include django headers
    html = '{% load uds %}{% get_current_language as LANGUAGE_CODE %}' + html
    with open(os.path.join(os.path.join(UDS, TEMPLATE), 'index.html'), 'w', encoding='utf8') as f:
        f.write(translatePattern.sub(translations + jsdata, html))


def extractTranslations():
    print('Extracting translations...')
    # Generate "fake" translations file (just to use django translator)
    translatePattern = re.compile(
        '<uds-translate>(.*?)</uds-translate>', re.MULTILINE | re.IGNORECASE | re.DOTALL)
    with open(os.path.join(os.path.join(UDS, STATIC), 'translations-fakejs.js'), 'w', encoding='utf8') as output:
        print('// "Fake" javascript file for translations', file=output)
        for htmlFile in locateHtmlFiles():
            with open(htmlFile, 'r', encoding='utf8') as f:
                html = f.read()
                # Locate <uds-translate>...</uds-translate> patterns and extract strings
                for v in translatePattern.finditer(html):
                    print('gettext("{}");'.format(v.groups()[0]), file=output)


def organize():
    print('Organizing content')
    for f in glob.glob(DIST + '/*'):
        if os.path.isdir(f):
            continue    # Skip folders
        if os.path.splitext(f)[1] == '.html':
            continue    # Also skip html
        shutil.copy(f, os.path.join(UDS, STATIC))


def cleanUp():
    print('Cleaning up unneeded content')
    folder = os.path.join(UDS, STATIC)
    os.unlink(os.path.join(folder, 'favicon.ico'))


def createDirs():
    try:
        print('Crating output uds dir...')
        os.mkdir(UDS)
    except OSError:
        print('Already exists, cleaning content')
        shutil.rmtree(UDS)  # Clean UDS dir
        os.mkdir(UDS)

    # Static folders
    mkPath(os.path.join(UDS, STATIC))
    mkPath(os.path.join(UDS, TEMPLATE))


def main():
    createDirs()
    extractTranslations()
    fixIndex()
    organize()
    cleanUp()


# Updades index.html
if __name__ == "__main__":
    main()
