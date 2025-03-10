using HotChocolate.Types;
using Server.Domain;

namespace Server.GraphQL.Recipe
{
    public class RecipeType : ObjectType<Domain.Recipe.Recipe>
    {
        protected override void Configure(IObjectTypeDescriptor<Domain.Recipe.Recipe> descriptor)
        {

        }
    }
}
