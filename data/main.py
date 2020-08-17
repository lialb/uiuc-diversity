import csv
import json

'''
    Python for getting json data for frontend. First we download the data from http://dmi.illinois.edu/ and put in the ./rawData directory.
    Then we remove some headers and turn them into csv's in the cleanData directory.
    Finally, this script adds to turns the csv into json for our visualizations.
'''

races = ['Caucasian', 'Asian American', 'African American', 'Hispanic',
         'Native American', 'Hawaiian/ Pacific Isl', 'Multiracial', 'International', 'Unknown']

def getSummaryData(year, document):
    data = {'undergradTotal': [], 'gradTotal': []}

    with open('./cleanData/' + document + '.csv') as f:
        r = csv.reader(f)
        next(r)
        for row in r:
            level = row[2].strip()
            total = {'college': row[0].strip(), 'name': row[1].strip(), 'level': level, 'total': int(row[3].strip()), 'year': year }

            for i in range(len(races)): # add dictionary of count and major information for each race
                total[races[i]] = int(row[7 + i].strip())
            if level == 'Undergraduate':
                data['undergradTotal'].append(total)
            else:
                data['gradTotal'].append(total)
    

    writeToJSON(data, document)

def getDegrees():
    undergrad = set()
    masters = set()
    doctorate = set()
    nondegree = set()
    with open('./cleanData/2019.csv') as f:
        r = csv.reader(f)
        next(r)
        for row in r:
            degree = row[3].strip()
            if degree == '':
                continue
            if degree[0] == 'B':
                undergrad.add(degree)
            elif degree == 'NONE' or degree == 'NDEG':
                nondegree.add(degree)
            elif degree[-1] == 'D' or degree == 'DVM':
                doctorate.add(degree)
            else:
                masters.add(degree)
        return undergrad, masters, doctorate, nondegree
print(getDegrees())


undergradDegrees, mastersDegrees, doctorateDegrees, nondegrees = getDegrees()

colleges = ['KL', 'KM', 'KN', 'KP', 'KR', 'KS', 'KT', 'KU',
            'KV', 'KW', 'KY', 'LC', 'LG', 'LL', 'LN', 'LP', 'LT', 'NB']

# College, Major Code, Degree, Major Name, Race
# Total, races..., Major Code, Major Name, 
def getCollegeData(year, document):
    data = {}
    for college in colleges:
        data[college] = {'undergraduate': [], 'masters': [], 'doctorate': [], 'nondegree': [], 'undergradTotal' : [], 'mastersTotal': [], 'doctorateTotal': [], 'nondegreeTotal': []}

    with open('./cleanData/' + document + '.csv') as f:
        r = csv.reader(f)
        next(r)
        for row in r:
            if row[2].strip() == '':
                continue
            
            collegeCode = row[1].strip()
            if collegeCode in ('LE', 'LM'): # For Institute of Aviation, Provost
                continue
            majorCode = int(row[4])
            major = row[5].strip()
            degree = row[3].strip()

            if len(data[collegeCode]['undergraduate']) > 0 and majorCode == data[collegeCode]['undergraduate'][-1]['majorCode'] and degree in undergradDegrees: # Check if same major code, different concentration
                total = int(row[8])
                for i in range(len(races)):
                    count = int(row[12 + i])
                    data[collegeCode]['undergraduate'][-9 + i]['count'] += count # Add previous values for each race
                    data[collegeCode]['undergraduate'][-9 + i]['total'] += total 
                    data[collegeCode]['undergradTotal'][-1][races[i]] += count # For total in one major
                data[collegeCode]['undergradTotal'][-1]['total'] += total # update totals
                continue
            elif len(data[collegeCode]['masters']) > 0 and majorCode == data[collegeCode]['masters'][-1]['majorCode'] and degree == data[collegeCode]['masters'][-1]['degree'] and degree in mastersDegrees:
                total = int(row[8])
                for i in range(len(races)):
                    count = int(row[12 + i])
                    data[collegeCode]['masters'][-9 + i]['count'] += count
                    data[collegeCode]['masters'][-9 + i]['total'] += total
                    data[collegeCode]['mastersTotal'][-1][races[i]] += count
                data[collegeCode]['mastersTotal'][-1]['total'] += total
                continue
            elif len(data[collegeCode]['doctorate']) > 0 and majorCode == data[collegeCode]['doctorate'][-1]['majorCode'] and degree == data[collegeCode]['doctorate'][-1]['degree'] and degree in doctorateDegrees:
                total = int(row[8])
                for i in range(len(races)):
                    count = int(row[12 + i])
                    data[collegeCode]['doctorate'][-9 + i]['count'] += count
                    data[collegeCode]['doctorate'][-9 + i]['total'] += total
                    data[collegeCode]['doctorateTotal'][-1][races[i]] += count
                data[collegeCode]['doctorateTotal'][-1]['total'] += total
                continue
            elif len(data[collegeCode]['nondegree']) > 0 and majorCode == data[collegeCode]['nondegree'][-1]['majorCode'] and degree in nondegrees:
                total = int(row[8])
                for i in range(len(races)):
                    count = int(row[12 + i])
                    data[collegeCode]['nondegree'][-9 + i]['count'] += count
                    data[collegeCode]['nondegree'][-9 + i]['total'] += total
                    data[collegeCode]['nondegreeTotal'][-1][races[i]] += count
                data[collegeCode]['nondegreeTotal'][-1]['total'] += total
                continue

            # if it is a new major, add it
            total = {'major': major, 'degree': degree, 'college' : collegeCode, 'majorCode': majorCode, 'year': year, 'total': int(row[8])}
            for i in range(len(races)):
                count = int(row[12 + i])
                temp = {'race': races[i], 'count' : count, 'total': int(row[8]), 'major': major, 'degree': degree, 'college' : collegeCode, 'majorCode': majorCode, 'year': year}
                if degree in undergradDegrees:
                    data[collegeCode]['undergraduate'].append(temp)
                elif degree in mastersDegrees:
                    data[collegeCode]['masters'].append(temp)
                elif degree in doctorateDegrees:
                    data[collegeCode]['doctorate'].append(temp)
                else:
                    data[collegeCode]['nondegree'].append(temp)
                total[races[i]] = count

            if degree in undergradDegrees:
                data[collegeCode]['undergradTotal'].append(total)
            elif degree in mastersDegrees:
                data[collegeCode]['mastersTotal'].append(total)
            elif degree in doctorateDegrees:
                data[collegeCode]['doctorateTotal'].append(total)
            else:
                data[collegeCode]['nondegreeTotal'].append(total)
    # print(data)
    writeToJSON(data, document)
                

