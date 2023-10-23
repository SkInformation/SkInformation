package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/ayush6624/go-chatgpt"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"os"
)

type Ingredient struct {
	Name             string
	Usage            string
	EyeIrritant      bool
	DriesSkin        bool
	ReducesRedness   bool
	Hydrating        bool
	NonComedogenic   bool
	SafeForPregnancy bool
}

var chatGPT *chatgpt.Client

// The database connection
var db *sql.DB

// Constants for database seed
const (
	SQL_HOST = "127.0.0.1"
	SQL_DB   = "skincare"
	SQL_USER = "admin"
	SQL_PASS = "changeme"
)

// Main entry point
func main() {
	tempDb, err := setupDBConnection()
	if err != nil {
		log.Fatalf("Failed to setup database: %v\n", err)
	}

	db = tempDb
	defer db.Close()

	tempClient, err := setupChatGPT()
	if err != nil {
		log.Fatal(err)
	}

	chatGPT = tempClient

	ingredients, err := getIngredients()

	if err != nil {
		log.Fatal(err)
	}

	process(ingredients, 10)
}

// setupChatGPT - set up the chatGPT client
func setupChatGPT() (*chatgpt.Client, error) {
	key := os.Getenv("OPENAI_KEY")
	client, err := chatgpt.NewClient(key)
	return client, err
}

// process - Process ingredients
func process(ingredients []string, batchSize int) {
	n := len(ingredients)
	i := 0

	// While there are elements
	for i < n {
		// Grab up to `batchSize` ingredients
		var batch = make([]Ingredient, 0)
		var j = 0

		for j < batchSize && i < n {
			batch = append(batch, Ingredient{Name: ingredients[i]})
			i += 1
			j += 1
		}

		updatedIngredients, err := sourceInfo(batch)
		if err != nil {
			fmt.Print(err)
		} else {
			trackIngredientAttributes(updatedIngredients)
		}
	}
}

func sourceInfo(ingredients []Ingredient) ([]Ingredient, error) {
	jsonStr, err := json.Marshal(ingredients)
	if err != nil {
		return nil, err
	}

	ctx := context.Background()

	prompt := "For each json object in the json array below, update all properties based on the ingredient name field:" +
		"\nUsage: a short description of what the ingredient does" +
		"\nEyeIrritant: if the ingredient causes eye irritation" +
		"\nDriesSkin: if the ingredient dries out the skin" +
		"\nReducesRedness: if the ingredient reduces redness" +
		"\nHydrating: if the ingredient has a hydrating effect on the skin" +
		"\nNonComedogenic: if the ingredient is noncomedogenic" +
		"\nSafeForPregnancy: if the ingredient can safely be used while pregnant or nursing" +
		"\nReturn the response as a parsable JSON only. Do not include explanations or other formatting." +
		"\nInput: " + string(jsonStr)

	res, err := chatGPT.SimpleSend(ctx, prompt)
	if err != nil {
		return nil, err
	}

	// Raw JSON
	message := res.Choices[0].Message
	fmt.Println(message.Content)
	err = json.Unmarshal([]byte(message.Content), &ingredients)
	if err != nil {
		return nil, err
	}

	return ingredients, nil
}

// setupDBConnection - Create the database connection and necessary tables
func setupDBConnection() (*sql.DB, error) {
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
	_, err = tempDb.Exec("CREATE TABLE IF NOT EXISTS `IngredientAttributes` (`Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL, `Usage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL, `EyeIrritant` tinyint(1) NOT NULL, `DriesSkin` tinyint(1) NOT NULL, `ReducesRedness` tinyint(1) NOT NULL,  `Hydrating` tinyint(1) NOT NULL,  `NonComedogenic` tinyint(1) NOT NULL, `SafeForPregnancy` tinyint(1) NOT NULL, PRIMARY KEY (`Name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;")
	if err != nil {
		return nil, err
	}

	return tempDb, nil
}

// trackIngredientAttributes - track
func trackIngredientAttributes(ingredients []Ingredient) {
	for _, ingredient := range ingredients {
		query := "INSERT INTO IngredientAttributes (Name, Usage, EyeIrritant, DriesSkin, ReducesRedness, Hydrating, NonComedogenic, SafeForPregnancy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
		_, err := db.Exec(query, ingredient.Name, ingredient.Usage, ingredient.EyeIrritant, ingredient.DriesSkin, ingredient.ReducesRedness, ingredient.Hydrating, ingredient.NonComedogenic, ingredient.SafeForPregnancy)
		if err != nil {
			fmt.Println("Error inserting data:", err)
		}
	}
}

// getIngredients - Get the ingredients from the database
func getIngredients() ([]string, error) {
	// Query to retrieve unique values from the 'name' field
	query := "SELECT DISTINCT name FROM ingredients"

	// Execute the query
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var ingredients = make([]string, 0)

	// Iterate through the result set and print the unique names
	for rows.Next() {
		var name string
		err := rows.Scan(&name)
		if err != nil {
			return nil, err
		}

		ingredients = append(ingredients, name)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ingredients, nil
}
