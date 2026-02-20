import { recipeService } from '../../services/recipe-service';

export const handler = async ( event: any ) => {
    try {
        const { id } = event.pathParameters;
        const result = await recipeService.deleteRecipe( id );

        return {
            statusCode: 200,
            body: JSON.stringify( result ),
        };
    } catch ( error ) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: 'Failed to delete recipe', error } ),
        };
    }
};