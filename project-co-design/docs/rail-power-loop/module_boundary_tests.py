"""Narrow direct-Module checks for the extended-natural top boundary."""
from pathlib import Path
import hashlib
import json
import math
import model


def check():
    cases=[]
    for condition in model.CONTRACT['domain']['conditions']:
        for kind, klass, port, rating in [('batteries',model.Battery,'energy','usableKWh'),('converters',model.Converter,'output','outputKW'),('coolers',model.Cooler,'heat','removalKW')]:
            for family in model.CONTRACT[kind]:
                architecture={'battery':family['id'] if kind=='batteries' else 'standard',
                              'converter':family['id'] if kind=='converters' else 'standard',
                              'cooler':family['id'] if kind=='coolers' else 'air'}
                specs=model.equipment(architecture,condition)
                spec=specs[{'batteries':0,'converters':1,'coolers':2}[kind]]
                module=klass(spec)
                zero=module.h({port:0})
                one=module.h({port:spec[rating]})
                two=module.h({port:spec[rating]+1})
                top=module.h({port:math.inf})
                assert len(top.points)==1
                assert top.points[0]==module.R.top()
                assert all(value==math.inf for value in top.points[0].values())
                assert zero.points[0]==module.R.bottom()
                assert one.points[0]['count']==1 and two.points[0]['count']==2
                assert zero.leq(one) and one.leq(two) and two.leq(top)
                cases.append({'component':kind,'family':family['id'],'condition':condition,'rating':spec[rating],
                              'directTop':'all-resource-top','boundaryCounts':[0,1,2], 'orderChecks':3})
    return {'status':'PASS','scope':'Direct module top, zero and first unit-rating boundary only; outer supported domains unchanged.',
            'modelSha256':hashlib.sha256((Path(__file__).resolve().parent/'model.py').read_bytes()).hexdigest(),
            'moduleConfigurations':len(cases),'directModuleCalls':4*len(cases),'cases':cases}


if __name__=='__main__':
    result=check()
    (Path(__file__).resolve().parent/'module-boundary-results.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
    print('PASS:',result['moduleConfigurations'],'module configurations,',result['directModuleCalls'],'direct calls')
