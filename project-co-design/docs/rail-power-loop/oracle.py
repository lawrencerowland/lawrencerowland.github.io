#!/usr/bin/env python3
"""Independent finite integer oracle; does not import model.py or codesign.

All constants and inequalities below are transcribed from the declared model
contract. Enumeration visits every available integer implementation before any
minimal-resource filtering. No package function is used to generate the oracle.
"""

from itertools import product
from pathlib import Path
import argparse
import hashlib
import json


BATTERIES = {
    "standard": {"energy": 1000, "cost": 320000, "land": 28, "heat": 12},
    "compact": {"energy": 1400, "cost": 600000, "land": 16, "heat": 20},
}
CONVERTERS = {
    "standard": {"output": 250, "loss": 8, "cost": 75000, "land": 12},
    "efficient": {"output": 250, "loss": 3, "cost": 115000, "land": 8},
}
COOLERS = {
    "air": {"capacity": 40, "draw": 12, "cost": 30000, "land": 12},
    "liquid": {"capacity": 70, "draw": 8, "cost": 75000, "land": 6},
}
CAPS = (32, 12, 20)
POWERS = (0, 250, 500, 750, 1000, 1500, 2000)
HOURS = (2, 4, 6, 8, 12, 16, 24)
CONDITIONS = ("mild", "hot")


def parameters(names, condition):
    b, i, c = names
    battery = dict(BATTERIES[b])
    converter = dict(CONVERTERS[i])
    cooler = dict(COOLERS[c])
    if condition == "hot":
        # These exact factors yield integers for every declared unit.
        battery["energy"] = battery["energy"] * 4 // 5
        battery["heat"] = battery["heat"] * 3 // 2
        cooler["capacity"] = cooler["capacity"] * 4 // 5
    elif condition != "mild":
        raise ValueError(condition)
    return battery, converter, cooler


def interface_values(counts, names, power, hours, condition):
    b, i, c = counts
    battery, converter, cooler = parameters(names, condition)
    return {
        "battery_energy": (b * battery["energy"],
                           hours * (power + c * cooler["draw"] + i * converter["loss"])),
        "converter_output": (i * converter["output"], power + c * cooler["draw"]),
        "cooling": (c * cooler["capacity"], b * battery["heat"] + i * converter["loss"]),
    }


def compatible(counts, names, power, hours, condition):
    return all(provides >= requires for provides, requires in
               interface_values(counts, names, power, hours, condition).values())


def resources(counts, names, condition):
    parts = parameters(names, condition)
    return tuple(sum(n * p[k] for n, p in zip(counts, parts))
                 for k in ("cost", "land"))


def finite_oracle(names, power, hours, condition):
    """All 33*13*21 triples, with no recursive sizing or early pruning."""
    battery, converter, cooler = parameters(names, condition)
    feasible = []
    for b, i, c in product(range(33), range(13), range(21)):
        if (b * battery["energy"] >= hours * (power + c * cooler["draw"] + i * converter["loss"])
                and i * converter["output"] >= power + c * cooler["draw"]
                and c * cooler["capacity"] >= b * battery["heat"] + i * converter["loss"]):
            feasible.append((b, i, c))
    if not feasible:
        return {"feasible_count": 0, "least": None, "resources": None}
    least = tuple(min(x[k] for x in feasible) for k in range(3))
    assert least in feasible, (names, power, hours, condition, "no least witness")
    assert all(all(a <= b for a, b in zip(least, x)) for x in feasible)
    r = resources(least, names, condition)
    assert all(all(a <= b for a, b in zip(r, resources(x, names, condition))) for x in feasible)
    return {"feasible_count": len(feasible), "least": least, "resources": r}


def service_only(names, power, hours, condition):
    battery, converter, cooler = parameters(names, condition)
    ceildiv = lambda n, d: (n + d - 1) // d
    b = ceildiv(hours * power, battery["energy"])
    i = ceildiv(power, converter["output"])
    c = ceildiv(b * battery["heat"] + i * converter["loss"], cooler["capacity"])
    return (b, i, c)


def resource_front(rows):
    """Retain IDs for every equal-resource implementation."""
    result = []
    for row in rows:
        r = row["resources"]
        if not any(all(x <= y for x, y in zip(other["resources"], r))
                   and any(x < y for x, y in zip(other["resources"], r))
                   for other in rows):
            result.append(row)
    return result


def count_tuple(witness):
    counts = witness["counts"]
    return tuple(counts[k] for k in ("batteries", "converters", "coolers"))


def next_counts(counts, names, power, hours, condition):
    """Only checks recorded trace steps; not used by finite_oracle."""
    b, i, c = counts
    battery, converter, cooler = parameters(names, condition)
    ceildiv = lambda n, d: (n + d - 1) // d
    return (
        ceildiv(hours * (power + c * cooler["draw"] + i * converter["loss"]), battery["energy"]),
        ceildiv(power + c * cooler["draw"], converter["output"]),
        ceildiv(b * battery["heat"] + i * converter["loss"], cooler["capacity"]),
    )


