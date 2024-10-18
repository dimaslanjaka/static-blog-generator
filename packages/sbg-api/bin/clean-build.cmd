@echo off

call yarn workspaces foreach --worktree --exclude sbg-api --no-private run clean
call yarn workspaces foreach --worktree --exclude sbg-api --no-private run build
call npm run clean