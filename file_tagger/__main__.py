import os
import shutil
import subprocess
import sys


def main() -> None:
    node_cli = shutil.which("file-tagger")
    if not node_cli:
        raise SystemExit(
            "file-tagger CLI not found. Install it first with: npm install -g file-tagger"
        )

    result = subprocess.run([node_cli, *sys.argv[1:]], check=False)
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