def check_witness(witness, names, power, hours, condition):
    counts = count_tuple(witness)
    assert all(type(n) is int and n >= 0 for n in counts)
    r = resources(counts, names, condition)
    assert witness["resources"] == {"capitalGBP": r[0], "landM2": r[1]}
    b, i, c = counts
    battery, converter, cooler = parameters(names, condition)
    assert witness["values"] == {
        "energyKWh": b * battery["energy"], "outputKW": i * converter["output"],
        "heatKW": b * battery["heat"] + i * converter["loss"],
        "coolingKW": c * cooler["capacity"], "drawKW": c * cooler["draw"],
        "lossKW": i * converter["loss"],
    }
    expected = interface_values(counts, names, power, hours, condition)
    ids = {"energy": "battery_energy", "conversion": "converter_output", "cooling": "cooling"}
    assert {c["id"] for c in witness["checks"]} == set(ids)
    for check in witness["checks"]:
        provided, required = expected[ids[check["id"]]]
        assert check["provided"] == provided
        assert check["required"] == required
        assert check["margin"] == provided - required
        assert check["satisfied"] == (provided >= required)
        assert check["unit"] == ("kWh" if check["id"] == "energy" else "kW")
    assert witness["complete"] == compatible(counts, names, power, hours, condition)
    return counts


