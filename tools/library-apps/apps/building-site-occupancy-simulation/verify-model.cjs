// Run: node verify-model.cjs /path/to/tortoise-compiler.js /path/to/tortoise-engine.min.js
// Obtain both from https://www.netlogoweb.org/ ; they are validation tools, not bundled app assets.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
try {
  const [compilerFile, engineFile] = process.argv.slice(2);
  if (!compilerFile || !engineFile) throw new Error('Supply NetLogo Web compiler and engine paths.');
  vm.runInThisContext(fs.readFileSync(compilerFile, 'utf8'));
  global.window = {};
  vm.runInThisContext(fs.readFileSync(engineFile, 'utf8'));
  console.log('NetLogo Web runtime:', JSON.stringify(tortoise_require('meta')));
  const compiler = new BrowserCompiler();
  const result = compiler.fromNlogo(fs.readFileSync(path.join(__dirname, 'building_site_pool_gym_model.nlogo'), 'utf8'));
  assert.equal(result.model.success, true, JSON.stringify(result.model));
  vm.runInThisContext(result.model.result);
  const command = source => {
    const compiled = compiler.compileCommand(source);
    assert.equal(compiled.success, true, JSON.stringify(compiled));
    return vm.runInThisContext(`(function(){${compiled.result}})()`);
  };
  const report = source => {
    const compiled = compiler.compileReporter(source);
    assert.equal(compiled.success, true, JSON.stringify(compiled));
    return vm.runInThisContext(compiled.result);
  };
  for (const count of [0, 8, 100]) {
    for (const seed of [1, 42, 97]) {
      command(`set num-workers ${count} random-seed ${seed} setup`);
      assert.equal(report('count workers with [role = "guard"]'), 1);
      command('repeat 360 [go] go'); // 06:00 arrival event has run
      assert.equal(report('count workers with [role != "guard"]'), count);
      assert.equal(report('count workers with [role = "guard"]'), 0);
      command('repeat 59 [go]'); // 07:00, transit should have finished
      assert.equal(report('count workers with [[area-type] of patch-here = role]'), count);
      command('repeat 360 [go]'); // 13:00, lunch transit should be complete
      assert.equal(report('count workers with [[area-type] of patch-here = "break"]'), count);
      command('repeat 60 [go]'); // 14:00, everyone back at work
      assert.equal(report('count workers with [[area-type] of patch-here = role]'), count);
      command('repeat 240 [go]'); // 18:00, crew and deliveries have left
      assert.equal(report('count workers'), 0);
      assert.equal(report('count vehicles'), 0);
      command('repeat 181 [go]'); // 21:00 guard arrival has run
      assert.equal(report('count workers with [role = "guard"]'), 1);
      command('repeat 179 [go]');
      assert.equal(report('current-time'), 1440);
      assert.equal(report('ticks'), 1440);
      for (const zone of ['pool', 'gym', 'break', 'walkway']) {
        assert.equal(report(`length ${zone}-occupancy`), 1440);
        assert.ok(report(`max ${zone}-occupancy`) <= Math.max(1, count));
      }
      command('go');
      assert.equal(report('ticks'), 1440, 'finished model must not advance');
    }
  }
  console.log('NetLogo Web compilation and 9 full-day runs passed: 0/8/100 workers, seeds 1/42/97; schedule, arrival, lunch, departure, guard, delivery clearance, logging and stop assertions.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
