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
    data = {'data': [], 'total': []}

    with open('./cleanData/' + document + '.csv') as f:
        r = csv.reader(f)
        next(r)
        for row in r:
            total = {'total': int(row[3]), 'college': row[0].strip(), 'name': row[1].strip(), 'level': row[2].strip()} # For total in one major

            for i in range(len(races)): # add dictionary of count and major information for each race
                temp = {'college': total['college'], 'name': total['name'], 'level': total['level'],
                        'race': races[i], 'count': int(row[7 + i]), 'total': total['total'], 'year': year}
                data['data'].append(temp)
                total[races[i]] = int(row[7 + i])

            data['total'].append(total)

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
            elif degree[-1] == 'D':
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
            elif len(data[collegeCode]['masters']) > 0 and majorCode == data[collegeCode]['masters'][-1]['majorCode'] and degree in mastersDegrees:
                total = int(row[8])
                for i in range(len(races)):
                    count = int(row[12 + i])
                    data[collegeCode]['masters'][-9 + i]['count'] += count
                    data[collegeCode]['masters'][-9 + i]['total'] += total
                    data[collegeCode]['mastersTotal'][-1][races[i]] += count
                data[collegeCode]['mastersTotal'][-1]['total'] += total
                continue
            elif len(data[collegeCode]['doctorate']) > 0 and majorCode == data[collegeCode]['doctorate'][-1]['majorCode'] and degree in doctorateDegrees:
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
    with open('./json/' + document + '.json', 'w') as json_file:
        json.dump(data, json_file)
    print('Done writing to json file:', document)

year = 2019
while year >= 2004:
    getSummaryData(year, str(year) + 'Summary')
    getCollegeData(year, str(year))
    year -= 1
