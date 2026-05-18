import subprocess
import os
import sys
import shutil
from shutil import which


def run(cmd):
    result = subprocess.run(cmd, text=True, capture_output=True)
    if result.returncode != 0:
        print(result.stderr)
        sys.exit(result.returncode)
    return result.stdout.strip()


def get_branch_name():
    return run(["git", "rev-parse", "--abbrev-ref", "HEAD"])


def safe_branch_name(name: str) -> str:
    return name.replace("/", "-").replace("\\", "-")


def find_yarn():
    return which("yarn") or which("yarn.cmd")


def copy_file(src, dst):
    if os.path.exists(src):
        print(f"Copying {src} -> {dst}")
        shutil.copyfile(src, dst)


def main():
    branch = get_branch_name()
    safe_branch = safe_branch_name(branch)

    yarn_lock = "yarn.lock"
    branch_lock = f"yarn.{safe_branch}.lock"

    yarn_path = find_yarn()
    if not yarn_path:
        print("Error: Yarn not found in PATH.")
        sys.exit(1)

    # Step 1: restore branch lock if it exists
    if os.path.exists(branch_lock):
        print(f"Restoring branch lock: {branch_lock} -> {yarn_lock}")
        copy_file(branch_lock, yarn_lock)
    else:
        print("No branch lock found, using existing yarn.lock (if any)")

    # Step 2: run install
    print("Running yarn install...")
    subprocess.run([yarn_path, "install"], check=True)

    # Step 3: save updated lock back to branch snapshot
    if os.path.exists(yarn_lock):
        print(f"Saving updated lock: {yarn_lock} -> {branch_lock}")
        copy_file(yarn_lock, branch_lock)
    else:
        print("Warning: yarn.lock not found after install")


if __name__ == "__main__":
    main()
