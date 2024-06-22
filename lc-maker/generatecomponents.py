
import json
import collections
def load_json(file_path):
    # print(json.loads(file_path))
    with open(file_path) as f:
        data = json.load(f)
    return data

def parse_list(data: dict):
    count = 0
    majorkey = collections.defaultdict(list) 
    for key in data.keys():
        for value in data[key]:
            try:
                [x for x in value['src'].split("/") if x][-1]
            except:
                continue
            majorkey[key.split("  ")[0]].append(
                {
                    "title": value['title'],
                    'ID': value['title'].split(". ")[0],
                    'src': [x for x in value['src'].split("/") if x][-1],
                    'majorkey': key.split("  ")[0],
                    'minorkey': key.split("  ")[1],
                    'score': indexRating.get(value['title'].split(". ")[0]) 
                }
                                                )
    parsed = []

    for k,v in majorkey.items():
        # parsed.append({
            # "title" : k,
            # "child" : []
        # })
        sub = {} 
        for val in v:
            if not val['minorkey'] in sub.keys():
                sub[val['minorkey']] = []
            sub[val['minorkey']].append({
                'title': val['title'],
                'src': val['src'], 
            })
        # print(sub)
    return majorkey    

def parse_difficulty(data: list):
    indexRating = {}
    for val in data:
        indexRating[str(val['ID'])] = str(int(val["Rating"]))
    return indexRating 

if __name__ == "__main__":
    c = load_json("rating.json")
    indexRating = parse_difficulty(c)
    question_list = load_json("list_algo.json")
    parse_list(question_list)

    # printList()
    # The printList function is used to print the LeetCode problem list in markdown format.
    # The LeetCode problem list is stored in the list_algo.json file.
    # The list_algo.json file is used to generate the LeetCode problem list.
    # The LeetCode problem list is stored in the list_algo.md file.
    # The list_algo.md file is used to display the LeetCode problem list    