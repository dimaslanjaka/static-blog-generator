@echo off

yarn workspace sbg-site-test run clean
yarn workspace sbg-site-test run post:standalone
yarn workspace sbg-site-test run post:copy
yarn workspace sbg-site-test run build