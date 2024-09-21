using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace app.Migrations
{
    /// <inheritdoc />
    public partial class nullabilitychange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredients_Ingredient_IngredientId",
                table: "RecipeIngredients");

            migrationBuilder.AlterColumn<Guid>(
                name: "IngredientId",
                table: "RecipeIngredients",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredients_Ingredient_IngredientId",
                table: "RecipeIngredients",
                column: "IngredientId",
                principalTable: "Ingredient",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredients_Ingredient_IngredientId",
                table: "RecipeIngredients");

            migrationBuilder.AlterColumn<Guid>(
                name: "IngredientId",
                table: "RecipeIngredients",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredients_Ingredient_IngredientId",
                table: "RecipeIngredients",
                column: "IngredientId",
                principalTable: "Ingredient",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
