import * as cdk from 'aws-cdk-lib';
import { DeployPipelineStack } from '../lib/deploy-pipeline-stack';
import { ACCOUNT_IDS, DEV, US_EAST_1 } from '../lib/common/constants';

const app = new cdk.App();
app.node.setContext('app_id', '{App-Name}-Deploy-Pipeline');

new DeployPipelineStack(app, '<APP NAME>DeployPipelineStack', {
  env: {
    account: ACCOUNT_IDS[DEV],
    region: US_EAST_1
  }
});

app.synth();
