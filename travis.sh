#!/bin/bash
set -ev
if [ "${TEST_SUITE}" = "tests" ]; then
  export CHROME_BIN=chromium-browser
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
	gulp test
else
  gulp build-release
  gulp rename-index
  npm run dist
  gulp rename-index-back
fi