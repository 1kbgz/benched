import json
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator

from benched.model import Report, Run, SchemaError, SchemaVersionError, schema_path

FIXTURES = Path(__file__).with_name("fixtures")


@pytest.mark.parametrize("kind", ["run", "report"])
def test_packaged_schemas_are_valid(kind):
    schema = json.loads(schema_path(kind).read_text(encoding="utf-8"))
    Draft202012Validator.check_schema(schema)


def test_run_round_trip_satisfies_schema():
    source = json.loads((FIXTURES / "canonical-run-v1.json").read_text(encoding="utf-8"))

    result = Run.from_dict(source).to_dict()

    Draft202012Validator(json.loads(schema_path("run").read_text(encoding="utf-8"))).validate(result)
    assert result == source


def test_report_round_trip_satisfies_schema():
    source = json.loads((FIXTURES / "canonical-report-v1.json").read_text(encoding="utf-8"))

    result = Report.from_dict(source).to_dict()

    Draft202012Validator(json.loads(schema_path("report").read_text(encoding="utf-8"))).validate(result)
    assert result == source


@pytest.mark.parametrize("model", [Run, Report])
def test_future_schema_version_is_actionable(model):
    with pytest.raises(SchemaVersionError, match="newer than supported version 1"):
        model.from_dict({"schema_version": 2})


def test_invalid_run_field_is_actionable():
    source = json.loads((FIXTURES / "canonical-run-v1.json").read_text(encoding="utf-8"))
    source["machine"]["id"] = ""

    with pytest.raises(SchemaError, match="machine.id must be a non-empty string"):
        Run.from_dict(source)