def run(atlas_path):
    atlas = json.loads(atlas_path.read_text())
    assert atlas["domain"] == {
        "powerKW": list(POWERS), "durationHours": list(HOURS),
        "conditions": list(CONDITIONS),
    }
    assert atlas["catalogueCaps"] == dict(zip(("batteries", "converters", "coolers"), CAPS))
    names_by_id = {a["id"]: (a["battery"], a["converter"], a["cooler"])
                   for a in atlas["architectures"]}
    expected_names = set(product(BATTERIES, CONVERTERS, COOLERS))
    assert set(names_by_id.values()) == expected_names and len(names_by_id) == 8
    queries = {(q["powerKW"], q["durationHours"], q["condition"]): q for q in atlas["queries"]}
    assert set(queries) == set(product(POWERS, HOURS, CONDITIONS)) and len(atlas["queries"]) == 98
    records = {}
    counters = {"briefs": 98, "architectures_per_brief": 8,
                "candidate_count_triples_per_architecture": 9009,
                "integer_count_triples_examined": 0, "architecture_results": 0,
                "compatible_available_count_triples": 0, "catalogue_feasible_results": 0,
                "catalogue_unavailable_results": 0, "interface_comparisons": 0,
                "recorded_trace_transitions": 0, "resource_ceiling_queries": 0,
                "hot_witnesses_checked_in_mild": 0, "adjacent_monotonicity_pairs": 0,
                "first_pass_incomplete_results": 0}
    defaults = []
    unavailable_examples = []
    for (power, hours, condition), query in queries.items():
        assert query["id"] == f"p{power}-h{hours}-{condition}"
        assert {r["architectureId"] for r in query["results"]} == set(names_by_id)
        assert len(query["results"]) == 8
        available = []
        for result in query["results"]:
            aid = result["architectureId"]
            names = names_by_id[aid]
            assert result["calculation_status"] == "converged"
            assert result["verified_complete"] is True
            counts = check_witness(result["witness"], names, power, hours, condition)
            assert result["witness"]["complete"] is True
            assert next_counts(counts, names, power, hours, condition) == counts
            observed = finite_oracle(names, power, hours, condition)
            available_flag = observed["least"] is not None
            assert result["catalogue_feasible"] == available_flag
            assert available_flag == all(n <= cap for n, cap in zip(counts, CAPS))
            caps = result["catalogueChecks"]
            assert len(caps) == 3
            for check, n, cap, component in zip(caps, counts, CAPS, ("batteries", "converters", "coolers")):
                assert check["component"] == component
                assert check["count"] == n and check["limit"] == cap
                assert check["satisfied"] == (n <= cap)
            if available_flag:
                assert counts == observed["least"], (query["id"], aid, counts, observed)
                assert resources(counts, names, condition) == observed["resources"]
                available.append({"id": aid, "resources": observed["resources"]})
                counters["catalogue_feasible_results"] += 1
            else:
                counters["catalogue_unavailable_results"] += 1
                if len(unavailable_examples) < 5:
                    unavailable_examples.append({"brief": query["id"], "architecture": aid,
                                                 "least_counts": counts, "caps": CAPS})
            comparator = check_witness(result["service_only"], names, power, hours, condition)
            assert comparator == service_only(names, power, hours, condition)
            if not result["service_only"]["complete"]:
                counters["first_pass_incomplete_results"] += 1
            trace = result["trace"]
            assert trace and tuple(trace[0][1:4]) == (0, 0, 0)
            assert tuple(trace[-1][1:4]) == counts
            assert len(trace) == result["iterations"] + 1
            for position, row in enumerate(trace):
                assert row[0] == position and len(row) == 10
                assert all(type(v) is int and v >= 0 for v in row)
                b, i, c = row[1:4]
                battery, converter, cooler = parameters(names, condition)
                assert row[4:8] == [b * battery["heat"] + i * converter["loss"],
                                   c * cooler["capacity"], c * cooler["draw"], i * converter["loss"]]
                assert tuple(row[8:10]) == resources((b, i, c), names, condition)
                if position:
                    previous = tuple(trace[position - 1][1:4])
                    current = tuple(row[1:4])
                    assert next_counts(previous, names, power, hours, condition) == current
                    assert all(x <= y for x, y in zip(previous, current))
                    counters["recorded_trace_transitions"] += 1
            records[(power, hours, condition, aid)] = {
                "counts": counts, "available": available_flag,
                "resources": resources(counts, names, condition),
            }
            counters["architecture_results"] += 1
            counters["integer_count_triples_examined"] += 9009
            counters["compatible_available_count_triples"] += observed["feasible_count"]
            counters["interface_comparisons"] += 6
            if (power, hours, condition) == (750, 8, "hot"):
                defaults.append({"architecture": aid, "least_counts": counts,
                                 "resources": resources(counts, names, condition),
                                 "first_pass_counts": comparator,
                                 "first_pass_failed_interfaces": [c["id"] for c in result["service_only"]["checks"]
                                                                   if not c["satisfied"]],
                                 "available": available_flag})
        front = resource_front(available)
        assert sorted(query["frontier"]) == sorted(row["id"] for row in front)
        # Every boundary at which a ceiling-filtered finite answer can change.
        capital_limits = {0, None}
        land_limits = {0, None}
        for row in available:
            cost, land = row["resources"]
            capital_limits.update((cost, max(0, cost - 1)))
            land_limits.update((land, max(0, land - 1)))
        for capital, land in product(capital_limits, land_limits):
            within = lambda row: ((capital is None or row["resources"][0] <= capital)
                                  and (land is None or row["resources"][1] <= land))
            recomputed = {row["id"] for row in resource_front([row for row in available if within(row)])}
            filtered = {row["id"] for row in front if within(row)}
            assert recomputed == filtered
            counters["resource_ceiling_queries"] += 1

    for power, hours, aid in product(POWERS, HOURS, names_by_id):
        hot = records[(power, hours, "hot", aid)]
        mild = records[(power, hours, "mild", aid)]
        assert compatible(hot["counts"], names_by_id[aid], power, hours, "mild")
        assert all(x <= y for x, y in zip(mild["counts"], hot["counts"]))
        assert not hot["available"] or mild["available"]
        counters["hot_witnesses_checked_in_mild"] += 1
    for power, hours, condition, aid in product(POWERS, HOURS, CONDITIONS, names_by_id):
        lower = records[(power, hours, condition, aid)]
        harder = []
        pi, hi = POWERS.index(power), HOURS.index(hours)
        if pi + 1 < len(POWERS):
            harder.append(records[(POWERS[pi + 1], hours, condition, aid)])
        if hi + 1 < len(HOURS):
            harder.append(records[(power, HOURS[hi + 1], condition, aid)])
        for upper in harder:
            assert all(x <= y for x, y in zip(lower["counts"], upper["counts"]))
            assert all(x <= y for x, y in zip(lower["resources"], upper["resources"]))
            assert not upper["available"] or lower["available"]
            counters["adjacent_monotonicity_pairs"] += 1
    zero_fronts = [q for key, q in queries.items() if key[0] == 0]
    assert len(zero_fronts) == 14
    for query in zero_fronts:
        assert set(query["frontier"]) == set(names_by_id)
        assert all(count_tuple(r["witness"]) == (0, 0, 0) for r in query["results"])
    for filename, key in (("model.py", "modelSha256"), ("contract.json", "contractSha256"),
                          ("build_atlas.py", "generatorSha256")):
        assert hashlib.sha256((atlas_path.parent / filename).read_bytes()).hexdigest() == atlas["provenance"][key]
    assert atlas["summary"]["emptyQueryFrontiers"] == sum(not q["frontier"] for q in queries.values())
    return {
        "status": "PASS", "scope": "Independent finite integer enumeration; no package or model imports",
        "input_sha256": {p.name: hashlib.sha256(p.read_bytes()).hexdigest()
                         for p in (atlas_path, atlas_path.parent / "contract.json",
                                   atlas_path.parent / "model.py", atlas_path.parent / "build_atlas.py", Path(__file__))},
        "counts": counters,
        "zero_demand": {"briefs": 14, "equal_resource_architecture_witnesses_per_brief": 8},
        "default": {"brief": "p750-h8-hot", "frontier": queries[(750, 8, "hot")]["frontier"],
                    "architectures": defaults},
        "unavailable_examples": unavailable_examples,
        "empty_frontier_briefs": [q["id"] for q in queries.values() if not q["frontier"]],
        "boundary": "Exact for the declared finite catalogue and supported briefs; no empirical railway or safety validation.",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--atlas", type=Path, default=Path(__file__).with_name("atlas.json"))
    parser.add_argument("--output", type=Path, default=Path(__file__).with_name("oracle-results.json"))
    args = parser.parse_args()
    answer = run(args.atlas)
    args.output.write_text(json.dumps(answer, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"status": answer["status"], "counts": answer["counts"]}, indent=2))