def writeToJSON(data, document):
    with open('../client/src/assets/json/' + document + '.json', 'w') as json_file:
    # with open('./json/' + document + '.json', 'w') as json_file:
        json.dump(data, json_file)
    print('Done writing to json file:', document)

# year = 2019
# while year >= 2004:
#     getSummaryData(year, str(year) + 'Summary')
#     # getCollegeData(year, str(year))
#     year -= 1
# year = 2019
# getSummaryData(year, str(year) + 'Summary')

def getCombinedCollegeData():
    data = {}
    for college in colleges:
# [{'data': [None for _ in range(16)], 'label' : race} for race in races]
        data[college] = { 'undergradTotal': {}, 
        'mastersTotal': {},
        'doctorateTotal': {},
        'nondegreeTotal': {} }
    # data = { 'KP': 'undergradTotal: { 112: [{'data': [], 'label': caucasian }] } }
    year = 2019
    while year >= 2004:
        document = str(year)

        with open('./cleanData/' + document + '.csv') as f:
            r = csv.reader(f)
            next(r)
            for row in r:
                if row[2].strip() == '':
                    continue
                
                collegeCode = row[1].strip()
                if collegeCode in ('LE', 'LM'): # For Institute of Aviation, Provost
                    continue
                majorCode = int(row[4])
                if majorCode == 338: # major code changed for psychology
                    majorCode = 5535
                degree = row[3].strip()
                if year <= 2009:
                    if degree in undergradDegrees:
                        if majorCode not in data[collegeCode]['undergradTotal']:
                            data[collegeCode]['undergradTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]

                            for i in range(len(races) - 2):
                                data[collegeCode]['undergradTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                        else:
                            for i in range(len(races) - 2):
                                if data[collegeCode]['undergradTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] is not None:
                                    data[collegeCode]['undergradTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] += int(row[12 + i].strip())
                                else:
                                    data[collegeCode]['undergradTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())

                    elif degree in mastersDegrees:
                        if majorCode not in data[collegeCode]['mastersTotal']:
                            data[collegeCode]['mastersTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]
                            for i in range(len(races) - 2):
                                data[collegeCode]['mastersTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                        else:
                            for i in range(len(races) - 2):
                                if data[collegeCode]['mastersTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] is not None:
                                    data[collegeCode]['mastersTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] += int(row[12 + i].strip())
                                else:
                                    data[collegeCode]['mastersTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                    elif degree in doctorateDegrees:
                        if majorCode not in data[collegeCode]['doctorateTotal']:
                            data[collegeCode]['doctorateTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]
                            for i in range(len(races) - 2):
                                data[collegeCode]['doctorateTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                        else:
                            for i in range(len(races) - 2):
                                if data[collegeCode]['doctorateTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] is not None:
                                    data[collegeCode]['doctorateTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] += int(row[12 + i].strip())
                                else:
                                    data[collegeCode]['doctorateTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                    elif degree in nondegrees:
                        if majorCode not in data[collegeCode]['nondegreeTotal']:
                            data[collegeCode]['nondegreeTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]
                            for i in range(len(races) - 2):
                                data[collegeCode]['nondegreeTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                        else:
                            for i in range(len(races) - 2):
                                if data[collegeCode]['nondegreeTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] is not None:
                                    data[collegeCode]['nondegreeTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] += int(row[12 + i].strip())
                                else:
                                    data[collegeCode]['nondegreeTotal'][majorCode][i if i < 5 else i + 2]['data'][year - 2004] = int(row[12 + i].strip())
                    continue
                if degree in undergradDegrees:
                    if majorCode not in data[collegeCode]['undergradTotal']:
                        data[collegeCode]['undergradTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]

                        for i in range(len(races)):
                            data[collegeCode]['undergradTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
                    else:
                        for i in range(len(races)):
                            if data[collegeCode]['undergradTotal'][majorCode][i]['data'][year - 2004] is not None:
                                data[collegeCode]['undergradTotal'][majorCode][i]['data'][year - 2004] += int(row[12 + i].strip())
                            else:
                                data[collegeCode]['undergradTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())

                elif degree in mastersDegrees:
                    if majorCode not in data[collegeCode]['mastersTotal']:
                        data[collegeCode]['mastersTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]
                        for i in range(len(races)):
                            data[collegeCode]['mastersTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
                    else:
                        for i in range(len(races)):
                            if data[collegeCode]['mastersTotal'][majorCode][i]['data'][year - 2004] is not None:
                                data[collegeCode]['mastersTotal'][majorCode][i]['data'][year - 2004] += int(row[12 + i].strip())
                            else:
                                data[collegeCode]['mastersTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
                elif degree in doctorateDegrees:
                    if majorCode not in data[collegeCode]['doctorateTotal']:
                        data[collegeCode]['doctorateTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]
                        for i in range(len(races)):
                            data[collegeCode]['doctorateTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
                    else:
                        for i in range(len(races)):
                            if data[collegeCode]['doctorateTotal'][majorCode][i]['data'][year - 2004] is not None:
                                data[collegeCode]['doctorateTotal'][majorCode][i]['data'][year - 2004] += int(row[12 + i].strip())
                            else:
                                data[collegeCode]['doctorateTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
                elif degree in nondegrees:
                    if majorCode not in data[collegeCode]['nondegreeTotal']:
                        data[collegeCode]['nondegreeTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : race} for race in races]
                        for i in range(len(races)):
                            data[collegeCode]['nondegreeTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
                    else:
                        for i in range(len(races)):
                            if data[collegeCode]['nondegreeTotal'][majorCode][i]['data'][year - 2004] is not None:
                                data[collegeCode]['nondegreeTotal'][majorCode][i]['data'][year - 2004] += int(row[12 + i].strip())
                            else:
                                data[collegeCode]['nondegreeTotal'][majorCode][i]['data'][year - 2004] = int(row[12 + i].strip())
        print(year)
        year -= 1
    writeToJSON(data, 'combinedCollege')

# getCombinedCollegeData()

def getCombinedSummaryData():
    data = {}
    for college in colleges:
        data[college] = { 'undergradTotal': [{'data': [None for _ in range(16)], 'label' : race} for race in races], 'gradTotal': [{'data': [None for _ in range(16)], 'label' : race} for race in races] }
    # data = { 'KP' : 'undergradTotal' : [{'data': [], 'label': 'Caucasian'}]}
    year = 2019
    while year >= 2004:
        document = str(year) + 'Summary'
        with open('./cleanData/' + document + '.csv') as f:
            r = csv.reader(f)
            next(r)
            for row in r:
                college = row[0].strip()
                if college not in data:
                    continue
                level = row[2].strip()
                if year <= 2009: # no hawaiian / pacific islander or multiracial data from 2004 to 2009
                    i = 0
                    while i < len(races) - 2:
                        if level == 'Undergraduate':
                            if i >= 5:
                                data[college]['undergradTotal'][i + 2]['data'][year - 2004] = int(row[7 + i].strip())
                            else:
                                data[college]['undergradTotal'][i]['data'][year - 2004] = int(row[7 + i].strip())
                        else:
                            if i >= 5:
                                data[college]['gradTotal'][i + 2]['data'][year - 2004] = int(row[7 + i].strip())
                            else:
                                data[college]['gradTotal'][i]['data'][year - 2004] = int(row[7 + i].strip())
                        i += 1

                    continue
                for i in range(len(races)): 
                    if level == 'Undergraduate':
                        data[college]['undergradTotal'][i]['data'][year - 2004] = int(row[7 + i].strip())
                    else:
                        data[college]['gradTotal'][i]['data'][year - 2004] = int(row[7 + i].strip())

        print(year)        
        year -= 1
    

    writeToJSON(data, 'combinedSummary')

# getCombinedSummaryData()
# getCombinedCollegeData()

def getLocationInfo():
    data = {}
    labels = ['In State', 'Out of State', 'International']
    for college in colleges:
        data[college] = { 'undergradTotal': [{'data': [None for _ in range(16)], 'label' : label} for label in labels], 'gradTotal': [{'data': [None for _ in range(16)], 'label' : label} for label in labels] }
    year = 2019
    while year >= 2004:
        document = str(year) + 'Summary'
        with open('./cleanData/' + document + '.csv') as f:
            r = csv.reader(f)
            next(r)
            for row in r:
                college = row[0].strip()
                if college not in data:
                    continue
                level = row[2].strip()
                if year <= 2009: # no hawaiian / pacific islander or multiracial data from 2004 to 2009
                    inState = int(row[14].strip())
                    international = int(row[12].strip())
                    outState = int(row[15].strip()) - international
                elif year < 2014:
                    inState = int(row[18].strip())
                    international = int(row[14].strip())
                    outState = int(row[19].strip()) - international
                elif year >= 2014:
                    inState = int(row[20].strip())
                    international = int(row[14].strip())
                    outState = int(row[21].strip()) - international

                if level == 'Undergraduate':
                    data[college]['undergradTotal'][0]['data'][year - 2004] = inState
                    data[college]['undergradTotal'][1]['data'][year - 2004] = outState
                    data[college]['undergradTotal'][2]['data'][year - 2004] = international
                else:
                    data[college]['gradTotal'][0]['data'][year - 2004] = inState
                    data[college]['gradTotal'][1]['data'][year - 2004] = outState
                    data[college]['gradTotal'][2]['data'][year - 2004] = international
        print(year)        
        year -= 1
    writeToJSON(data, 'locationSummary')

def getMajorLocationInfo():
    data = {}
    labels = ['In State', 'Out of State', 'International']
    for college in colleges:
    # [{'data': [None for _ in range(16)], 'label' : label} for label in labels]
        data[college] = { 'undergradTotal': {}, 
        'mastersTotal': {},
        'doctorateTotal': {},
        'nondegreeTotal': {} }
    year = 2019
    while year >= 2004:
        document = str(year)
        with open('./cleanData/' + document + '.csv') as f:
            r = csv.reader(f)
            next(r)
            for row in r:
                if row[2].strip() == '':
                    continue
                
                collegeCode = row[1].strip()
                if collegeCode in ('LE', 'LM'): # For Institute of Aviation, Provost
                    continue
                majorCode = int(row[4])
                if majorCode == 338: # major code changed for psychology
                    majorCode = 5535
                degree = row[3].strip()
                instate, international, outstate = 0, 0, 0
                if year <= 2009: # 
                    inState = int(row[19].strip())
                    international = int(row[17].strip())
                    outState = int(row[20].strip()) - international
                elif year < 2014:
                    inState = int(row[23].strip())
                    international = int(row[19].strip())
                    outState = int(row[24].strip()) - international
                elif year >= 2014:
                    inState = int(row[25].strip())
                    international = int(row[19].strip())
                    outState = int(row[26].strip()) - international

                if degree in undergradDegrees:
                    if majorCode not in data[collegeCode]['undergradTotal']:
                        data[collegeCode]['undergradTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : label} for label in labels]
                        data[collegeCode]['undergradTotal'][majorCode][0]['data'][year - 2004] = inState
                        data[collegeCode]['undergradTotal'][majorCode][1]['data'][year - 2004] = outState
                        data[collegeCode]['undergradTotal'][majorCode][2]['data'][year - 2004] = international
                    else:
                        if data[collegeCode]['undergradTotal'][majorCode][0]['data'][year - 2004] is not None:
                            data[collegeCode]['undergradTotal'][majorCode][0]['data'][year - 2004] += inState
                            data[collegeCode]['undergradTotal'][majorCode][1]['data'][year - 2004] += outState
                            data[collegeCode]['undergradTotal'][majorCode][2]['data'][year - 2004] += international
                        else:
                            data[collegeCode]['undergradTotal'][majorCode][0]['data'][year - 2004] = inState
                            data[collegeCode]['undergradTotal'][majorCode][1]['data'][year - 2004] = outState
                            data[collegeCode]['undergradTotal'][majorCode][2]['data'][year - 2004] = international
                elif degree in mastersDegrees:
                    if majorCode not in data[collegeCode]['mastersTotal']:
                        data[collegeCode]['mastersTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : label} for label in labels]
                        data[collegeCode]['mastersTotal'][majorCode][0]['data'][year - 2004] = inState
                        data[collegeCode]['mastersTotal'][majorCode][1]['data'][year - 2004] = outState
                        data[collegeCode]['mastersTotal'][majorCode][2]['data'][year - 2004] = international
                    else:
                        if data[collegeCode]['mastersTotal'][majorCode][0]['data'][year - 2004] is not None:
                            data[collegeCode]['mastersTotal'][majorCode][0]['data'][year - 2004] += inState
                            data[collegeCode]['mastersTotal'][majorCode][1]['data'][year - 2004] += outState
                            data[collegeCode]['mastersTotal'][majorCode][2]['data'][year - 2004] += international
                        else:
                            data[collegeCode]['mastersTotal'][majorCode][0]['data'][year - 2004] = inState
                            data[collegeCode]['mastersTotal'][majorCode][1]['data'][year - 2004] = outState
                            data[collegeCode]['mastersTotal'][majorCode][2]['data'][year - 2004] = international
                elif degree in doctorateDegrees:
                    if majorCode not in data[collegeCode]['doctorateTotal']:
                        data[collegeCode]['doctorateTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : label} for label in labels]
                        data[collegeCode]['doctorateTotal'][majorCode][0]['data'][year - 2004] = inState
                        data[collegeCode]['doctorateTotal'][majorCode][1]['data'][year - 2004] = outState
                        data[collegeCode]['doctorateTotal'][majorCode][2]['data'][year - 2004] = international
                    else:
                        if data[collegeCode]['doctorateTotal'][majorCode][0]['data'][year - 2004] is not None:
                            data[collegeCode]['doctorateTotal'][majorCode][0]['data'][year - 2004] += inState
                            data[collegeCode]['doctorateTotal'][majorCode][1]['data'][year - 2004] += outState
                            data[collegeCode]['doctorateTotal'][majorCode][2]['data'][year - 2004] += international
                        else:
                            data[collegeCode]['doctorateTotal'][majorCode][0]['data'][year - 2004] = inState
                            data[collegeCode]['doctorateTotal'][majorCode][1]['data'][year - 2004] = outState
                            data[collegeCode]['doctorateTotal'][majorCode][2]['data'][year - 2004] = international
                elif degree in nondegrees:
                    if majorCode not in data[collegeCode]['nondegreeTotal']:
                        data[collegeCode]['nondegreeTotal'][majorCode] = [{'data': [None for _ in range(16)], 'label' : label} for label in labels]
                        data[collegeCode]['nondegreeTotal'][majorCode][0]['data'][year - 2004] = inState
                        data[collegeCode]['nondegreeTotal'][majorCode][1]['data'][year - 2004] = outState
                        data[collegeCode]['nondegreeTotal'][majorCode][2]['data'][year - 2004] = international
                    else:
                        if data[collegeCode]['nondegreeTotal'][majorCode][0]['data'][year - 2004] is not None:
                            data[collegeCode]['nondegreeTotal'][majorCode][0]['data'][year - 2004] += inState
                            data[collegeCode]['nondegreeTotal'][majorCode][1]['data'][year - 2004] += outState
                            data[collegeCode]['nondegreeTotal'][majorCode][2]['data'][year - 2004] += international
                        else:
                            data[collegeCode]['nondegreeTotal'][majorCode][0]['data'][year - 2004] = inState
                            data[collegeCode]['nondegreeTotal'][majorCode][1]['data'][year - 2004] = outState
                            data[collegeCode]['nondegreeTotal'][majorCode][2]['data'][year - 2004] = international

                    
        print(year)        
        year -= 1
    writeToJSON(data, 'locationMajor')

getMajorLocationInfo()
