import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { recipeService } from './recipe-service';

// Mock DynamoDB client
const ddbMock = mockClient( DynamoDBDocumentClient );

// Mock table name env variable
process.env.TABLE_NAME = 'recipe-app-dev';

describe( 'recipeService', () => {

    // reset mock before each test
    beforeEach( () => {
        ddbMock.reset();
    } );

    // ─── CREATE ─────────────────────────────────────────
    describe( 'createRecipe', () => {
        it( 'should create a recipe and return it', async () => {
            ddbMock.on( PutCommand ).resolves( {} );

            const data = {
                title: 'Chicken Adobo',
                description: 'Filipino classic',
                ingredients: ['chicken', 'soy sauce'],
                instructions: 'Cook it',
                category: 'Filipino',
            };

            const result = await recipeService.createRecipe( data );

            expect( result.id ).toBeDefined();
            expect( result.title ).toBe( 'Chicken Adobo' );
            expect( result.PK ).toContain( 'RECIPE#' );
            expect( result.SK ).toBe( 'METADATA' );
            expect( result.createdAt ).toBeDefined();
        } );
    } );

    // ─── LIST ────────────────────────────────────────────
    describe( 'listRecipes', () => {
        it( 'should return list of recipes', async () => {
            ddbMock.on( QueryCommand ).resolves( {
                Items: [
                    { id: '123', title: 'Adobo', PK: 'RECIPE#123', SK: 'METADATA' },
                    { id: '456', title: 'Sinigang', PK: 'RECIPE#456', SK: 'METADATA' },
                ],
            } );

            const result = await recipeService.listRecipes();

            expect( result ).toHaveLength( 2 );
            expect( result[0].title ).toBe( 'Adobo' );
        } );

        it( 'should return empty array if no recipes', async () => {
            ddbMock.on( QueryCommand ).resolves( { Items: [] } );

            const result = await recipeService.listRecipes();

            expect( result ).toHaveLength( 0 );
        } );
    } );

    // ─── GET ─────────────────────────────────────────────
    describe( 'getRecipe', () => {
        it( 'should return a recipe by id', async () => {
            ddbMock.on( GetCommand ).resolves( {
                Item: { id: '123', title: 'Adobo', PK: 'RECIPE#123', SK: 'METADATA' },
            } );

            const result = await recipeService.getRecipe( '123' );

            expect( result ).not.toBeNull();
            expect( result?.title ).toBe( 'Adobo' );
        } );

        it( 'should return null if recipe not found', async () => {
            ddbMock.on( GetCommand ).resolves( { Item: undefined } );

            const result = await recipeService.getRecipe( 'nonexistent' );

            expect( result ).toBeNull();
        } );
    } );

    // ─── UPDATE ──────────────────────────────────────────
    describe( 'updateRecipe', () => {
        it( 'should update and return updated recipe', async () => {
            ddbMock.on( UpdateCommand ).resolves( {
                Attributes: {
                    id: '123',
                    title: 'Updated Adobo',
                    PK: 'RECIPE#123',
                    SK: 'METADATA',
                },
            } );

            const result = await recipeService.updateRecipe( '123', {
                title: 'Updated Adobo',
                description: 'Updated description',
                ingredients: ['chicken'],
                instructions: 'Cook',
                category: 'Filipino',
            } );

            expect( result?.title ).toBe( 'Updated Adobo' );
        } );
    } );

    // ─── DELETE ──────────────────────────────────────────
    describe( 'deleteRecipe', () => {
        it( 'should delete a recipe and return success message', async () => {
            ddbMock.on( DeleteCommand ).resolves( {} );

            const result = await recipeService.deleteRecipe( '123' );

            expect( result.message ).toBe( 'Recipe deleted successfully' );
        } );
    } );

} );