import json
import sys
import re

def recover_from_main():
    log_path = r'C:\Users\Legion\.gemini\antigravity\brain\05768653-e722-41b3-a193-fa213ec097c8\.system_generated\logs\transcript.jsonl'
    lines = open(log_path, encoding='utf-8').readlines()
    
    last_content = {}
    
    for line in lines:
        try:
            obj = json.loads(line)
        except:
            continue
            
        if obj.get('type') == 'PLANNER_RESPONSE' or obj.get('type') == 'TOOL_CALL':
            calls = obj.get('tool_calls', [])
            for c in calls:
                name = c.get('function', {}).get('name')
                if name == 'write_to_file':
                    try:
                        args = json.loads(c['function']['arguments'])
                        file = args.get('TargetFile', '')
                        if 'index.tsx' in file or 'styles.css' in file or 'AppShell.tsx' in file or 'UI.tsx' in file:
                            last_content[file] = args.get('CodeContent', '')
                            print(f'Found full write for {file}')
                    except Exception as e:
                        pass
                elif name == 'replace_file_content':
                    try:
                        args = json.loads(c['function']['arguments'])
                        file = args.get('TargetFile', '')
                        if 'index.tsx' in file or 'styles.css' in file or 'AppShell.tsx' in file or 'UI.tsx' in file:
                            # replace_file_content is harder, let's just find the content from view_file
                            pass
                    except Exception as e:
                        pass

    # also check view_file responses
    for i, line in enumerate(lines):
        try:
            obj = json.loads(line)
        except:
            continue
        if obj.get('type') == 'TOOL_RESPONSE':
            content = obj.get('content', '')
            if 'The following code has been modified' in content:
                # find the file path
                m_path = re.search(r'File Path: `file:///(.*?)`', content)
                if m_path:
                    file = m_path.group(1).replace('/', '\\')
                    if 'index.tsx' in file or 'styles.css' in file or 'AppShell.tsx' in file or 'UI.tsx' in file:
                        m_code = re.search(r'(?:<original_line>\. Please note.*?\n)(.*)(?:\nThe above content shows)', content, re.DOTALL)
                        if m_code:
                            raw_code = m_code.group(1)
                            clean_code = re.sub(r'^\d+: ', '', raw_code, flags=re.MULTILINE)
                            last_content[file] = clean_code
                            print(f'Found view_file for {file}')

    for k, v in last_content.items():
        try:
            with open(k, 'w', encoding='utf-8') as f:
                f.write(v)
            print(f'Recovered {k}')
        except Exception as e:
            print(f'Failed to write {k}: {e}')

if __name__ == '__main__':
    recover_from_main()
