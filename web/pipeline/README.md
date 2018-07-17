# CI/CD Pipeline

## CI(Continuous Integeration)/CD(Continuous Deployment)
  - 자동으로 소스코드를 통합해서 테스트하고 배포 합니다.
  - 반복개발을 위한 CI/CD Pieline
  - ![ci-cd-intro](/web/pipeline/images/CI-CD-intro.png)

## CodeBuild
  - 빌드 서버 관리가 필요없음
  - 분 단위 과금
  - 다양한 사용 환경 지정

## CodeDeploy
  - EC2, Lambda 등을 자동 배포
  - AWS CodePipeline, Github, Jenkins 등과 통합 가능
  - AWS 리소스를 배포하는 경우 무료

## CodePipeline
  - ![code-pipeline](/web/pipeline/images/code-pipeline.png)
  - generate github token
    - curl -u {your_Github_id} -d '{"scopes":["public_repo", "repo:status", "repo_deployment"],"note":"for serverless hands on"}' https://api.github.com/authorizations
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
  - aws cloudformation deploy --template-file ./template.yaml --stack-name serverless-hands-on-pipeline  --capabilities CAPABILITY_NAMED_IAM --parameter-overrides GitHubRepoName=SAM-hands-on GitHubUser={your_github_name} GitHubToken={your_github_token}  GitHubRepoBranch=master ArtifactBucketName={your_artifacts_s3}
