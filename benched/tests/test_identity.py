from benched.config import Config, IdentityConfig
from benched.identity import GitInfo, machine_fingerprint, resolve_environment, resolve_identities, resolve_machine


def _config(tmp_path, *, suite_name="suite", subject_name="subject", distribution="subject"):
    return Config(
        project_root=tmp_path,
        pyproject=None,
        benchmark_paths=(tmp_path / "benchmarks",),
        results_dir=str(tmp_path / "results"),
        storage_options={},
        project_version="0.1.0",
        suite=IdentityConfig(name=suite_name, repository=f"https://example.test/{suite_name}"),
        subject=IdentityConfig(name=subject_name, repository=f"https://example.test/{subject_name}", distribution=distribution),
    )


def test_resolves_suite_and_installed_subject_separately(monkeypatch, tmp_path):
    monkeypatch.setattr("benched.identity.git_info", lambda root: GitInfo("suite-revision", "main", False))
    monkeypatch.setattr("benched.identity.metadata.version", lambda distribution: "1.2.3")

    suite, subject = resolve_identities(_config(tmp_path), subject_revision="subject-revision")

    assert suite.revision == "suite-revision"
    assert suite.version == "0.1.0"
    assert subject.version == "1.2.3"
    assert subject.revision == "subject-revision"
    assert subject.branch is None


def test_in_repository_subject_shares_git_identity(monkeypatch, tmp_path):
    monkeypatch.setattr("benched.identity.git_info", lambda root: GitInfo("revision", "topic", True))
    monkeypatch.setattr("benched.identity.metadata.version", lambda distribution: "0.1.0")
    config = _config(tmp_path, suite_name="example", subject_name="example", distribution="example")

    suite, subject = resolve_identities(config)

    assert suite.revision == subject.revision == "revision"
    assert suite.branch == subject.branch == "topic"
    assert suite.dirty is subject.dirty is True


def test_machine_fingerprint_excludes_human_id():
    first = resolve_machine("runner-one")
    second = resolve_machine("runner-two")

    assert first.id != second.id
    assert first.fingerprint == second.fingerprint


def test_machine_fingerprint_uses_normalized_stable_hardware_fields():
    fingerprint = machine_fingerprint(architecture=" ARM64 ", cpu="Apple   M5", cpu_count="12")

    assert fingerprint == machine_fingerprint(architecture="arm64", cpu="apple m5", cpu_count=12)
    assert fingerprint != machine_fingerprint(architecture="x86_64", cpu="apple m5", cpu_count=12)
    assert fingerprint != machine_fingerprint(architecture="arm64", cpu="apple m4", cpu_count=12)
    assert fingerprint != machine_fingerprint(architecture="arm64", cpu="apple m5", cpu_count=10)


def test_machine_records_memory_rounded_to_half_gib(monkeypatch):
    monkeypatch.setattr("benched.identity._total_memory_bytes", lambda: int(15.76 * 1024**3))

    machine = resolve_machine("runner")

    assert machine.metadata["memory_gib"] == 16.0


def test_environment_labels_affect_fingerprint():
    default = resolve_environment()
    optimized = resolve_environment(labels={"build": "optimized"})

    assert default.fingerprint != optimized.fingerprint


def test_environment_records_python_runtime(monkeypatch):
    monkeypatch.setattr("benched.identity.platform.python_implementation", lambda: "CPython")
    monkeypatch.setattr("benched.identity.platform.python_version", lambda: "3.13.2")

    environment = resolve_environment()

    assert environment.python_implementation == "CPython"
    assert environment.python_version == "3.13.2"
