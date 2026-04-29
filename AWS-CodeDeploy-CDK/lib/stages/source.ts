import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import {
  GITHUB_CONNECTION_ARN,
  GITHUB_ENTERPRISE_OWNER,
  PIPELINE_TRIGGER_SERVICE_GITHUB_REPO,
  GITHUB_BRANCH,
} from "../common/constants";

/**
 * Properties for creating the source stage.
 */
export interface SourceStageProps {
  /** The pipeline to add the stage to. */
  pipeline: codepipeline.Pipeline;
  /** The output artifact for the source code. */
  output: codepipeline.Artifact;
}

/**
 * Add the source stage to the pipeline.
 */
export function createSourceStage(props: SourceStageProps): void {
  props.pipeline.addStage({
    stageName: "Source",
    actions: [
      new codepipeline_actions.CodeStarConnectionsSourceAction({
        actionName: "GitHub_Source",
        owner: GITHUB_ENTERPRISE_OWNER,
        repo: PIPELINE_TRIGGER_SERVICE_GITHUB_REPO,
        branch: GITHUB_BRANCH,
        connectionArn: GITHUB_CONNECTION_ARN,
        output: props.output,
      }),
    ],
  });
}
