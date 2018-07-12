# 정적 웹사이트 호스팅과 클라이언트 사이드 렌더링 웹을 이용해서 서버 없이 웹 페이지 제공하기.

## SPA(Single Page Application)

SPA는 처음 접속할때만 서버에 html과 js를 요청하고 이후 부터는 브라우저에서 페이지를 핸들링합니다.
정적 웹사이트 호스팅을 이용해서 html과 js을 S3에서 제공해서 프론트 엔드를 위한 서버를 완전히 제거할 수 있습니다.

## Public S3 Bucket 만들기

- ~/environment/SAM-hands-on/web/backend $ cd ~/environment/SAM-hands-on/web/frontend
- ~/environment/SAM-hands-on/web/frontend $ aws cloudformation deploy --template-file ./template.yaml --stack-name serverless-hands-on-static-web --capabilities CAPABILITY_IAM  --region=ap-southeast-1
- [aws console](https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-1)에서 생성된 bucket을 확인 할 수 있습니다.

### template

```yaml
  WebBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub serverless-hands-on-static-web-${AWS::AccountId}-${AWS::Region}
      WebsiteConfiguration:
        # 웹사이트로 접근시 index.html에 접근합니다.
        IndexDocument: index.html
  WebBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref WebBucket
      PolicyDocument:
        Statement:
          - Effect: Allow
            # 보안 주체 (ex 사용자, 계정, 서비스 등)
            Principal: "*"
            # 작업 권한
            Action: s3:GetObject
            # 리소스
            Resource: !Sub "arn:aws:s3:::${WebBucket}/*"
```

## Bucket에 SPA App 배포하기

- ~/environment/SAM-hands-on/web/frontend $ aws s3 sync ./pkg s3://{static-web-s3-name}

## 웹 페이지 테스트 해보기

- [aws console](https://ap-southeast-1.console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks?filter=active&tab=outputs)으로 이동
  1. serverless-hands-on-static-web 클릭
  2. Outputs 클릭 
  3. WebUrl의 Value를 복사
  4. 브라우저에 입력
![s3-web-url](/web/frontend/images/s3-web-url.png)

- 사용자 추가
  1. {api-gateway-url/test} 입력
  2. name, address 추가, 등록 클릭
  3. 성공 alert 확인
![add-user](/web/frontend/images/add-user.png)

- 사용자 조회
  1. {api-gateway-url/test} 입력
  2. 사용자 조회 클릭
![find-users](/web/frontend/images/find-users.png)  

## 다음 단계

- [모니터링](../monitoring)