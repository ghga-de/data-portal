"""Transpilation and validation script for GHGA metadata files."""

import io
import os
import sys
import traceback
from contextlib import redirect_stderr, redirect_stdout

original_argv = list(sys.argv)
schema_filename, in_filename, out_filename = transpiler_args_js.to_py()  # noqa: F821


def transpile():
    """Transpile the input file using the ghga-transpiler."""
    success = False
    error_message = ""
    json_output = None

    print("[Python] DEBUG: Preparing to call ghga-transpiler's main function...")
    sys.argv = ["ghga_transpiler_cli.py", in_filename, out_filename]
    print(f"[Python] DEBUG: sys.argv set to: {sys.argv}")

    stderr = io.StringIO()

    try:
        with redirect_stderr(stderr):
            print("[Python] DEBUG: Importing run from ghga_transpiler.__main__ ...")
            from ghga_transpiler.__main__ import run as transpiler_run_func

            print(
                "[Python] DEBUG: ghga_transpiler.__main__.run imported. Calling transpiler_run_func()..."
            )
            transpiler_run_func()
            print(
                "[Python] DEBUG: ghga-transpiler transpiler_run_func() call finished."
            )

        if os.path.exists(out_filename):
            print(
                f"[Python] DEBUG: Output file {out_filename!r} exists. Size: {os.path.getsize(out_filename)}"
            )
            with open(out_filename, "r", encoding="utf-8") as f_out:
                json_output = f_out.read()
            success = True
            print(
                f"[Python] DEBUG: Successfully read JSON from '{out_filename}'. Length: {len(json_output) if json_output else 0}"
            )
        else:
            print(
                f"[Python] DEBUG: ERROR - Output file '{out_filename}' was NOT created by ghga-transpiler."
            )
            error_message = (
                f"Output file {out_filename!r} not found after transpilation."
            )

        errors = stderr.getvalue().strip()
        if errors:
            print(f"[Python] DEBUG: ghga-transpiler stderr content:\n{errors}")
            if error_message:
                error_message += "\n"
            if success:
                error_message += "Stderr warnings/info: "
            error_message += stderr_val

    except SystemExit as e:
        errors = stderr.getvalue()
        print(f"[Python] DEBUG: ghga-transpiler SystemExit with code: {e.code}")
        error_message = (
            f"ghga-transpiler SystemExit with code {e.code}.\nStderr: {errors}"
        )
        if e.code == 0 and os.path.exists(out_filename):
            if not json_output:
                with open(out_filename, "r", encoding="utf-8") as f_out_exit:
                    json_output = f_out_exit.read()
            success = True
            print(f"[Python] DEBUG: SystemExit 0, JSON read from '{out_filename}'.")
    except ImportError as e:
        print(
            f"[Python] DEBUG: ghga-transpiler ImportError: {type(e).__name__}: {str(e)}"
        )
        error_message = f"ImportError: {str(e)}\n{stderr.getvalue()}"
    except Exception as e:
        exception_type = type(e).__name__
        tb = traceback.format_exc()
        print(
            f"[Python] DEBUG: Exception during ghga-transpiler logic: {exception_type}: {str(e)}\nTraceback:\n{tb}"
        )
        if hasattr(e, "errno") and e.errno is not None:
            print(f"[Python] DEBUG: Caught Exception has errno: {e.errno}")
        error_message = f"Python Exception: {exception_type}: {str(e)}\nTraceback:\n{tb}\n{stderr.getvalue()}"
    finally:
        sys.argv = original_argv
        print("[Python] DEBUG: ghga-transpiler Python execution block finished.")

    if success and (json_output is None or json_output.strip() == ""):
        print(
            "[Python] DEBUG: Execution marked successful but no JSON content read from file. Overriding to failure."
        )
        success = False
        if not error_message:
            error_message = "Transpiler ran but produced no readable JSON output file."

    if not success and not error_message:
        error_message = (
            "Transpiler failed for an unknown reason. Check Python logs in console."
        )

    return {
        "success": success,
        "error_message": error_message,
        "json_output": json_output,
    }


def validate():
    """Validate the output JSON using schemapack."""

    validation_success = False
    stdout = io.StringIO()
    stderr = io.StringIO()

    print("[Python] DEBUG: Preparing to call schemapack's validate function...")
    sys.argv = [
        "schemapack",
        "validate",
        "--schemapack",
        schema_filename,
        "--datapack",
        out_filename,
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
        validation_success = "error" not in errors.lower()

        print(
            f"[Python] DEBUG: schemapack call completed (no SystemExit caught here). Stderr check: '{errors[:100]}...'"
        )

    except SystemExit as e:
        if e.code == 0:
            validation_success = True
            print(
                "[Python] DEBUG: schemapack SystemExit with code 0 (validation success)."
            )
        else:
            validation_success = False  # Explicit failure
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
        "validation_success": validation_success,
        "validation_stdout": stdout.getvalue(),
        "validation_stderr": stderr.getvalue(),
    }


def main():
    """Main entry point for the transpilation and validation script."""
    print("[Python] DEBUG: Starting ghga-transpiler execution script...")

    results = transpile()
    success, json_output = results["success"], results["json_output"]
    if success and json_output:
        print(
            "[Python] DEBUG: Transpilation successful. Proceeding to schemapack validation..."
        )
        results.update(validate())
    elif not success:
        print(
            "[Python] DEBUG: Skipping schemapack validation because transpilation failed."
        )
        results["json_output"] = None
    else:
        print(
            "[Python] DEBUG: Skipping schemapack validation because transpiler produced no JSON output."
        )
    return results


main()
