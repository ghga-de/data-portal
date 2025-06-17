import sys
import io
import os
import pathlib
from contextlib import redirect_stderr, redirect_stdout
print("[Python] DEBUG: Starting ghga-transpiler execution script...")

print("[Python] DEBUG: --- Filesystem Diagnostics ---")
input_file_str_path = '/data/input.xlsx'
output_file_str_path = '/data/output.json'
print(f"[Python] DEBUG: Expected input file: {input_file_str_path}")
print(f"[Python] DEBUG: Expected output file (for transpiler): {output_file_str_path}")
print("[Python] DEBUG: --- End Filesystem Diagnostics ---")

original_argv = list(sys.argv)
sys.argv = ['ghga_transpiler_cli.py'] + transpiler_args_js.to_py()
print(f"[Python] DEBUG: ghga-transpiler sys.argv set to: {sys.argv}")

transpiler_stderr_buffer = io.StringIO()
execution_successful = False
python_error_details = ""
json_from_file = None

validation_successful = False
validation_stdout_buffer = io.StringIO()
validation_stderr_buffer = io.StringIO()

print("[Python] DEBUG: Preparing to call ghga-transpiler's main function...")
try:
    with redirect_stderr(transpiler_stderr_buffer):
        print("[Python] DEBUG: Importing run from ghga_transpiler.__main__ ...")
        from ghga_transpiler.__main__ import run as transpiler_run_func
        print("[Python] DEBUG: ghga_transpiler.__main__.run imported. Calling transpiler_run_func()...")
        transpiler_run_func()
        print("[Python] DEBUG: ghga-transpiler transpiler_run_func() call finished.")

    if os.path.exists(output_file_str_path):
        print(f"[Python] DEBUG: Output file '{output_file_str_path}' exists. Size: {os.path.getsize(output_file_str_path)}")
        with open(output_file_str_path, 'r', encoding='utf-8') as f_out:
            json_from_file = f_out.read()
        execution_successful = True
        print(f"[Python] DEBUG: Successfully read JSON from '{output_file_str_path}'. Length: {len(json_from_file) if json_from_file else 0}")
    else:
        print(f"[Python] DEBUG: ERROR - Output file '{output_file_str_path}' was NOT created by ghga-transpiler.")
        python_error_details = f"Output file '{output_file_str_path}' not found after transpilation."

    stderr_val = transpiler_stderr_buffer.getvalue()
    if stderr_val and stderr_val.strip():
        print(f"[Python] DEBUG: ghga-transpiler stderr content:\\n{stderr_val}")
        if execution_successful:
            python_error_details = (python_error_details + "\\n" if python_error_details else "") + "Stderr warnings/info: " + stderr_val
        else:
            python_error_details = (python_error_details + "\\n" if python_error_details else "") + stderr_val


except SystemExit as se:
    stderr_val = transpiler_stderr_buffer.getvalue()
    print(f"[Python] DEBUG: ghga-transpiler SystemExit with code: {se.code}")
    python_error_details = f"ghga-transpiler SystemExit with code {se.code}.\\nStderr: {stderr_val}"
    if se.code == 0 and os.path.exists(output_file_str_path):
        if not json_from_file:
            with open(output_file_str_path, 'r', encoding='utf-8') as f_out_exit:
                json_from_file = f_out_exit.read()
        execution_successful = True
        print(f"[Python] DEBUG: SystemExit 0, JSON read from '{output_file_str_path}'.")


except ImportError as ie:
    print(f"[Python] DEBUG: ghga-transpiler ImportError: {type(ie).__name__}: {str(ie)}")
    python_error_details = f"ImportError: {str(ie)}\\n{transpiler_stderr_buffer.getvalue()}"
