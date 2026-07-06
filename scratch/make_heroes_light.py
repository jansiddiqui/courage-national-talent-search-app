import os
import re

files_to_convert = [
    r"e:\courage-national-talent-search-app\src\app\admit-card-portal\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\recover-id\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\mock-exam\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\exam-instructions\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\parent-guide\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\system-check\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\verify\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\verify\[candidateId]\VerifyClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\updates\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\privacy\PrivacyClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\terms\TermsClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\refund\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\faq\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\contact\ContactClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\results\ResultsClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\for-schools\ForSchoolsClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\achievers\page.tsx",
    r"e:\courage-national-talent-search-app\src\app\announcements\AnnouncementsPageClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\prepare\PreparePageClient.tsx",
    r"e:\courage-national-talent-search-app\src\app\sample-report\page.tsx",
]

def make_light(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping (does not exist): {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace navbar theme dark to light
    new_content = content.replace('Navbar theme="dark"', 'Navbar theme="light"')
    
    # 1. Identify section or div container with bg-slate-900 and text-white
    # Pattern to match container: <section/div className="bg-slate-900 text-white pt-36 pb-16 ... shrink-0">
    # Replace bg-slate-900 with bg-white, text-white with text-slate-900 (or border-b border-slate-100 bg-white)
    container_pattern = r'(<(section|div)\s+className=")(bg-slate-900 text-white[^"]+)(")'
    def replace_container(match):
        classes = match.group(3)
        # Convert bg-slate-900 -> bg-white border-b border-slate-100
        # Convert text-white -> text-slate-800
        classes = classes.replace('bg-slate-900', 'bg-white border-b border-slate-100')
        classes = classes.replace('text-white', 'text-slate-800')
        # Remove relative overflow-hidden shrink-0 if it was part of it
        classes = classes.replace('relative overflow-hidden shrink-0', '')
        classes = classes.replace('relative overflow-hidden', '')
        return f'{match.group(1)}{classes}{match.group(4)}'
        
    new_content = re.sub(container_pattern, replace_container, new_content)
    
    # 2. Remove the bg-radial gradient absolute overlays
    # Pattern: <div className="absolute inset-0 bg-\[radial-gradient[^"]+\][^"]+" />
    # Also handles multiple overlay divs
    overlay_pattern = r'<div\s+className="absolute inset-0 bg-\[radial-gradient[^"]+\][^"]+"\s*(/>|>\s*</div>)'
    new_content = re.sub(overlay_pattern, '', new_content)
    
    # 3. Handle floating medal orbs or other floaters
    # Pattern: <div className="absolute top-[^"]+ animate-float[^"]+" />
    floater_pattern = r'<div\s+className="absolute [^"]+ animate-float[^"]+"\s*(/>|>\s*</div>)'
    new_content = re.sub(floater_pattern, '', new_content)
    
    # 4. Badges inside the hero:
    # Pattern: bg-blue-500/10 border border-blue-500/20 text-blue-400
    # Change to: bg-blue-50 border border-blue-100 text-blue-700
    badge_pattern_blue = r'bg-blue-500/10 border border-blue-500/20 text-blue-400'
    new_content = re.sub(badge_pattern_blue, 'bg-blue-50 border border-blue-100 text-blue-700', new_content)
    
    badge_pattern_amber = r'bg-amber-500/15 border border-amber-500/30 text-amber-400'
    new_content = re.sub(badge_pattern_amber, 'bg-amber-50 border border-amber-100 text-amber-700', new_content)
    
    badge_pattern_emerald = r'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
    new_content = re.sub(badge_pattern_emerald, 'bg-emerald-50 border border-emerald-100 text-emerald-700', new_content)

    badge_pattern_generic = r'bg-white/10 rounded-full border border-white/10'
    new_content = re.sub(badge_pattern_generic, 'bg-blue-50 border border-blue-100 text-blue-700', new_content)

    # 5. Heading inside the hero:
    # Change text-white to text-slate-900 in headings inside hero
    # Pattern: <h1 className="([^"]*)text-white([^"]*)"
    heading_pattern = r'(<h1\s+className="[^"]*)text-white([^"]*")'
    new_content = re.sub(heading_pattern, r'\1text-slate-900\2', new_content)
    
    # 6. Subtext inside the hero:
    # Change text-slate-400 to text-slate-500
    subtext_pattern = r'(<p\s+className="[^"]*)text-slate-400([^"]*")'
    new_content = re.sub(subtext_pattern, r'\1text-slate-500\2', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Converted hero to light in: {filepath}")
    else:
        print(f"No changes made to: {filepath}")

def main():
    for f in files_to_convert:
        make_light(f)

if __name__ == '__main__':
    main()
