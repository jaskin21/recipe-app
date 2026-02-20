import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
    table: dynamodb.Table;
}

export class ApiStack extends cdk.Stack {
    constructor( scope: Construct, id: string, props: ApiStackProps ) {
        super( scope, id, props );

        const { table } = props;

        // ─── Shared Lambda Environment ──────────────────────
        const lambdaEnv = {
            TABLE_NAME: table.tableName,
        };

        // ─── Lambda Functions ───────────────────────────────
        const createFn = new NodejsFunction( this, 'CreateRecipe', {
            entry: path.join( __dirname, '../../src/handlers/recipes/create.ts' ),
            handler: 'handler',
            environment: lambdaEnv,
        } );

        const listFn = new NodejsFunction( this, 'ListRecipes', {
            entry: path.join( __dirname, '../../src/handlers/recipes/list.ts' ),
            handler: 'handler',
            environment: lambdaEnv,
        } );

        const getFn = new NodejsFunction( this, 'GetRecipe', {
            entry: path.join( __dirname, '../../src/handlers/recipes/get.ts' ),
            handler: 'handler',
            environment: lambdaEnv,
        } );

        const updateFn = new NodejsFunction( this, 'UpdateRecipe', {
            entry: path.join( __dirname, '../../src/handlers/recipes/update.ts' ),
            handler: 'handler',
            environment: lambdaEnv,
        } );

        const deleteFn = new NodejsFunction( this, 'DeleteRecipe', {
            entry: path.join( __dirname, '../../src/handlers/recipes/delete.ts' ),
            handler: 'handler',
            environment: lambdaEnv,
        } );

        // ─── Grant DynamoDB Access ──────────────────────────
        table.grantReadWriteData( createFn );
        table.grantReadWriteData( listFn );
        table.grantReadWriteData( getFn );
        table.grantReadWriteData( updateFn );
        table.grantReadWriteData( deleteFn );

        // ─── API Gateway ────────────────────────────────────
        const api = new apigateway.RestApi( this, 'RecipeApi', {
            restApiName: 'recipe-api-dev',
            description: 'Recipe App API',
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        } );

        // /recipes
        const recipes = api.root.addResource( 'recipes' );
        recipes.addMethod( 'GET', new apigateway.LambdaIntegration( listFn ) );     // GET /recipes
        recipes.addMethod( 'POST', new apigateway.LambdaIntegration( createFn ) ); // POST /recipes

        // /recipes/{id}
        const recipe = recipes.addResource( '{id}' );
        recipe.addMethod( 'GET', new apigateway.LambdaIntegration( getFn ) );         // GET /recipes/:id
        recipe.addMethod( 'PUT', new apigateway.LambdaIntegration( updateFn ) );      // PUT /recipes/:id
        recipe.addMethod( 'DELETE', new apigateway.LambdaIntegration( deleteFn ) );   // DELETE /recipes/:id

        // ─── Output API URL ─────────────────────────────────
        new cdk.CfnOutput( this, 'ApiUrl', {
            value: api.url,
            description: 'Recipe API URL',
        } );
    }
}