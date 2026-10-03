import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const window = {};
vm.runInNewContext(readFileSync(new URL('public/js/pathfinder-data.js', root), 'utf8'), { window });
const data = window.I2Pathfinder;

test('explicit next-step requests take priority over reach, funding type and readiness', () => {
  const cases = [
    [{ goal: 'network', 'network-reach': 'national', 'network-stage': 'planning', 'network-next': 'plan' }, '/the-initiative'],
    [{ goal: 'network', 'network-reach': 'one', 'network-next': 'talk' }, '/contact?topic=initiative#contact-form'],
    [{ goal: 'donor', 'donor-partner': 'strategic', 'donor-help': 'stewardship', 'donor-stage': 'ready' }, '/donate#stewardship'],
    [{ goal: 'donor', 'donor-help': 'program', 'donor-interest': 'scholarships', 'donor-stage': 'ready' }, '/mmwu'],
    [{ goal: 'donor', 'donor-help': 'give' }, '/donate-form'],
    [{ goal: 'donor', 'donor-help': 'talk' }, '/contact?topic=giving#contact-form'],
    [{ goal: 'church', 'church-goal': 'mobilize', 'church-next': 'free' }, '/get-trained'],
    [{ goal: 'church', 'church-goal': 'coordinate', 'church-next': 'recommend' }, '/wise-global'],
    [{ goal: 'learner', 'learner-goal': 'study', 'learner-format': 'degree', 'learner-next': 'talk' }, '/contact?topic=mmwu#contact-form'],
    [{ goal: 'learner', 'learner-goal': 'study', 'learner-format': 'free', 'learner-next': 'browse' }, '/get-trained'],
  ];
  for (const [answers, destination] of cases) assert.equal(data.results[data.recommend(answers)].primary.url, destination);
});

test('every complete audience path produces a reachable, existing main-site destination', () => {
  const rewrites = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8')).rewrites;
  const known = new Set(rewrites.map(row => row.source));
  const reached = new Set();
  let combinations = 0;
  for (const [goal, branch] of Object.entries(data.branches)) {
    function walk(position, answers) {
      if (position === branch.questions.length) {
        const id = data.recommend(answers);
        assert.ok(data.results[id], JSON.stringify(answers));
        reached.add(id);
        combinations++;
        return;
      }
      const id = branch.questions[position];
      for (const option of data.questions[id].options) walk(position + 1, { ...answers, [id]: option.value });
    }
    walk(1, { goal });
  }
  assert.equal(combinations, 2868);
  assert.equal(reached.size, Object.keys(data.results).length);
  for (const result of Object.values(data.results)) {
    for (const action of [result.primary, result.secondary]) {
      if (action.external) {
        assert.equal(action.url, 'https://www.gommwu.org');
        continue;
      }
      assert.equal(action.external, undefined);
      assert.match(action.url, /^\/(?!\/)/);
      assert.ok(known.has(new URL(action.url, 'https://www.i2ministries.org').pathname));
    }
  }
});

test('an MMWU qualification opens gommwu.org in a new window', () => {
  const qualified = [
    { goal: 'learner', 'learner-format': 'degree', 'learner-next': 'browse' },
    { goal: 'learner', 'learner-format': 'advanced', 'learner-next': 'browse' },
    { goal: 'church', 'church-goal': 'trainers', 'church-next': 'recommend' },
    { goal: 'network', 'network-support': 'trainers', 'network-next': 'training' },
    { goal: 'network', 'network-support': 'trainers', 'network-next': 'recommend' },
  ];
  for (const answers of qualified) {
    const result = data.results[data.recommend(answers)];
    assert.equal(data.recommend(answers), 'result-mmwu');
    assert.equal(result.primary.url, 'https://www.gommwu.org');
    assert.equal(result.primary.external, true);
    assert.equal(result.secondary.url, '/contact?topic=mmwu#contact-form');
  }
  const stays = [
    [{ goal: 'learner', 'learner-format': 'degree', 'learner-next': 'talk' }, '/contact?topic=mmwu#contact-form'],
    [{ goal: 'learner', 'learner-format': 'free', 'learner-next': 'browse' }, '/get-trained'],
    [{ goal: 'donor', 'donor-help': 'program', 'donor-interest': 'scholarships' }, '/mmwu'],
  ];
  for (const [answers, destination] of stays) {
    const result = data.results[data.recommend(answers)];
    assert.equal(result.primary.url, destination);
    assert.equal(result.primary.external, undefined);
  }
  const js = readFileSync(new URL('public/js/pathfinder.js', root), 'utf8');
  assert.match(js, /node\.target = '_blank'/);
  assert.match(js, /window\.open\(result\.primary\.url, '_blank'\)/);
});

test('only the homepage loads the quiz and its ebook invitation is inline between the pillars and endorsements sections', () => {
  const files = readdirSync(new URL('public/', root)).filter(name => name.endsWith('.html'));
  for (const file of files) {
    const html = readFileSync(new URL('public/' + file, root), 'utf8');
    if (file === 'index.html') {
      assert.match(html, /id="i2-pathfinder"/);
      assert.match(html, /\/js\/pathfinder\.js/);
      assert.doesNotMatch(html, /id="ebookOverlay"/);
      assert.ok(html.indexOf('class="emfci-stats"') < html.indexOf('id="free-ebook"'));
      assert.ok(html.indexOf('id="trained"') < html.indexOf('id="free-ebook"'));
      assert.ok(html.indexOf('id="free-ebook"') < html.indexOf('id="endorsements"'));
    } else {
      assert.doesNotMatch(html, /id="i2-pathfinder"|\/js\/pathfinder(?:-data)?\.js/, file);
    }
    const hasBanner = ['index.html', 'about.html', 'mission.html', 'get-trained.html', 'contact.html', 'mmwu.html', 'the-initiative.html', 'wise-global.html'].includes(file);
    assert.equal((html.match(/id="free-ebook"/g) || []).length, hasBanner ? 1 : 0, file);
    assert.equal(html.includes('/styles/ebook.css'), hasBanner, file);
    assert.doesNotMatch(html, /id="ebookOverlay"|class="ebook-cta"|\/js\/ebook\.js/, file);
    assert.doesNotMatch(html, /\/js\/pages\/[a-z-]+-2\.js/);
  }
});
