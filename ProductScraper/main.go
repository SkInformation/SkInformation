package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	_ "github.com/go-sql-driver/mysql"
	_ "html"
	"io"
	"log"
	"net/http"
	"strings"
)

// ProductPage Represents a catalog of products
type ProductPage struct {
	url string
	cat string
}

// Product Represents a product on a ProductPage
type Product struct {
	url         string
	name        string
	desc        string
	image       []byte
	ingredients []string
}

// Constants for database seed
const (
	SQL_HOST = "127.0.0.1"
	SQL_DB   = "skincare"
	SQL_USER = "admin"
	SQL_PASS = "changeme"
)

// The database connection
var db *sql.DB

// Download products and seed in DB
func main() {
	tempDb, err := establishDbConnection()
	if err != nil {
		log.Fatalf("Failed to setup database: %v\n", err)
	}

	db = tempDb
	defer db.Close()

	//test()
	seedDatabase()
}

// test function to test various things
func test() {
	var productA = Product{
		url:         "https://www.cerave.com/skincare/cleansers/facial-cleansers/hydrating-foaming-oil-cleanser",
		name:        "Hydrating Foam Oil Cleanser",
		desc:        "For Dry to Very Dry Skin",
		image:       make([]byte, 0),
		ingredients: make([]string, 0),
	}

	//var productB = Product{
	//	url:         "https://www.cerave.com/skincare/cleansers/facial-cleansers/-acne-foaming-cream-wash-",
	//	name:        "a",
	//	desc:        "n",
	//	image:       "c",
	//	ingredients: make([]string, 0),
	//}

	//downloadIngredients(productA)
	//downloadIngredients(productB)

	//str := "AQUA/WATER, GLYCERIN, PEG-200 HYDROGENATED GLYCERYL PALMATE, COCO-BETAINE, DISODIUM COCOYL GLUTAMATE, PEG-120 METHYL GLUCOSE DIOLEATE, POLYSORBATE 20, PEG-7 GLYCERYL COCOATE, SQUALANE, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, CARBOMER, TRIETHYL CITRATE, SODIUM CHLORIDE, SODIUM HYDROXIDE, SODIUM COCOYL GLUTAMATE, SODIUM BENZOATE, SODIUM LAUROYL LACTYLATE, SODIUM HYALURONATE, CHOLESTEROL, CITRIC ACID, CAPRYLOYL GLYCINE, HYDROXYACETOPHENONE, CAPRYLYL GLYCOL, CAPRYLIC/ CAPRIC TRIGLYCERIDE, TRISODIUM ETHYLENEDIAMINE DISUCCINATE, PHYTOSPHINGOSINE, XANTHAN GUM, BENZOIC ACID, PEG-150 PENTAERYTHRITYL TETRASTEARATE, PPG-5-CETETH-20, PEG-6 CAPRYLIC/CAPRIC GLYCERIDE\n\nPlease be aware that ingredient lists for the products of our brand are updated regularly. Please refer to the ingredient list on your product package for the most up-to-date list of ingredients to ensure it is suitable for your personal use. "
	//str := "ACTIVE INGREDIENT: BENZOYL PEROXIDE 10%\nINACTIVE INGREDIENTS: WATER, GLYCERIN, PROPYLENE GLYCOL, COCAMIDOPROPYL HYDROXYSULTAINE, SODIUM C14-16 OLEFIN SULFONATE, POTASSIUM HYDROXIDE, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, CARBOMER, NIACINAMIDE, GLYCOLIC ACID, TRIDECETH-6, TRIETHYL CITRATE, SODIUM CITRATE, SODIUM HYALURONATE, SODIUM HYDROXIDE, SODIUM LAUROYL LACTYLATE, CHOLESTEROL, PROPANEDIOL, TETRASODIUM EDTA, CAPRYLYL GLYCOL, DIETHYLHEXYL SODIUM SULFOSUCCINATE, PHYTOSPHINGOSINE, XANTHAN GUM, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, BENZOIC ACID, PEG-30 DIPOLYHYDROXYSTEARATE\nPlease be aware that ingredient lists for the products of our brand are updated regularly. Please refer to the ingredient list on your product package for the most up-to-date list of ingredients to ensure it is suitable for your personal use."
	str := "INACTIVE INGREDIENTS: WATER, GLYCERIN, PROPYLENE GLYCOL, COCAMIDOPROPYL HYDROXYSULTAINE, SODIUM C14-16 OLEFIN SULFONATE, POTASSIUM HYDROXIDE, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, CARBOMER, NIACINAMIDE, GLYCOLIC ACID, TRIDECETH-6, TRIETHYL CITRATE, SODIUM CITRATE, SODIUM HYALURONATE, SODIUM HYDROXIDE, SODIUM LAUROYL LACTYLATE, CHOLESTEROL, PROPANEDIOL, TETRASODIUM EDTA, CAPRYLYL GLYCOL, DIETHYLHEXYL SODIUM SULFOSUCCINATE, PHYTOSPHINGOSINE, XANTHAN GUM, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, BENZOIC ACID, PEG-30 DIPOLYHYDROXYSTEARATE\nPlease be aware that ingredient lists for the products of our brand are updated regularly. Please refer to the ingredient list on your product package for the most up-to-date list of ingredients to ensure it is suitable for your personal use."
	ingredients := extractIngredients(str)

	productId, err := addProductToDb(productA, "MOISTURIZER", make([]byte, 0))
	if err != nil {
		fmt.Printf("Could not insert product: %s due to error: %v\n", productA.name, err)
		return
	}

	err = addIngredientsToDb(productId, ingredients)
	if err != nil {
		fmt.Printf("Could not insert ingredients for product: %s due to error; %v\n", productA.name, err)
		return
	}

	fmt.Printf("Successfully inserted!\n")
}

