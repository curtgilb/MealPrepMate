namespace Server.Domain.Recipes {
    public record VerificationStatus {
        public Boolean NutritionLabelIsVerified { get; init; }
        public Boolean AllIngredientsHaveExpirationRules { get; init; }
        
    }
}