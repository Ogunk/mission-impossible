import csv
import json
import requests

#According to local work or not choose the right URL

POST_HEADERS = {'Content-Type': 'application/json'}
#PRODUCT_ADD_URL = 'https://wpruvahz4c.execute-api.us-east-1.amazonaws.com/dev/add-products'
PRODUCT_ADD_URL = 'http://localhost:3000/add-products'

GET_HEADERS = {'Content-Type': 'application/product'}
#GET_PRODUCT_URL = 'https://wpruvahz4c.execute-api.us-east-1.amazonaws.com/dev/product/'
GET_PRODUCT_URL = 'http://localhost:3000/product/'

#Open the CSV File and add the column in one array and add the product details in another array
with open('Database.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    firstLine = True
    columnsList = []
    productsList = []

    #Checking if firstLine for storing the columns names
    #Else store in the product array
    for row in csv_reader:
        if firstLine:
            columnsList.append(row)
            firstLine = False
        else:
            productsList.append(row)

#Creating an empty dictionnary for the key, value of the datas
donneesAAjouter = {}

#Loop through the arrays and add them
for i in range(len(productsList)):
    donneesAAjouter[columnsList[0][0].replace(" ", "").upper()] = int(productsList[i][0])
    for j in range(1, len(columnsList[0])):
        if productsList[i][j] != "":
            donneesAAjouter[columnsList[0][j].replace(" ", "").upper()] = productsList[i][j]

    donneesJSON = json.dumps(donneesAAjouter)
    #print(donneesJSON)
    postResponse = requests.post(PRODUCT_ADD_URL, headers=POST_HEADERS, data=donneesJSON)
    print(postResponse)

    getResponse = requests.get(GET_PRODUCT_URL+productsList[i][0], headers=GET_HEADERS)
    print(getResponse.json())