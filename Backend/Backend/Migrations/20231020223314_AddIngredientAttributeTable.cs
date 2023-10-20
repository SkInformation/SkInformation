using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddIngredientAttributeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IngredientAttributes",
                columns: table => new
                {
                    Name = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Usage = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EyeIrritant = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DriesSkin = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ReducesRedness = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Hydrating = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    NonComedogenic = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SafeForPregnancy = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientAttributes", x => x.Name);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IngredientAttributes");
        }
    }
}
