import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import { ACCOUNT_IDS, DEV, PROD } from './common/constants';
import { createSourceStage } from './stages/source_stage';
import { createSelfMutateStage } from './stages/self_mutating_stage';
import { createBuildStage } from './stages/build_stage';
import { createDeployStage } from './stages/deploy_stage';
import { createIntegrationTestStage } from './stages/integration_test_stage';
import { EcrRepository } from './common/repository/ecr-repository';

export class DeployPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const sourceOutput = new codepipeline.Artifact();
    const synthOutput = new codepipeline.Artifact();
    const pipelineStackName = `service-deploy-pipeline`;

    const pipeline = new codepipeline.Pipeline(this, pipelineStackName, {
      pipelineName: pipelineStackName,
      restartExecutionOnUpdate: true,
      crossAccountKeys: true,
    });

    // Create ECR Repository for the Docker images
    const ecrRepoConstruct = new EcrRepository(this, "EcrRepository");
    const ecrRepository = ecrRepoConstruct.repository;

    // 1. Source Stage
    createSourceStage({
      pipeline,
      output: sourceOutput,
    });

    // 2. Self-Mutate Stage
    createSelfMutateStage(this, {
      pipeline,
      pipelineSourceOutput: sourceOutput,
      envName: DEV,
    });

    // 3. Build Stage (CDK Synth)
    createBuildStage(this, {
      pipeline,
      input: sourceOutput,
      output: synthOutput,
      repository: ecrRepository,
    });

    // 4. Deployment Stages
    createDeployStage(this, {
      pipeline,
      input: synthOutput,
      envName: DEV,
    });

    createIntegrationTestStage(this, {
      pipeline,
      envName: DEV,
      accountId: ACCOUNT_IDS[DEV],
    });

    createDeployStage(this, {
      pipeline,
      input: synthOutput,
      envName: PROD,
    });
  }
}