except Exception as e:
    import traceback
    tb_str = traceback.format_exc()
    print(f"[Python] DEBUG: Exception during ghga-transpiler logic: {type(e).__name__}: {str(e)}\\nTraceback:\\n{tb_str}")
    if hasattr(e, 'errno') and e.errno is not None:
        print(f"[Python] DEBUG: Caught Exception has errno: {e.errno}")
    python_error_details = f"Python Exception: {type(e).__name__}: {str(e)}\\nTraceback:\\n{tb_str}\\n{transpiler_stderr_buffer.getvalue()}"
finally:
    sys.argv = original_argv
    print("[Python] DEBUG: ghga-transpiler Python execution block finished.")

# schemapack validation phase
if execution_successful and json_from_file:
    print("[Python] DEBUG: Transpilation successful. Proceeding to schemapack validation...")

    schemapack_args_py = [
        'validate',
        '--schemapack', '/data/metadata_model.yaml',
        '--datapack', output_file_str_path
    ]
    original_argv_schemapack = list(sys.argv)
    sys.argv = ['schemapack'] + schemapack_args_py
    print(f"[Python] DEBUG: schemapack sys.argv set to: {sys.argv}")

    try:
        print("[Python] DEBUG: Importing schemapack.cli.cli ...")
        from schemapack.__main__ import cli as schemapack_main_func
        print("[Python] DEBUG: schemapack.cli.cli imported. Calling schemapack_main_func()...")

        # Redirect stdout/stderr for schemapack specifically
        with redirect_stdout(validation_stdout_buffer), redirect_stderr(validation_stderr_buffer):
            schemapack_main_func() # This will parse sys.argv
        
        # Determine validation success based on exit code or stderr content
        _temp_stderr = validation_stderr_buffer.getvalue()
        if not _temp_stderr or "error" not in _temp_stderr.lower():
            validation_successful = True
        else:
            validation_successful = False

        print(f"[Python] DEBUG: schemapack call completed (no SystemExit caught here). Stderr check: '{_temp_stderr[:100]}...'")

    except SystemExit as se_schemapack:
        if se_schemapack.code == 0:
            validation_successful = True
            print(f"[Python] DEBUG: schemapack SystemExit with code 0 (validation success).")
        else:
            validation_successful = False # Explicit failure
            print(f"[Python] DEBUG: schemapack SystemExit with code {se_schemapack.code} (validation failure).")
    except ImportError as ie_schemapack:
        validation_stderr_buffer.write(f"ImportError during schemapack: {str(ie_schemapack)}")
        print(f"[Python] DEBUG: schemapack ImportError: {validation_stderr_buffer.getvalue()}")
    except Exception as e_schemapack:
        import traceback
        tb_schemapack_str = traceback.format_exc()
        validation_stderr_buffer.write(f"Exception during schemapack: {type(e_schemapack).__name__}: {str(e_schemapack)}\\nTraceback:\\n{tb_schemapack_str}")
        print(f"[Python] DEBUG: schemapack Exception: {validation_stderr_buffer.getvalue()}")
    finally:
        sys.argv = original_argv_schemapack # Restore sys.argv
        print("[Python] DEBUG: schemapack validation block finished.")
elif not execution_successful:
    print("[Python] DEBUG: Skipping schemapack validation because transpilation failed.")
elif not json_from_file:
    print("[Python] DEBUG: Skipping schemapack validation because transpiler produced no JSON output.")

if execution_successful and (json_from_file is None or json_from_file.strip() == ""):
        print("[Python] DEBUG: Execution marked successful but no JSON content read from file. Overriding to failure.")
        execution_successful = False
        if not python_error_details: python_error_details = "Transpiler ran but produced no readable JSON output file."

if not execution_successful and not python_error_details:
    python_error_details = "Transpiler failed for an unknown reason. Check Python logs in console."

{
    "json_output": json_from_file if execution_successful else None,
    "error_message": python_error_details if not execution_successful or python_error_details else None,
    "success": execution_successful,
    "py_output_file_path": output_file_str_path,
    "validation_success": validation_successful,
    "validation_stdout": validation_stdout_buffer.getvalue(),
    "validation_stderr": validation_stderr_buffer.getvalue()
}
