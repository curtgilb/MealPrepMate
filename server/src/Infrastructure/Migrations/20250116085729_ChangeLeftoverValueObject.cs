using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeLeftoverValueObject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StorageLife_LeftoverFreezerLife",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "StorageLife_LeftoverFridgeLife",
                table: "Recipes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StorageLife_LeftoverFreezerLife",
                table: "Recipes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StorageLife_LeftoverFridgeLife",
                table: "Recipes",
                type: "integer",
                nullable: true);
        }
    }
}
