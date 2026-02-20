import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    QueryCommand,
    UpdateCommand,
    DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = DynamoDBDocumentClient.from( new DynamoDBClient( {} ) );
const TABLE_NAME = process.env.TABLE_NAME!;

// Key helpers — Single-Table Design
const recipeKey = ( id: string ) => ( {
    PK: `RECIPE#${id}`,
    SK: 'METADATA',
} );

export const recipeService = {

    createRecipe: async ( data: any ) => {
        const id = randomUUID();
        const item = {
            ...recipeKey( id ),         // PK: RECIPE#<id>, SK: METADATA
            id,
            type: 'RECIPE',           // helps filter later
            title: data.title,
            description: data.description,
            ingredients: data.ingredients ?? [],
            instructions: data.instructions ?? '',
            category: data.category ?? 'uncategorized',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await client.send( new PutCommand( {
            TableName: TABLE_NAME,
            Item: item,
        } ) );

        return item;
    },

    listRecipes: async () => {
        // Query all items where SK = METADATA (all recipes)
        const result = await client.send( new QueryCommand( {
            TableName: TABLE_NAME,
            IndexName: 'SK-index',    // we'll add GSI for this
            KeyConditionExpression: 'SK = :sk',
            ExpressionAttributeValues: {
                ':sk': 'METADATA',
            },
        } ) );
        return result.Items ?? [];
    },

    getRecipe: async ( id: string ) => {
        const result = await client.send( new GetCommand( {
            TableName: TABLE_NAME,
            Key: recipeKey( id ),
        } ) );
        return result.Item ?? null;
    },

    updateRecipe: async ( id: string, data: any ) => {
        const result = await client.send( new UpdateCommand( {
            TableName: TABLE_NAME,
            Key: recipeKey( id ),
            UpdateExpression: 'set title = :title, description = :description, ingredients = :ingredients, instructions = :instructions, category = :category, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':title': data.title,
                ':description': data.description,
                ':ingredients': data.ingredients ?? [],
                ':instructions': data.instructions ?? '',
                ':category': data.category ?? 'uncategorized',
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        } ) );
        return result.Attributes;
    },

    deleteRecipe: async ( id: string ) => {
        await client.send( new DeleteCommand( {
            TableName: TABLE_NAME,
            Key: recipeKey( id ),
        } ) );
        return { message: 'Recipe deleted successfully' };
    },

};