import requests
from bs4 import BeautifulSoup

url_list = ["https://snehasish.dev","https://techcrunch.com"]

for url in url_list:
    # Make a request to each url
    response = requests.get(url)

    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all paragraph 'p' tags and print their text
    for p_tag in soup.find_all('p'):
        print(p_tag.text)