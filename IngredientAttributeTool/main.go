package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/ayush6624/go-chatgpt"
	"log"
	"os"
)

type Ingredient struct {
	Name                string `json:"name"`
	Usage               string `json:"usage"`
	PossibleEyeIrritant bool   `json:"possibleEyeIrritant"`
	PossibleDriesSkin   bool   `json:"possibleDriesSkin"`
	ReducesRedness      bool   `json:"reducesRedness"`
	ImprovesMoisture    bool   `json:"improvesMoisture"`
}

var chatGPT *chatgpt.Client

// Main entry point
func main() {
	tempClient, err := setupChatGPT()
	if err != nil {
		log.Fatal(err)
	}

	chatGPT = tempClient

	sample := make([]string, 0)
	sample = append(sample, "Glycerin")
	process(sample, 2)
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
			trackIngredients(updatedIngredients)
		}
	}
}

func sourceInfo(ingredients []Ingredient) ([]Ingredient, error) {
	jsonStr, err := json.Marshal(ingredients)
	if err != nil {
		return nil, err
	}

	ctx := context.Background()

	prompt := "For each ingredient in the json array below, update all properties. " +
		"\nFor example, the usage is what the ingredient is used for, if it causes eye irritation, if it helps reduce redness and dryness. " +
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

func trackIngredients(ingredients []Ingredient) {
	fmt.Println(ingredients)
}
