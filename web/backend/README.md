# AWS SAM으로 API 서버 만들기

## AWS SAM

- AWS에서 직접 운영하는 Serverless 플랫폼 입니다.
- 오픈소스 프로젝트 입니다.
- 기존 CloudFomration 리소스 중 serverless 관련 스택들을 간소화 시켰습니다.
  - AWS::Serverless::Function
  - AWS::Serverless::Api
  - AWS::Serverless::SimpleTable

## 패키징된 아티팩트를 저장할 S3 Bucket 만들기

패키지를 빌드 후 생성된 아티팩트를 올릴 S3를 먼저 생성하겠습니다.
- ~/environment $ cd ~/environment/SAM-hands-on/web/artifacts-bucket
- ~/environment/SAM-hands-on/web/artifacts-bucket $ aws cloudformation deploy --template-file ./template.yaml --stack-name serverless-hands-on-artifacts-bucket --capabilities CAPABILITY_IAM --region=ap-southeast-1
- [aws console](https://s3.console.aws.amazon.com/s3/buckets/?region=ap-southeast-1)로 가보면 serverless-hands-on-artifacts-{AccountId}-{Region} 형식으로 생성된 S3 Bucket을 확인 할 수 있습니다.

## 서버 배포하기

- ~/environment/SAM-hands-on/web/artifacts-bucket $ cd ~/environment/SAM-hands-on/web/backend
-  API Server를 수동으로 배포하겠습니다. 위에서 생성한 S3 이름과 장애 알람을 받을 email 주소를 입력해야 합니다.
  - ~/environment/SAM-hands-on/web/backend $ . deploy.sh {artifact-bucket-name} {your@email.com}
- [aws console](https://ap-southeast-1.console.aws.amazon.com/cloudformation/home?region=ap-southeast-1)에서 serverless-hands-on-api-server stack이 생성된것을 확인 할 수 있습니다.

## local 실행

- ~/environment/SAM-hands-on/web/backend $ sam local start-api --port 3000
- test
  - cloud9에서 새로운 terminal 오픈
![new terminal](/web/backend/images/c9-terminal.png)
  - ~/environment $ curl --request POST --header 'Content-Type: application/json' --data '{"name":"test"}' http://127.0.0.1:3000/users
  - ~/environment $ curl --request GET http://127.0.0.1:3000/users

### API Gateway

#### 콘솔에서 확인하기

- [aws console](https://ap-southeast-1.console.aws.amazon.com/apigateway/home?region=ap-southeast-1#/apis)로 이동해서 생성된 API Gateway를 확인할 수 있습니다.
  1. HandsOnAPIG 클릭
  2. Stages 클릭
  3. prod 클릭
  4. Invoke URL 확인 https://{your-apig-arn}.execute-api.{region}.amazonaws.com/prod
![confirm 클릭](/web/backend/images/apig.png)

#### AWS::Serverless::Api 살펴보기
```yaml
  UsersApi:
    Type: AWS::Serverless::Api
    Properties:
      # API Gateway 이름
      Name: !Ref APIGName
      # Stage 이름
      StageName: !Ref StageName
      DefinitionBody:
        swagger: "2.0"
        paths:
          "/users":
            get:
              responses:
                "200":
                  content:
                    text/plain:
                      scheme:
                        $ref: "#/definitions/Empty"
              x-amazon-apigateway-integration:
                httpMethod: POST
                type: aws_proxy
                # 호출할 lambda arn(Amazon Resource Namespace)을 매핑합니다.
                uri: !Sub "arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${MainFunction.Arn}:${LambdaAlias}/invocations"                        
            post:
              responses:
                "200":
                  content:
                    text/plain:
                      scheme:
                        type: string                
              x-amazon-apigateway-integration:
                httpMethod: POST
                type: aws_proxy
                uri: !Sub "arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${MainFunction.Arn}:${LambdaAlias}/invocations"                          
```  

#### AWS::Serverless::Function 살펴보기

```yaml
  UsersFunction:                        
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: index.handler
      Runtime: nodejs8.10
      MemorySize: 128
      Timeout: 10
      # X-Ray 사용
      Tracing: Active
      # 배포된 버전의 별칭
      AutoPublishAlias: !Ref LambdaAlias
      # 환경변수 설정
      Environment:
        Variables:
          tableName: !Ref UsersTableName
      # IAM Policies
      Policies:
        # AWS Managed Policy
        - AWSLambdaBasicExecutionRole
        - AWSXrayWriteOnlyAccess
        # Custom Policy
        - Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Action:
                - logs:CreateLogStream
                - logs:PutLogEvents
              Resource: !Sub arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/*
            - Effect: Allow
              Action:
                - dynamodb:PutItem
                - dynamodb:Scan
              Resource: !Sub arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${UsersTableName}
      # Event source list
      Events:
        UsersGet:
          Type: Api
          Properties:
            Path: /users
            Method: GET
            RestApiId: !Ref UsersApi
        UsersPost:
          Type: Api
          Properties:
            Path: /users
            Method: POST
            RestApiId: !Ref UsersApi            
      DeploymentPreference:
        # 배포 정책
        Type: !Ref DeploymentType
        # 알람
        Alarms:
          - LambdaAliasErrorMetricGreaterThanZeroAlarm
          - LambdaErrorMetricGreaterThanZeroAlarm                         
``` 

#### AWS::Serverless::SimpleTable 살펴보기
```yaml
  UsersTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      TableName: !Ref UsersTableName
      PrimaryKey:
        Name: id
        Type: String
      # 미리 정의된 사용량
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
```

### SNS

- 위에 입력한 주소로 aws sns의 subscription을 확인하는 이메일이 올 것입니다. confirm을 눌러서 subscribe 해주세요.
![confirm 클릭](/web/backend/images/sns-email-confirm-subscription.png)
- confirm을 누르면 아래와 같은 화면으로 리다이렉트 됩니다.
![redirect](/web/backend/images/sns-email-confirmed.png) 
- [aws console](https://ap-southeast-1.console.aws.amazon.com/sns/v2/home?region=ap-southeast-1#/subscriptions)로 이동해서 구독이 정상적으로 됐는지 확인합니다. Subscription ARN이 "PendingConfirmation"라고 돼있으면 아직 confirm이 안된 것입니다. 이메일을 확인해서 confirm을 눌러주세요. 
![subscription](/web/backend/images/sns-subcription.png)


## 다음 단계
- [AWS Static Web으로 SinglePageApp 만들기](../frontend)