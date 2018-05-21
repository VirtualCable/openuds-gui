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
        except OSError:
            pass  # Already exits, ignore

def locateFiles(files, folder, extension):
    for f in glob.glob(folder+"/*"):
        if os.path.isdir(f):
            # Recurse
            locateFiles(files, os.path.join(f), extension)
        else:
            if os.path.splitext(f)[1][1:].lower() == extension:
                files.append(f)

def locateHtmlFiles():
    files = []
    locateFiles(files, SRC, 'html')
    return files

def locateTypeScriptFiles():
    files = []
    locateFiles(files, SRC, 'ts')
    return files

def fixIndex():
    print('Fixing index.html...')
    translations = '<script type="text/javascript" src="{% url \'uds.web.views.jsCatalog\' LANGUAGE_CODE %}"></script>'
    jsdata = '<script type="text/javascript" src="{% url \'uds.js\' %}"></script>'
    # Change index.html, to include django required staff
    translatePattern = re.compile(
        '<!-- DYNAMIC_DATA -->.*<!-- ENDDYNAMIC_DATA -->', re.MULTILINE | re.DOTALL)
    with open(os.path.join(DIST, 'index.html'), 'r', encoding='utf8') as f:
        html = f.read()
    # include django headers
    html = '{% load uds i18n %}{% get_current_language as LANGUAGE_CODE %}' + html
    # Change <html lang="en"> with {{ LANGUAGE_CODE }}
    html = re.sub('<html lang="en">', '<html lang="{{ LANGUAGE_CODE }}">', html)
    with open(os.path.join(os.path.join(UDS, TEMPLATE), 'index.html'), 'w', encoding='utf8') as f:
        f.write(translatePattern.sub(translations + jsdata, html))


def extractTranslations():
    print('Extracting translations from HTML')
    # Generate "fake" translations file (just to use django translator)

    def getTranslations(locator, pattern):
        for fileName in locator():
            with open(fileName, 'r', encoding='utf8') as f:
                data = f.read()
                # Locate pattern
                for v in pattern.finditer(data):
                    print('Found string {}'.format(v.groups()[0]))
                    print('gettext("{}");'.format(v.groups()[0]), file=output)

    with open(os.path.join(os.path.join(UDS, STATIC), 'translations-fakejs.js'), 'w', encoding='utf8') as output:
        print('// "Fake" javascript file for translations', file=output)

        # First, extract translations from typescript
        typeScriptTranslationPattern = re.compile(r'django\.gettext\(\s*[\'"]([^\'"]+)')
        print('// Typescript', file=output)
        getTranslations(locateTypeScriptFiles, typeScriptTranslationPattern)

        # Now extract translations from html
        htmlTranslationPattern = re.compile('<uds-translate>(.*?)</uds-translate>', re.MULTILINE | re.IGNORECASE | re.DOTALL)
        print('// HTML', file=output)
        getTranslations(locateHtmlFiles, htmlTranslationPattern)

def organize():
    print('Organizing content')
    for f in glob.glob(DIST + '/*'):
        if os.path.isdir(f):
            continue    # Skip folders
        if os.path.splitext(f)[1] == '.html':
            continue    # Also skip html
        shutil.copy(f, os.path.join(UDS, STATIC))

def cleanUp():
    print('Cleaning unneeded content')
    folder = os.path.join(UDS, STATIC)
    os.unlink(os.path.join(folder, 'favicon.ico'))


def createDirs():
    try:
        print('Creating output uds dir...')
        os.mkdir(UDS)
    except OSError:
        print('Already exists, cleaning content')
        shutil.rmtree(UDS)  # Clean UDS dir
        os.mkdir(UDS)

    # Static folders
    mkPath(os.path.join(UDS, STATIC))
    mkPath(os.path.join(UDS, TEMPLATE))

#
# def buildSource():
#    os.system('ng build --prod --output-hashing=none --aot --deleteOutputPath --build-optimizer --deploy-url /static/modern')

def main():
    print('Use "yarn build" to correctly build for UDS')
    # buildSource()
    createDirs()
    extractTranslations()
    fixIndex()
    organize()
    cleanUp()


# Updades index.html
if __name__ == "__main__":
    main()