// seedDatabase Fills the database with scraped products and ingredients
func seedDatabase() {
	products := make([]ProductPage, 0)
	products = append(products, ProductPage{url: "https://www.cerave.com/skincare/cleansers/facial-cleansers", cat: "CLEANSER"})
	products = append(products, ProductPage{url: "https://www.cerave.com/skincare/moisturizers/facial-moisturizers", cat: "MOISTURIZER"})
	products = append(products, ProductPage{url: "https://www.cerave.com/skincare/serums", cat: "SERUM"})
	products = append(products, ProductPage{url: "https://www.cerave.com/sunscreen", cat: "SUNSCREEN"})

	for _, product := range products {
		downloadProducts(product)
	}
}

// establishDbConnection Sets up the database with the required tables
func establishDbConnection() (*sql.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/", SQL_USER, SQL_PASS, SQL_HOST)

	tempDb, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	if err := tempDb.Ping(); err != nil {
		return nil, err
	}

	_, err = tempDb.Exec("CREATE DATABASE IF NOT EXISTS " + SQL_DB)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Connected to the MySQL server and created database %s!\n", SQL_DB)

	_, err = tempDb.Exec("USE " + SQL_DB)
	if err != nil {
		return nil, err
	}

	// Create the products table
	_, err = tempDb.Exec("CREATE TABLE IF NOT EXISTS products (" +
		"id INT AUTO_INCREMENT PRIMARY KEY, " +
		"name VARCHAR(255), " +
		"description VARCHAR(255), " +
		"type ENUM('MOISTURIZER', 'CLEANSER', 'SERUM', 'SUNSCREEN'), " +
		"url VARCHAR(255), " +
		"image LONGBLOB);")
	if err != nil {
		return nil, err
	}

	// Create the ingredients table
	_, err = tempDb.Exec("CREATE TABLE IF NOT EXISTS ingredients (" +
		"id INT AUTO_INCREMENT PRIMARY KEY, " +
		"product_id INT," +
		"name VARCHAR(255)," +
		"FOREIGN KEY (product_id) REFERENCES products(id));")
	if err != nil {
		return nil, err
	}

	return tempDb, nil
}

// addProductToDb Inserts the given product to the database
func addProductToDb(product Product, cat string, image []byte) (int64, error) {
	result, err := db.Exec("INSERT INTO products (name, description, type, url, image) VALUES (?, ?, ?, ?, ?);", product.name, product.desc, cat, product.url, image)
	if err != nil {
		return -1, err
	}

	// Get the ID of the newly inserted product
	productID, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}

	return productID, nil
}

