# CI/CD Pipeline

## CI(Continuous Integeration)/CD(Continuous Deployment)
  - 자동으로 소스코드를 통합해서 테스트하고 배포 합니다.
  - 반복개발을 위한 CI/CD Pieline
  - ![ci-cd-intro](/web/pipeline/images/CI-CD-intro.png)

## CodeBuild
  - 빌드 서버 관리가 필요없음
  - 분 단위 과금
  - 다양한 사용 환경 지정
  ### template
```yaml
  BuildProject:
    Type: AWS::CodeBuild::Project
    Properties:
      Name: !Sub "${AWS::StackName}-BuildProject"
      Description: !Sub ${AWS::StackName}-buildproject
      ServiceRole: !GetAtt BuildProjectRole.Arn
      Artifacts:
        Type: CODEPIPELINE
      Environment:
        Type: linuxContainer
        ComputeType: BUILD_GENERAL1_SMALL
        # aws/codebuild/nodejs:7.0.0
        Image: !Ref CodeBuildImage
        EnvironmentVariables:
          - Name: ArtifactBucketName
            Value: !Ref ArtifactBucketName
          - Name: Region
            Value: !Ref AWS::Region
      Source:
        Type: CODEPIPELINE
        BuildSpec: |
          version: 0.2
          phases:
            install:
              commands:
                - printenv
                - cd ./web/backend
                - npm install aws-xray-sdk
            build:
              commands:
                - aws cloudformation package --template template.yaml --s3-bucket ${ArtifactBucketName} --output-template packaged.yaml --region=${Region}
          artifacts: 
            files:
              - ./web/backend/packaged.yaml
      TimeoutInMinutes: 15
      Tags:
        - Key: Name
          Value: !Ref AWS::StackName    
```

## CodeDeploy
  - EC2, Lambda 등을 자동 배포
  - AWS CodePipeline, Github, Jenkins 등과 통합 가능
  - AWS 리소스를 배포하는 경우 무료

## CodePipeline
  - ![code-pipeline](/web/pipeline/images/code-pipeline-summary.png)

### pipeline stack 살펴보기
```yaml
  Pipeline:
    Type: AWS::CodePipeline::Pipeline
    DependsOn: PipelineRole
    Properties:
      RoleArn: !GetAtt PipelineRole.Arn
      Name: !Ref AWS::StackName
      Stages:
        - Name: source-code-checkout
          Actions:
            - Name: Source
              ActionTypeId:
                Category: Source
                Owner: ThirdParty
                Version: 1
                Provider: GitHub
              Configuration:
                Owner: !Ref GitHubOwner
                Repo: !Ref GitHubRepo
                Branch: !Ref GitHubBranch
                OAuthToken: !Ref GitHubToken
              OutputArtifacts:
                - Name: !Sub '${ServiceName}-Source'
              RunOrder: 1
        - Name: build-lambda-function
          Actions:
            - Name: build-lambda-function
              ActionTypeId:
                Category: Build
                Owner: AWS
                Version: 1
                Provider: CodeBuild
              Configuration:
                ProjectName: !Ref BuildProject
              RunOrder: 1
              InputArtifacts:
                - Name: !Sub '${ServiceName}-Source'
              OutputArtifacts:
                - Name: !Sub '${ServiceName}-BuildArtifact'
        - Name: Deploy
          Actions:
            - Name: create-changeset
              InputArtifacts:
                - Name: !Sub '${ServiceName}-BuildArtifact'
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Version: '1'
                Provider: CloudFormation
              OutputArtifacts: []
              Configuration:
                StackName: !Ref ServiceName
                ActionMode: CHANGE_SET_REPLACE
                RoleArn: !GetAtt CodeDeployRole.Arn
                ChangeSetName: pipeline-changeset
                Capabilities: CAPABILITY_NAMED_IAM
                TemplatePath: !Sub '${ServiceName}-BuildArtifact::web/backend/${PackagedFile}'
                ParameterOverrides: !Sub '{"Email" : "${Email}"}'
              RunOrder: 1
            - Name: execute-changeset
              InputArtifacts: []
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Version: '1'
                Provider: CloudFormation
              OutputArtifacts: []
              Configuration:
                StackName: !Ref ServiceName
                ActionMode: CHANGE_SET_EXECUTE
                ChangeSetName: pipeline-changeset
              RunOrder: 2
      ArtifactStore:
        Type: S3
        Location: !Ref ArtifactBucketName
```    
  - generate github token
    - curl -u {your_Github_id} -d '{"scopes":["public_repo", "repo:status", "repo_deployment"],"note":"for serverless hands on"}' https://api.github.com/authorizations
    - 성공하면 아래와 같이 생성된 토큰 정보를 반환합니다.
```javascript
    {
      ....
      "app": {
        "name": "for serverless hands on",
        "url": "https://developer.github.com/v3/oauth_authorizations/",
        "client_id": "00000000000000000000"
      },
      "token": {your_github_token},
      .......
    }
```
```
  export GITHUB_TOKEN={your_github_token}
```

  - pipeline stack 배포하기
    - ~/environment/SAM-hands-on/web/frontend $ cd ~/environment/SAM-hands-on/web/pipeline
    - ~/environment/SAM-hands-on/web/pipeline $ aws cloudformation deploy --template-file ./template.yaml --stack-name serverless-hands-on-pipeline  --capabilities CAPABILITY_NAMED_IAM --parameter-overrides GitHubRepoName=SAM-hands-on GitHubOwner={your_github_name} GitHubToken=$GITHUB_TOKEN  GitHubRepoBranch=master ArtifactBucketName=$ARTIFACTS_S3 Email=$SNS_EMAIL


  - 생성이 완료되면 아래와 같은 메시지가 나옵니다.
    ```
      Waiting for changeset to be created..
      Waiting for stack create/update to complete
      Successfully created/updated stack - serverless-hands-on-pipeline
    ```
  - [aws console로 이동](https://ap-southeast-1.console.aws.amazon.com/codepipeline/home?region=ap-southeast-1#/view/serverless-hands-on-pipeline)
  - ![code-pipeline-1](/web/pipeline/images/code-pipeline-1.png)
  - [aws console로 이동](https://ap-southeast-1.console.aws.amazon.com/codebuild/home?region=ap-southeast-1#/projects/serverless-hands-on-pipeline-BuildProject/view)
  - ![code-build-main](/web/pipeline/images/code-build-main.png)
    - build history 클릭
  - ![code-build-1](/web/pipeline/images/code-build-1.png)
  - ![code-build-2](/web/pipeline/images/code-build-2.png)


