"""Generate or deterministically verify package-produced rail power data."""
from pathlib import Path
import argparse
import hashlib
import json
import codesign
import model

HERE = Path(__file__).resolve().parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def package_receipt():
    expected = json.loads((HERE / 'upstream.json').read_text())
    if codesign.__version__ != expected['version']:
        raise RuntimeError('Wrong codesign-mcdp version: ' + codesign.__version__)
    package_root = Path(codesign.__file__).resolve().parent.parent
    actual = {name: sha(package_root / name) for name in expected['sourceFileSha256']}
    if actual != expected['sourceFileSha256']:
        raise RuntimeError('Imported package source differs from the reviewed pinned commit')
    return expected


def build():
    provenance = package_receipt()
    provenance.update(modelSha256=sha(HERE / 'model.py'), contractSha256=sha(HERE / 'contract.json'),
                      generatorSha256=sha(HERE / 'build_atlas.py'),
                      calculation='Actual codesign-mcdp System and cold-start solve(trace=True); exact integer module ceilings',
                      verification='Exact model interfaces and resource sums checked after convergence; independent oracle is a separate artifact',
                      deterministic=True)
    c = model.CONTRACT
    queries = model.build_queries()
    records = [r for q in queries for r in q['results']]
    result = {key: c[key] for key in ('schemaVersion','title','domain','default','catalogueCaps','conditions','interfaces','traceColumns','boundary','physicalAssumptions')}
    result.update(catalogues={key:c[key] for key in ('batteries','converters','coolers')}, provenance=provenance,
                  architectures=model.architectures(), queries=queries,
                  summary={'queries':len(queries),'architectures':len(model.architectures()),'calculations':len(records),
                           'converged':sum(r['calculation_status']=='converged' for r in records),
                           'catalogueFeasible':sum(r['catalogue_feasible'] for r in records),
                           'catalogueInfeasible':sum(not r['catalogue_feasible'] for r in records),
                           'emptyQueryFrontiers':sum(not q['frontier'] for q in queries),
                           'maxIterations':max(r['iterations'] for r in records),
                           'traceRows':sum(len(r['trace']) for r in records)})
    return json.dumps(result,sort_keys=True,separators=(',',':'),ensure_ascii=False)+'\n'


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='regenerate and byte-compare with the committed atlas')
    args=parser.parse_args()
    text=build()
    target=HERE/'atlas.json'
    if args.check:
        if not target.exists() or target.read_text()!=text:
            raise SystemExit('FAIL: atlas differs; regenerate with the reviewed model and pinned package')
        print('PASS: deterministic atlas matches reviewed model, contract and package sources')
    else:
        target.write_text(text)
        print('Wrote atlas.json: '+str(len(text.encode('utf-8')))+' bytes')
    print(json.dumps(json.loads(text)['summary'],sort_keys=True))


if __name__=='__main__':
    main()
