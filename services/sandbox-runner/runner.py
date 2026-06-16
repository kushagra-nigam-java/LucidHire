import docker
import os
import subprocess
import tempfile
import time
from typing import Dict, Any

def run_sandbox_evaluation(patch_content: str) -> Dict[str, Any]:
    try:
        client = docker.from_env()
        # Verify docker is responsive
        client.ping()
        return _run_docker_sandbox(client, patch_content)
    except (docker.errors.DockerException, Exception) as e:
        print(f"Docker not available, falling back to subprocess: {e}")
        return _run_subprocess_fallback(patch_content)

def _run_docker_sandbox(client, patch_content: str) -> Dict[str, Any]:
    # Build image if it doesn't exist (in a real scenario, this happens once at startup)
    image_tag = "lucidhire-sandbox-base:latest"
    try:
        client.images.get(image_tag)
    except docker.errors.ImageNotFound:
        print("Building sandbox base image...")
        # Get absolute path to project root
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        client.images.build(path=root_dir, dockerfile="services/sandbox-runner/Dockerfile.sandbox", tag=image_tag)

    # Command to run inside container:
    script = f"""
cp -r /base_repo/* /scratch/
cd /scratch
cat << 'EOF' > patch.diff
{patch_content}
EOF
patch -p1 < patch.diff
pytest test_app.py
"""

    start_time = time.time()
    try:
        container = client.containers.run(
            image_tag,
            command=["/bin/bash", "-c", script],
            detach=True,
            network_mode="none", # Security: no network
            cap_drop=["ALL"],    # Security: drop capabilities
            read_only=True,      # Security: read-only filesystem
            tmpfs={'/scratch': 'rw,size=50m'}, # Writable scratch
            user="sandboxuser",  # Security: non-root
            mem_limit="256m",    # Resource bound
        )

        # Enforce hard wall-clock timeout via wait()
        try:
            result = container.wait(timeout=60)
        except Exception as timeout_err:
            container.kill()
            raise TimeoutError("Container execution timed out") from timeout_err

        logs = container.logs().decode('utf-8')
        end_time = time.time()
        
        container.remove(force=True)

        passed = result["StatusCode"] == 0
        return {
            "test_passed": passed,
            "diff": patch_content,
            "time_to_fix_seconds": int(end_time - start_time),
            "logs": logs,
            "raw_score": 100.0 if passed else 0.0,
            "isolation_method": "Docker"
        }
    except Exception as e:
        return {
            "test_passed": False,
            "diff": patch_content,
            "time_to_fix_seconds": int(time.time() - start_time),
            "logs": str(e),
            "raw_score": 0.0,
            "isolation_method": "Docker"
        }

def _run_subprocess_fallback(patch_content: str) -> Dict[str, Any]:
    """
    [SUBPROCESS FALLBACK — NOT ISOLATED, NOT FOR UNTRUSTED CODE BEYOND A DEMO]
    """
    start_time = time.time()
    with tempfile.TemporaryDirectory() as temp_dir:
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        base_dir = os.path.join(root_dir, "infra", "seed", "broken-microservice")
        
        # Copy base files
        if os.name == 'nt':
            os.system(f"xcopy /E /I /Q \"{base_dir}\" \"{temp_dir}\"")
        else:
            os.system(f"cp -r \"{base_dir}/\"* \"{temp_dir}/\"")
        
        patch_path = os.path.join(temp_dir, "patch.diff")
        with open(patch_path, "w") as f:
            f.write(patch_content)
        
        try:
            # Apply patch
            patch_cmd = ["git", "apply", "patch.diff"] if os.name == 'nt' else ["patch", "-p1", "-i", "patch.diff"]
            subprocess.run(patch_cmd, cwd=temp_dir, capture_output=True, text=True, timeout=10)
            
            # Run pytest
            run_cmd = ["pytest", "test_app.py"]
            result = subprocess.run(run_cmd, cwd=temp_dir, capture_output=True, text=True, timeout=60)
            
            passed = result.returncode == 0
            logs = result.stdout + "\n" + result.stderr + "\n[SUBPROCESS FALLBACK — NOT ISOLATED, NOT FOR UNTRUSTED CODE BEYOND A DEMO]"
            if os.name == 'nt':
                 logs += "\n[MEMORY CAP NOT ENFORCED ON THIS OS]"

            return {
                "test_passed": passed,
                "diff": patch_content,
                "time_to_fix_seconds": int(time.time() - start_time),
                "logs": logs,
                "raw_score": 100.0 if passed else 0.0,
                "isolation_method": "Subprocess [NOT ISOLATED]"
            }
        except subprocess.TimeoutExpired:
             return {
                "test_passed": False,
                "diff": patch_content,
                "time_to_fix_seconds": 60,
                "logs": "Timeout exceeded\n[SUBPROCESS FALLBACK — NOT ISOLATED]",
                "raw_score": 0.0,
                "isolation_method": "Subprocess [NOT ISOLATED]"
            }
        except Exception as e:
            return {
                "test_passed": False,
                "diff": patch_content,
                "time_to_fix_seconds": int(time.time() - start_time),
                "logs": f"Error: {e}\n[SUBPROCESS FALLBACK — NOT ISOLATED]",
                "raw_score": 0.0,
                "isolation_method": "Subprocess [NOT ISOLATED]"
            }
