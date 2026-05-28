import subprocess
import os
import sys
import shutil
from shutil import which
import argparse


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
    if os.name == "nt":
        return which("yarn.cmd") or which("yarn")

    return which("yarn") or which("yarn.cmd")


def copy_file(src, dst):
    if os.path.exists(src):
        print(f"Copying {src} -> {dst}")
        shutil.copyfile(src, dst)


def empty_file(path):
    print(f"Emptying file: {path}")
    open(path, "w").close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--up", nargs=argparse.REMAINDER, help="Run yarn up with packages"
    )
    args = parser.parse_args()

    branch = get_branch_name()
    safe_branch = safe_branch_name(branch)

    yarn_lock = "yarn.lock"
    branch_lock = f"yarn.{safe_branch}.lock"

    yarn_path = find_yarn()
    if not yarn_path:
        print("Error: Yarn not found in PATH.")
        sys.exit(1)

    branch_lock_exists = os.path.exists(branch_lock)
    yarn_lock_exists = os.path.exists(yarn_lock)

    # Step 1: restore branch lock if it exists
    if branch_lock_exists:
        print(f"Restoring branch lock: {branch_lock} -> {yarn_lock}")
        copy_file(branch_lock, yarn_lock)
    else:
        print("No branch lock found.")

        if yarn_lock_exists:
            print("Existing yarn.lock found but no branch lock -> resetting yarn.lock")
            empty_file(yarn_lock)

    # Step 2: run yarn command
    if args.up:
        print(f"Running yarn up {' '.join(args.up)} ...")
        subprocess.run([yarn_path, "up", *args.up], check=True)
    else:
        print("Running yarn install...")
        subprocess.run([yarn_path, "install"], check=True)

    # Step 3: save updated lock back to branch snapshot
    if os.path.exists(yarn_lock):
        print(f"Saving updated lock: {yarn_lock} -> {branch_lock}")
        copy_file(yarn_lock, branch_lock)
    else:
        print("Warning: yarn.lock not found after install/up")


if __name__ == "__main__":
    main()
