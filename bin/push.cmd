@echo off

git submodule foreach "git push --follow-tags"
git push --follow-tags