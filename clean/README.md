# template 삭제

## 순서대로 제거하세요
  1. aws cloudformation delete-stack --stack-name serverless-hands-on-static-web
  2. aws cloudformation delete-stack --stack-name delete-stack --stack-name serverless-hands-on-static-web
  3. aws cloudformation delete-stack --stack-name serverless-hands-on-api-server
  4. aws cloudformation delete-stack --stack-name serverless-hands-on-pipeline
  5. aws cloudformation delete-stack --stack-name serverless-hands-on-artifacts-bucket

## S3 버킷 삭제
  - S3는 Bucket에 컨텐츠가 있으면 자동으로 삭제할 수 없습니다. 수동으로 삭제 해주세요.
  - [aws console로 이동](https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-1#)
  - delete

## SNS Subscription 삭제
  - SNS는 CloudFormation Stack이 제거될때 사라지지만 SNS의 Subscription은 남아있습니다. 수동으로 삭제 해주세요.
  - [aws console로 이동](https://ap-southeast-1.console.aws.amazon.com/sns/v2/home?region=ap-southeast-1#/subscriptions)
  - delete

## cloud9 삭제
  - [aws console로 이동](https://ap-southeast-1.console.aws.amazon.com/cloud9/home?region=ap-southeast-1#)
  - delete

## github access token 삭제
  - [github settings로 이동](https://github.com/settings/tokens)
  - ![github-delete-token](/clean/images/github-delete-token.png)
    1. Personal Access Tokens 클릭
    2. "for serverless hands on" token 삭제

