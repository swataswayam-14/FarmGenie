import mysql.connector
import pandas as pd
from tqdm import tqdm

conn = mysql.connector.connect(host='localhost', password='mist786%', user='root', port=33061)
cursor = conn.cursor()
cursor.execute('USE amazon_agricultural_products')

if conn.is_connected():
    print("Ok")

def insert_reviews():
    reviews = pd.read_excel('reviews-updated.xlsx')
    print(reviews.isnull().sum())
    for i in tqdm(range(reviews.shape[0])):

        sql = "INSERT INTO product_reviews (score, title, url, dateAndLocation, description, isVerified, ASIN, Sentiment) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = [
            (int(reviews.iloc[i][0]), reviews.iloc[i][1], reviews.iloc[i][2], reviews.iloc[i][3], reviews.iloc[i][4], str(reviews.iloc[i][5]), reviews.iloc[i][6], reviews.iloc[i][7]),
        ]
        cursor.executemany(sql, values)
        conn.commit()

    # print(f"{cursor.rowcount} records inserted successfully")

def insert_product_details():
    
    products = pd.read_excel('dataset_amazon-scraper_2024-07-27_13-19-29-230.xlsx')
    
    print(products.isnull().sum())
    for i in tqdm(range(products.shape[0])):

        sql = "INSERT INTO product_details (ASIN, image_url, isPrime, product_url, amount, ratingsCount, stars, title) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = [
            (products.iloc[i][0], products.iloc[i][1], str(products.iloc[i][2]), products.iloc[i][3], int(products.iloc[i][4]), float(products.iloc[i][5]), float(products.iloc[i][6]), products.iloc[i][7]),
        ]
        cursor.executemany(sql, values)
        conn.commit()
        
    
    
    
    
    
    
def main():
    
    # insert_reviews()
    insert_product_details()
    
    

if __name__ == "__main__":
    main()