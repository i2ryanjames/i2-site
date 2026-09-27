"""Browser behavior checks; never submit forms, payments, or external messages."""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGE = '8'
BASE = ['npm', 'exec', '--yes', '--package=chrome-devtools-mcp', '--', 'chrome-devtools']
results = {}

def run(*args):
    value = subprocess.run(BASE + list(args), capture_output=True, text=True, timeout=90)
    if value.returncode or 'Error:' in value.stdout:
        raise RuntimeError(value.stdout + value.stderr)
    return value.stdout

def evaluate(script):
    output = run('evaluate_script', script, '--pageId', PAGE)
    match = re.search(r'```json\s*(.*?)\s*```', output, re.S)
    return json.loads(match.group(1))

def check(name, value):
    results[name] = value
    (ROOT / 'quiz-qa.json').write_text(json.dumps(results, indent=2))
    print(name + ': ' + json.dumps(value), flush=True)

evaluate("() => { sessionStorage.clear(); localStorage.removeItem('i2-consent-v1'); return true; }")
run('navigate_page', PAGE, '--type', 'reload', '--ignoreCache', 'true')
value = evaluate("async () => { await new Promise(r=>setTimeout(r,6500)); return {quizClosed:!document.querySelector('dialog').open, privacyVisible:!document.querySelector('.i2-consent').hidden}; }")
assert value['quizClosed'] and value['privacyVisible']; check('privacy_before_automatic_quiz', value)
value = evaluate("async () => { document.querySelector('[data-consent=reject]').click(); await new Promise(r=>setTimeout(r,6500)); return {quizOpen:document.querySelector('dialog').open, videosAllowed:I2Consent.mediaAllowed(), focus:document.activeElement.id}; }")
assert value['quizOpen'] and not value['videosAllowed']; check('reject_optional_still_opens_guide', value)
run('press_key', PAGE, 'Escape')
value = evaluate("() => ({closed:!document.querySelector('dialog').open, remembered:sessionStorage.getItem('i2_pathfinder_dismissed'), focusReturned:document.activeElement.hasAttribute('data-quiz-open'), bodyUnlocked:!document.body.classList.contains('i2-quiz-open')})")
assert value['closed'] and value['remembered'] == 'true' and value['focusReturned'] and value['bodyUnlocked']; check('escape_focus_and_persistence', value)
run('navigate_page', PAGE, '--type', 'reload', '--ignoreCache', 'true')
value = evaluate("async () => { await new Promise(r=>setTimeout(r,6500)); return !document.querySelector('dialog').open; }")
assert value; check('no_repeat_after_reload', value)

value = evaluate("""() => {
 const expected = {
 network:['/contact?topic=initiative#contact-form','/the-initiative','https://www.i2ministries-emfci.com/','/wise-global'],
 donor:['/donate','/contact?topic=giving#contact-form','/mmwu','/donate-form'],
 church:['/get-trained','/the-initiative','/wise-global'],
 learner:['https://thewadi.org','/mmwu','/get-trained']};
 const rows=[];
 for (const [role,links] of Object.entries(expected)) {
   for (let index=0;index<links.length;index++) {
     document.querySelector('[data-quiz-open]').click();
     document.querySelector('[data-quiz-role='+role+']').click();
     const step2=document.querySelector('[data-quiz-progress]').textContent==='Question 2 of 2';
     document.querySelector('[data-quiz-choice="'+index+'"]').click();
     const actual=document.querySelector('.i2-quiz__link--primary').getAttribute('href');
     const title=document.querySelector('#i2-quiz-title').textContent;
     const focused=document.activeElement.id==='i2-quiz-title';
     document.querySelector('[data-quiz-back]').click();
     const backToChoices=!!document.querySelector('[data-quiz-choice]');
     document.querySelector('[data-quiz-back]').click();
     const backToRoles=document.querySelectorAll('[data-quiz-role]').length===4;
     document.querySelector('[data-quiz-close]').click();
     rows.push({role,index,title,actual,passed:step2&&actual===links[index]&&focused&&backToChoices&&backToRoles});
   }
 }
 return rows;
}""")
assert len(value) == 14 and all(item['passed'] for item in value); check('all_fourteen_routes_and_back_navigation', value)

for width, height in [(320,640),(390,844),(484,820),(720,390),(1440,1000)]:
    run('emulate', PAGE, '--viewport', f'{width}x{height}x1' + (',mobile,touch' if width < 800 else ''))
    value = evaluate("""() => {
      document.querySelector('[data-quiz-open]').click();
      const dialog=document.querySelector('dialog');const rect=dialog.getBoundingClientRect();
      const entryFits=rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight&&dialog.scrollWidth<=dialog.clientWidth;
      const targets=[...dialog.querySelectorAll('button:not([hidden]),a')].filter(e=>e.getClientRects().length).every(e=>e.getBoundingClientRect().height>=44);
      document.querySelector('[data-quiz-role=network]').click();document.querySelector('[data-quiz-choice="0"]').click();
      const resultFits=dialog.scrollWidth<=dialog.clientWidth;
      return {entryFits,targets,resultFits,width:innerWidth,height:innerHeight,focusInside:dialog.contains(document.activeElement)};
    }""")
    assert value['entryFits'] and value['targets'] and value['resultFits'] and value['focusInside']; check(f'viewport_{width}', value)
    if width in [390,1440]:
        run('take_screenshot', PAGE, '--filePath', str(ROOT / f'quiz-result-{width}.png'))
    evaluate("() => {document.querySelector('[data-quiz-close]').click();return true;}")

evaluate("() => {document.querySelector('[data-quiz-open]').click();document.querySelector('[data-quiz-close]').focus();return true;}")
for _ in range(12):
    run('press_key', PAGE, 'Tab')
    assert evaluate("() => document.querySelector('dialog').contains(document.activeElement)")
check('keyboard_focus_stays_inside', True)
run('take_screenshot', PAGE, '--filePath', str(ROOT / 'quiz-entry-desktop.png'))
check('third_party_resources', evaluate("() => performance.getEntriesByType('resource').map(x=>x.name).filter(x=>new URL(x).origin!==location.origin)"))
print('All quiz browser checks passed.', flush=True)
