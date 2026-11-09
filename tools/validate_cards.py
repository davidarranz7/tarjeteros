"""Check that the flashcard catalog stays consistent as later modules are added."""
import collections
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / 'src/data/module-01.json'
data = json.loads(source.read_text(encoding='utf-8'))
assert data['id'] == '01'
assert len(data['topics']) == 14, 'Module 1 must keep the 14 syllabus blocks'
topics = {topic['id'] for topic in data['topics']}
ids = set()
for card in data['cards']:
    assert card['id'] not in ids, 'Duplicate card id: ' + card['id']
    ids.add(card['id'])
    assert card['moduleId'] == '01'
    assert card['topicId'] in topics
    assert card['difficulty'] in ('basic', 'intermediate', 'advanced')
    assert card['kind'] in ('concept', 'code', 'pitfall', 'design', 'mentor')
    assert card['origin'] in ('plan', 'conversation', 'extension')
    assert len(card['question'].strip()) >= 20
    assert len(card['answer'].strip()) >= 25
    assert '\x00' not in card['answer']
count = collections.Counter(c['topicId'] for c in data['cards'])
assert all(count[topic] >= 7 for topic in topics), count
assert len(ids) >= 200
print(f"OK: {len(ids)} cards across {len(topics)} topics; no duplicates.")
for topic in data['topics']:
    print(f"  {topic['shortName']:<22} {count[topic['id']]:>3}")
