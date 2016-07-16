#!/bin/bash
set -ev
if [ "${TEST_SUITE}" = "installer" ]; then
	gulp build-release
  npm run dist
fi


if [ "${TEST_SUITE}" = "tests" ]; then
	gulp test
fi