# Product Scraper

## Important Steps
1. Setup a Docker container for MySQL Community Edition
2. Fill in the database details in the main.go file
3. Run the scraper with `go run main.go`

## Post Scrape Steps
The scraper is imperfect, and will pickup disclaimers and various 
artifacts. Simply correct these entries with the following SQL commands:

```sql
DELETE FROM ingredients WHERE name LIKE 'PLEASE%';

DELETE FROM ingredients WHERE name LIKE 'THE MOST%';

UPDATE ingredients SET name = TRIM(TRAILING '.' FROM name);
```
