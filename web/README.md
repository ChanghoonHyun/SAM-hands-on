# Serverless Architecture

![serverless-architecture](/web/images/serverless-architecture.png)

## 장점

- SPOF(Single Point Of Failure) 제거
- 쉬운 확장
- 간단한 구조
- 저렴한 비용(운영비 절감 + 종량제 요금)

## 단점

- ColdStart
- Running time의 제약
  - API Gateway: 29초
  - Lambda : 300초
- Payload size의 제약
  - API Gateway : 10MB
  - Lambda : Invoke시 6MB
- Memory 제한
  - 128 ~ 3008MB
- 불편한 Logging
- 기타 제약사항
  - [API Gateway](https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/limits.html)
  - [Lambda](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/limits.html)
  - [DynamoDB](https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/Limits.html)

### [Workload 가 Serverless에 적합한지 확인하기](https://servers.lol)

## 다음 단계
- [AWS SAM으로 API server 만들기](./backend)