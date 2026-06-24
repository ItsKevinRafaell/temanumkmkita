"""TemanUMKMKita test runner — verify all test files pass."""
import subprocess, sys, json
from pathlib import Path

TESTS_DIR = Path(__file__).resolve().parent

def main():
    results = {}
    for test_file in sorted(TESTS_DIR.glob("test_*.py")):
        r = subprocess.run(
            [sys.executable, "-m", "pytest", str(test_file), "-v", "--tb=short", "-q"],
            capture_output=True, text=True, cwd=str(TESTS_DIR.parent)
        )
        passed = r.returncode == 0
        results[test_file.name] = {
            "passed": passed,
            "stdout": r.stdout.strip()[-200:] if r.stdout else "",
            "stderr": r.stderr.strip()[-200:] if r.stderr else "",
        }
        status = "PASS" if passed else "FAIL"
        print(f"  [{status}] {test_file.name}")

    total = len(results)
    passed = sum(1 for r in results.values() if r["passed"])
    print(f"\nResults: {passed}/{total} test files passing")

    failed = [n for n, r in results.items() if not r["passed"]]
    if failed:
        print(f"\nFailed files: {', '.join(failed)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
