import { recipeService } from '../../services/recipe-service';

export const handler = async ( event: any ) => {
    try {
        const { id } = event.pathParameters;
        const body = JSON.parse( event.body );
        const recipe = await recipeService.updateRecipe( id, body );

        return {
            statusCode: 200,
            body: JSON.stringify( recipe ),
        };
    } catch ( error ) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: 'Failed to update recipe', error } ),
        };
    }
};