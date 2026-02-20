import { recipeService } from '../../services/recipe-service';

export const handler = async ( event: any ) => {
    try {
        const body = JSON.parse( event.body );
        const recipe = await recipeService.createRecipe( body );
        return {
            statusCode: 201,
            body: JSON.stringify( recipe ),
        };
    } catch ( error ) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: 'Failed to create recipe', error } ),
        };
    }
};