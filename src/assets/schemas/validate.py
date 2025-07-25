"""Transpilation and validation script for GHGA metadata files."""

import io
import os
import sys
import traceback
from contextlib import redirect_stderr, redirect_stdout

original_argv = list(sys.argv)
schema_filename, in_filename = args_js.to_py() 

def validate():
    """Validate the JSON using schemapack."""

    success = False
    stdout = io.StringIO()
    stderr = io.StringIO()

    print("[Python] DEBUG: Preparing to call schemapack's validate function...")
    sys.argv = [
        "schemapack",
        "validate",
        "--schemapack",
        schema_filename,
        "--datapack",
        in_filename,
    ]
    print(f"[Python] DEBUG: sys.argv set to: {sys.argv}")

    try:
        print("[Python] DEBUG: Importing schemapack.cli.cli ...")
        from schemapack.__main__ import cli as schemapack_main_func

        print(
            "[Python] DEBUG: schemapack.cli.cli imported. Calling schemapack_main_func()..."
        )

        # Redirect stdout/stderr for schemapack specifically
        with redirect_stdout(stdout), redirect_stderr(stderr):
            schemapack_main_func()  # This will parse sys.argv

        # Determine validation success based on exit code or stderr content
        errors = stderr.getvalue().strip()
        success = "error" not in errors.lower()

        print(
            f"[Python] DEBUG: schemapack call completed (no SystemExit caught here). Stderr check: '{errors[:100]}...'"
        )

    except SystemExit as e:
        if e.code == 0:
            success = True
            print(
                "[Python] DEBUG: schemapack SystemExit with code 0 (validation success)."
            )
        else:
            success = False
            print(
                f"[Python] DEBUG: schemapack SystemExit with code {e.code} (validation failure)."
            )
    except ImportError as e:
        stderr.write(f"ImportError during schemapack: {str(e)}")
        print(f"[Python] DEBUG: schemapack ImportError: {stderr.getvalue()}")
    except Exception as e:
        tb = traceback.format_exc()
        stderr.write(
            f"Exception during schemapack: {type(e).__name__}: {str(e)}\nTraceback:\n{tb}"
        )
        print(f"[Python] DEBUG: schemapack Exception: {stderr.getvalue()}")
    finally:
        sys.argv = original_argv
        print("[Python] DEBUG: schemapack validation block finished.")

    return {
        "success": success,
        "output": stdout.getvalue(),
        "error_message": stderr.getvalue(),
    }

def main():
    """Main entry point for the validation script."""
    print("[Python] DEBUG: Starting Schemapack validation script...")

    results = validate()
    success= results["success"]
    if success:
        print(
            "[Python] DEBUG: Validation successful."
        )
    else:
        print(
            "[Python] DEBUG: Validation failed."
        )
    return results

main()
