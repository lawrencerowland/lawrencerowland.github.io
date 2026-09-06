"""Finite query domain over an actual codesign-mcdp System feedback model.

All equipment coefficients are illustrative declared design allowances.
Catalogue availability is tested after cold-start integer convergence.
"""
from pathlib import Path
from itertools import product
import json

from codesign import Module, Naturals, System, solve

HERE = Path(__file__).resolve().parent
CONTRACT = json.loads((HERE / 'contract.json').read_text())
MAX_ITERATIONS = 256


def whole(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or value < 0 or int(value) != value:
        raise TypeError('The declared model requires a non-negative whole quantity')
    return int(value)


def ceil_div(value, rating):
    return (whole(value) + rating - 1) // rating


def scaled(value, numerator, denominator):
    result = value * numerator
    if result % denominator:
        raise ValueError('Declared scenario scaling must preserve integer ratings')
    return result // denominator


def lookup(family, value):
    return next(x for x in CONTRACT[family] if x['id'] == value)


def architectures():
    return [
        {'id': '-'.join((b['id'], i['id'], c['id'])),
         'label': ' · '.join((b['name'], i['name'], c['name'])),
         'battery': b['id'], 'converter': i['id'], 'cooler': c['id']}
        for b, i, c in product(CONTRACT['batteries'], CONTRACT['converters'], CONTRACT['coolers'])
    ]


def equipment(architecture, condition):
    b = dict(lookup('batteries', architecture['battery']))
    i = dict(lookup('converters', architecture['converter']))
    c = dict(lookup('coolers', architecture['cooler']))
    s = lookup('conditions', condition)
    b['usableKWh'] = scaled(b['usableKWh'], s['batteryEnergyNumerator'], s['batteryEnergyDenominator'])
    b['heatKW'] = scaled(b['heatKW'], s['batteryHeatNumerator'], s['batteryHeatDenominator'])
    c['removalKW'] = scaled(c['removalKW'], s['coolerCapacityNumerator'], s['coolerCapacityDenominator'])
    return b, i, c


class Battery(Module):
    F = {'energy': Naturals(unit='kWh')}
    R = {k: Naturals(unit=u) for k, u in [('count', 'packs'), ('energyAvailable', 'kWh'), ('heat', 'kW'), ('capital', 'GBP'), ('land', 'm2')]}

    def __init__(self, spec):
        self.spec = spec
        super().__init__()

    def h(self, f):
        # Naturals includes its added top: infinite demand has no finite resource.
        if self.F.components['energy'].is_top(f['energy']):
            return self.R.top()
        n, s = ceil_div(f['energy'], self.spec['usableKWh']), self.spec
        return {'count': n, 'energyAvailable': n*s['usableKWh'], 'heat': n*s['heatKW'], 'capital': n*s['capitalGBP'], 'land': n*s['landM2']}


class Converter(Module):
    F = {'output': Naturals(unit='kW')}
    R = {k: Naturals(unit=u) for k, u in [('count', 'units'), ('outputAvailable', 'kW'), ('loss', 'kW'), ('capital', 'GBP'), ('land', 'm2')]}

    def __init__(self, spec):
        self.spec = spec
        super().__init__()

    def h(self, f):
        # Naturals includes its added top: infinite demand has no finite resource.
        if self.F.components['output'].is_top(f['output']):
            return self.R.top()
        n, s = ceil_div(f['output'], self.spec['outputKW']), self.spec
        return {'count': n, 'outputAvailable': n*s['outputKW'], 'loss': n*s['lossKW'], 'capital': n*s['capitalGBP'], 'land': n*s['landM2']}


class Cooler(Module):
    F = {'heat': Naturals(unit='kW')}
    R = {k: Naturals(unit=u) for k, u in [('count', 'units'), ('cooling', 'kW'), ('draw', 'kW'), ('capital', 'GBP'), ('land', 'm2')]}

    def __init__(self, spec):
        self.spec = spec
        super().__init__()

    def h(self, f):
        # Naturals includes its added top: infinite demand has no finite resource.
        if self.F.components['heat'].is_top(f['heat']):
            return self.R.top()
        n, s = ceil_div(f['heat'], self.spec['removalKW']), self.spec
        return {'count': n, 'cooling': n*s['removalKW'], 'draw': n*s['drawKW'], 'capital': n*s['capitalGBP'], 'land': n*s['landM2']}


def make_system(architecture, condition):
    specs = equipment(architecture, condition)
    modules = (Battery(specs[0]), Converter(specs[1]), Cooler(specs[2]))
    system = System('rail-power-' + architecture['id'] + '-' + condition)
    p = system.provides('power', poset=Naturals(unit='kW'))
    h = system.provides('duration', poset=Naturals(unit='hours'))
    capital = system.requires('capital', poset=Naturals(unit='GBP'))
    land = system.requires('land', poset=Naturals(unit='m2'))
    b = system.add('battery', modules[0])
    i = system.add('converter', modules[1])
    c = system.add('cooler', modules[2])
    b.energy >= h * (p + c.draw + i.loss)
    i.output >= p + c.draw
    c.heat >= b.heat + i.loss
    capital >= b.capital + i.capital + c.capital
    land >= b.land + i.land + c.land
    return system.build(), modules, specs


def witness(counts, specs, power, duration):
    b, i, c = specs
    nb, ni, nc = (counts[k] for k in ('batteries', 'converters', 'coolers'))
    values = {'energyKWh': nb*b['usableKWh'], 'outputKW': ni*i['outputKW'],
              'heatKW': nb*b['heatKW'] + ni*i['lossKW'], 'coolingKW': nc*c['removalKW'],
              'drawKW': nc*c['drawKW'], 'lossKW': ni*i['lossKW']}
    resources = {'capitalGBP': nb*b['capitalGBP'] + ni*i['capitalGBP'] + nc*c['capitalGBP'],
                 'landM2': nb*b['landM2'] + ni*i['landM2'] + nc*c['landM2']}
    requirements = [duration*(power+values['drawKW']+values['lossKW']), power+values['drawKW'], values['heatKW']]
    provisions = [values['energyKWh'], values['outputKW'], values['coolingKW']]
    checks = [dict(id=interface['id'], label=interface['label'], unit=interface['unit'],
                   required=required, provided=provided, margin=provided-required,
                   satisfied=provided >= required)
              for interface, required, provided in zip(CONTRACT['interfaces'], requirements, provisions)]
    return {'counts': dict(counts), 'resources': resources, 'values': values,
            'checks': checks, 'complete': all(x['satisfied'] for x in checks)}


def module_counts(point):
    m = point['__modules__']
    return {'batteries': whole(m['battery']['count']), 'converters': whole(m['converter']['count']), 'coolers': whole(m['cooler']['count'])}


def solve_architecture(architecture, power, duration, condition):
    dp, modules, specs = make_system(architecture, condition)
    result = solve(dp, {'power': power, 'duration': duration}, max_iter=MAX_ITERATIONS, trace=True)
    if result.status != 'converged' or not result.feasible:
        raise RuntimeError('Uncompleted package calculation: ' + architecture['id'] + ' ' + str((power, duration, condition, result.status)))
    if len(result.antichain.points) != 1 or any(len(t.antichain.points) != 1 for t in result.trace):
        raise RuntimeError('Fixed-family sizing must have one least resource point')
    final = witness(module_counts(result.trace[-1].antichain.points[0]), specs, power, duration)
    if not final['complete']:
        raise AssertionError('Package convergence failed exact interface checks')
    if result.antichain.points[0] != {'capital': final['resources']['capitalGBP'], 'land': final['resources']['landM2']}:
        raise AssertionError('Package resource accounting mismatch')
    rows = []
    for entry in result.trace:
        point = entry.antichain.points[0]
        step = witness(module_counts(point), specs, power, duration)
        n, v, r = step['counts'], step['values'], step['resources']
        m = point['__modules__']
        assert m['battery']['heat'] + m['converter']['loss'] == v['heatKW']
        assert m['converter']['loss'] == v['lossKW'] and m['cooler']['draw'] == v['drawKW']
        assert m['cooler']['cooling'] == v['coolingKW']
        assert point['capital'] == r['capitalGBP'] and point['land'] == r['landM2']
        rows.append([entry.iteration,n['batteries'],n['converters'],n['coolers'],v['heatKW'],v['coolingKW'],v['drawKW'],v['lossKW'],r['capitalGBP'],r['landM2']])
    b0 = modules[0].h({'energy': duration*power}).points[0]
    i0 = modules[1].h({'output': power}).points[0]
    c0 = modules[2].h({'heat': b0['heat']+i0['loss']}).points[0]
    first = witness({'batteries': b0['count'], 'converters': i0['count'], 'coolers': c0['count']}, specs, power, duration)
    cap_checks = [{'component': key, 'count': final['counts'][key], 'limit': limit,
                   'satisfied': final['counts'][key] <= limit} for key, limit in CONTRACT['catalogueCaps'].items()]
    return {'architectureId': architecture['id'], 'calculation_status': result.status,
            'catalogue_feasible': all(x['satisfied'] for x in cap_checks), 'verified_complete': True,
            'iterations': result.iterations, 'witness': final, 'service_only': first,
            'trace': rows, 'catalogueChecks': cap_checks}


def frontier(results):
    valid = [r for r in results if r['catalogue_feasible'] and r['verified_complete'] and r['calculation_status'] == 'converged']
    def dominates(a, b):
        x, y = a['witness']['resources'], b['witness']['resources']
        return all(x[k] <= y[k] for k in ('capitalGBP','landM2')) and any(x[k] < y[k] for k in ('capitalGBP','landM2'))
    return [x['architectureId'] for x in valid if not any(dominates(y,x) for y in valid)]


def build_queries():
    result = []
    archs = architectures()
    for power, duration, condition in product(CONTRACT['domain']['powerKW'], CONTRACT['domain']['durationHours'], CONTRACT['domain']['conditions']):
        rows = [solve_architecture(a,power,duration,condition) for a in archs]
        result.append({'id': 'p{}-h{}-{}'.format(power,duration,condition), 'powerKW': power,
                       'durationHours': duration, 'condition': condition, 'frontier': frontier(rows), 'results': rows})
    return result
