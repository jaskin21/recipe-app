import { recipeService } from '../../services/recipe-service';

export const handler = async ( event: any ) => {
    try {
        console.log( 'EVENT:', JSON.stringify( event ) ); 
        const { id } = event.pathParameters;
        const recipe = await recipeService.getRecipe( id );

        if ( !recipe ) {
            return {
                statusCode: 404,
                body: JSON.stringify( { message: 'Recipe not found' } ),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify( recipe ),
        };
    } catch ( error ) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: 'Failed to fetch recipe', error } ),
        };
    }
};