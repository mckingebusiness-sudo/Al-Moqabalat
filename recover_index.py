import json

log_path = r'C:\Users\Legion\.gemini\antigravity\brain\05768653-e722-41b3-a193-fa213ec097c8\.system_generated\logs\transcript.jsonl'
contents = []
with open(log_path, encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['name'] == 'replace_file_content' or tc['name'] == 'multi_replace_file_content' or tc['name'] == 'write_to_file':
                        args = tc.get('arguments', {})
                        target = args.get('TargetFile', '')
                        if 'index.tsx' in target:
                            if 'CodeContent' in args:
                                contents.append(("write_to_file", len(args['CodeContent'])))
                            elif 'ReplacementContent' in args:
                                contents.append(("replace", len(args['ReplacementContent'])))
                            elif 'ReplacementChunks' in args:
                                contents.append(("multi_replace", len(args['ReplacementChunks'])))
                    elif tc['name'] == 'view_file':
                        args = tc.get('arguments', {})
                        if 'AbsolutePath' in args and 'index.tsx' in args['AbsolutePath']:
                            contents.append(("view_file", "viewed!"))
        except Exception as e:
            pass
            
print(f"Found {len(contents)} operations on index.tsx")
for c in contents:
    print(c)
