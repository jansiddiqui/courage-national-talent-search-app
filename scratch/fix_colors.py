import os
import re

# Definitions of replacements to make
replacements = {
    # Non-standard slates
    r'\btext-slate-450\b': 'text-slate-400',
    r'\bbg-slate-450\b': 'bg-slate-500',
    r'\bborder-slate-450\b': 'border-slate-400',
    r'\btext-slate-350\b': 'text-slate-400',
    r'\bbg-slate-350\b': 'bg-slate-400',
    r'\bborder-slate-350\b': 'border-slate-300',
    r'\bhover:border-slate-350\b': 'hover:border-slate-300',
    r'\btext-slate-505\b': 'text-slate-500',
    r'\bhover:text-slate-655\b': 'hover:text-slate-700',
    
    # Non-standard indigos
    r'\bindigo-650\b': 'indigo-600',
    r'\bvia-indigo-650\b': 'via-indigo-600',
    r'\bto-indigo-650\b': 'to-indigo-600',
    r'\btext-indigo-650\b': 'text-indigo-600',
    r'\bbg-indigo-650\b': 'bg-indigo-600',
    
    # Non-standard purples
    r'\bpurple-650\b': 'purple-600',
    r'\bbg-purple-650\b': 'bg-purple-600',
    r'\btext-purple-650\b': 'text-purple-600',
    
    # Non-standard reds
    r'\bred-650\b': 'red-600',
    r'\btext-red-650\b': 'text-red-600',
    r'\bbg-red-650\b': 'bg-red-600',
    
    # Non-standard blues
    r'\bblue-850\b': 'blue-800',
    r'\bbg-blue-850\b': 'bg-blue-800',
    r'\btext-blue-850\b': 'text-blue-800',
    r'\bfocus:ring-blue-850\b': 'focus:ring-blue-800',
    r'\bfocus:border-blue-850\b': 'focus:border-blue-800',
    r'\bshadow-blue-850\b': 'shadow-blue-800',
    r'\bborder-blue-850\b': 'border-blue-800',
}

src_dir = r"e:\courage-national-talent-search-app\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    modified = False
    
    for pattern, replacement in replacements.items():
        if re.search(pattern, new_content):
            new_content = re.sub(pattern, replacement, new_content)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed non-standard colors in: {filepath}")

def main():
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css', '.js')):
                filepath = os.path.join(root, file)
                process_file(filepath)

if __name__ == '__main__':
    main()
