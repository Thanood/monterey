#!/bin/bash
set -ev
if [ "${TEST_SUITE}" = "tests" ]; then
	gulp test
else
	gulp build-release
  npm run dist
fi