from pathlib import Path
import re

# filename = '.\\6_event_loop\\index.html'
for filename in Path('./').glob('**/*.html'):
    with open (filename, 'r+', encoding="utf-8") as f:
        content = f.read()
        content = re.sub(r'<pre>\s+<code', r'<pre><code', content)
        content = re.sub(r'(    |\t)</code>\s+</pre>', r'</code></pre>', content)
        f.seek(0)
        f.write(content)
        f.truncate()