// addIngredientsToDb inserts ingredients for a given product
func addIngredientsToDb(productId int64, ingredients []string) error {
	batchInsert, err := db.Prepare("INSERT INTO ingredients (product_id, name) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer batchInsert.Close()

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// Iterate through ingredient names and execute the statement for each ingredient
	for _, ingredient := range ingredients {
		_, err := tx.Stmt(batchInsert).Exec(productId, ingredient)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

// downloadProducts Download the products for a given ProductPage
func downloadProducts(productPage ProductPage) {
	response, err := http.Get(productPage.url)
	defer response.Body.Close()

	if err != nil {
		log.Printf("Failed to download productPage page: %s due to error: %v\n", productPage.url, err)
		return
	}

	if response.StatusCode != http.StatusOK {
		log.Printf("Unexpected status code: %d\n", response.StatusCode)
		return
	}

	// Create the document reader
	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		log.Printf("Could not open HTML parser for productPage catalog: %s due to error: %v\n", productPage.url, err)
		return
	}

	// Look for all cards that describe a facial product
	doc.Find("template[slot='face']").Each(func(index int, template *goquery.Selection) {
		extractProductInfo(productPage, template)
	})
}

// extractProductInfo Take the individual products from the ProductPage and:
// 1. extract relevant information
// 2. add them to the database
func extractProductInfo(productPage ProductPage, template *goquery.Selection) {
	// Product page link
	href, _ := template.Find("a").Attr("href")
	productUrl := "https://cerave.com" + href

	// Product images
	vSrcset, _ := template.Find("img").Attr("v-srcset")
	srcsetMap := make(map[string]string)
	if err := json.Unmarshal([]byte(vSrcset), &srcsetMap); err != nil {
		log.Printf("Error parsing v-srcset JSON: %v for %s\n", err, productPage.url)
		return
	}

	// Download the productPage image
	imageBytes, err := downloadImageAsBytes("https://cerave.com" + srcsetMap["1025"])
	if err != nil {
		fmt.Printf("Could not download image as bytes: %v\n", err)
		imageBytes = make([]byte, 0)
	}

	// Download the ingredients
	ingredients, err := downloadIngredients(productUrl)

	product := Product{
		url:         productUrl,
		name:        template.Find("div.front__title.product-heading h3").Text(),
		desc:        template.Find("p.front__benefit").Text(),
		image:       imageBytes,
		ingredients: ingredients,
	}

	fmt.Println(product.name)
	//fmt.Println(productPage)
	productId, err := addProductToDb(product, productPage.cat, imageBytes)
	if err != nil {
		log.Printf("Could not insert product: %s due to: %v", product.name, err)
	}

	err = addIngredientsToDb(productId, ingredients)
	if err != nil {
		log.Printf("Could not insert ingredients for product: %s due to: %v", product.name, err)
	}
}

// downloadIngredients Extract the ingredients for a product
func downloadIngredients(productUrl string) ([]string, error) {
	response, err := http.Get(productUrl)
	defer response.Body.Close()

	if err != nil {
		return make([]string, 0), errors.New(fmt.Errorf("Could not download ingredients for product page: %s\n", productUrl).Error())
	}

	if response.StatusCode != http.StatusOK {
		return make([]string, 0), errors.New(fmt.Errorf("Unexpected status code %d\n", response.StatusCode).Error())
	}

	// Read the document into the html parser
	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		return make([]string, 0), errors.New(fmt.Errorf("Could not open HTML parser for product page: %s due to error: %v\n", productUrl, err).Error())
	}

	ingredients := make([]string, 0)

	// Find the div that contains the ingredients
	doc.Find("accordion[title='Ingredients']").Each(func(index int, ingredientsDiv *goquery.Selection) {
		tempIngredients := extractIngredients(ingredientsDiv.Text())
		for _, ingredient := range tempIngredients {
			if len(ingredient) == 0 {
				continue // How did you sneak through?
			}

			ingredients = append(ingredients, strings.ToUpper(ingredient))
		}
	})

	return ingredients, nil
}

// getTextAfterFirst Returns the string after the first occurrence of a token
// if present. Otherwise, it returns the entire string.
func getTextAfterFirst(input, token string) string {
	tokenIndex := strings.Index(input, token)

	if tokenIndex == -1 {
		return input
	}

	return strings.TrimSpace(input[tokenIndex+1:])
}

// extractIngredients Extract the ingredients contained within the ingredients div
func extractIngredients(divText string) []string {
	components := strings.Split(divText, "\n")
	n := len(components)

	ingredients := make([]string, 0)

	for i := 0; i < n-1; i++ {
		candidate := components[i]
		trimmed := getTextAfterFirst(candidate, ":")
		tempIngredients := strings.Split(trimmed, ",")
		for _, tempIngredient := range tempIngredients {
			ingredients = append(ingredients, strings.TrimSpace(tempIngredient))
		}
	}

	return ingredients
}

// downloadImageAsBytes Downloads an image as a series of bytes
func downloadImageAsBytes(imageUrl string) ([]byte, error) {
	response, err := http.Get(imageUrl)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	// Check if the response status code is OK (200)
	if response.StatusCode != http.StatusOK {
		return nil, err
	}

	imageBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return imageBytes, nil
}
