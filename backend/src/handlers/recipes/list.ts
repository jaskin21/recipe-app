import { recipeService } from '../../services/recipe-service';

export const handler = async () => {
    try {
        const recipes = await recipeService.listRecipes();
        return {
            statusCode: 200,
            body: JSON.stringify( recipes ),
        };
    } catch ( error ) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: 'Failed to fetch recipes', error } ),
        };
    }
};