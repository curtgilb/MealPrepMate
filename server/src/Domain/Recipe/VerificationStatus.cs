namespace Server.Domain.Recipe
{
    public record VerificationStatus
    {
        public Boolean NutritionLabelIsVerified { get; init; }
        public Boolean AllIngredientsHaveExpirationRules { get; init; }

    }
}