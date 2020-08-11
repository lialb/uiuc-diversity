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
    graduate = set()
    with open('./cleanData/2019.csv') as f:
        r = csv.reader(f)
        next(r)
        for row in r:
            degree = row[3].strip()
            if degree == '' or degree == 'NDEG':
                continue
            if degree[0] == 'B' or degree == 'NONE':
                undergrad.add(degree)
            else:
                graduate.add(degree)
        return undergrad, graduate
print(getDegrees())


undergradDegrees, graduateDegrees = getDegrees()

colleges = ['KL', 'KM', 'KN', 'KP', 'KR', 'KS', 'KT', 'KU',
            'KV', 'KW', 'KY', 'LC', 'LG', 'LL', 'LN', 'LP', 'LT', 'NB']

# College, Major Code, Degree, Major Name, Race
# Total, races..., Major Code, Major Name, 
def getCollegeData(year, document):
    data = {}
    for college in colleges:
        data[college] = {'undergraduate': [], 'graduate': [], 'undergradTotal' : [], 'graduateTotal': []}

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
            elif len(data[collegeCode]['graduate']) > 0 and majorCode == data[collegeCode]['graduate'][-1]['majorCode'] and degree in graduateDegrees:
                total = int(row[8])
                for i in range(len(races)):
                    count = int(row[12 + i])
                    data[collegeCode]['graduate'][-9 + i]['count'] += count
                    data[collegeCode]['graduate'][-9 + i]['total'] += total
                    data[collegeCode]['graduateTotal'][-1][races[i]] += count
                data[collegeCode]['graduateTotal'][-1]['total'] += total
                continue
            # if it is a new major, add it
            total = {'major': major, 'degree': degree, 'college' : collegeCode, 'majorCode': majorCode, 'year': year, 'total': int(row[8])}
            for i in range(len(races)):
                count = int(row[12 + i])
                temp = {'race': races[i], 'count' : count, 'total': int(row[8]), 'major': major, 'degree': degree, 'college' : collegeCode, 'majorCode': majorCode, 'year': year}
                if temp['degree'].strip() in undergradDegrees:
                    data[collegeCode]['undergraduate'].append(temp)
                else:
                    data[collegeCode]['graduate'].append(temp)
                total[races[i]] = count
            if temp['degree'] in undergradDegrees:
                data[collegeCode]['undergradTotal'].append(total)
            else:
                data[collegeCode]['graduateTotal'].append(total)
    # print(data)
    writeToJSON(data, document)
                

def writeToJSON(data, document):
    with open('./json/' + document + '.json', 'w') as json_file:
        json.dump(data, json_file)
    print('Done writing to json file:', document)

year = 2016
while year >= 2004:
    getSummaryData(year, str(year) + 'Summary')
    getCollegeData(year, str(year))
    year -= 1
