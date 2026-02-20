#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DataStack } from '../lib/stacks/data-stack';
import { ApiStack } from '../lib/stacks/api-stack';
import { environments } from '../lib/config/environments';

const app = new cdk.App();

// 1. Data layer first
const dataStack = new DataStack( app, 'DataStack-dev', {
  env: environments.dev,
  stackName: 'recipe-data-dev',
} );

// 2. API layer — receives table from DataStack
new ApiStack( app, 'ApiStack-dev', {
  env: environments.dev,
  stackName: 'recipe-api-dev',
  table: dataStack.table,
} );
