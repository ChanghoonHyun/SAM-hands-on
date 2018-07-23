# Infrastructure as Code와 CloudFormation

## Infrastructure as Code

- 사람 보다 코드가 정확하다.
- 리소스를 프로비저닝한다.
- 문서화가 가능하다.
- 버전 관리가 가능하다.
- 지속적인 개선과 배포가 가능하다.
- 3R 보장
  - Repeatable : 인프라를 부수고 복구 가능하다.
  - Reproducible : 인프라를 다른 조건에서(계정, 리전 등) 다시 생성 할 수 있다.
  - Reliable : 같은 결과물을 보장한다.
- 도구 : AWS CloudFormation, AWS CLI, Terraform 등

## CloudFormation

- JSON/YAML로 AWS Resource를 프로비저닝
- 무료
- [https://github.com/awslabs](https://github.com/awslabs) 등의 레퍼런스가 CloudFormation 사용

### Example
```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: cloud9 stack
# stack에서 사용할 파라미터 정의.
Parameters:
# CLI 명령어에서 파라미터를 반드시 넣어야 함. ex) --parameter-overrides AppName=serverless-hands-on
  InstanctType: 
    Type: String
    Description: ec2 instance type
    Default: t2.micro
# CLI 명령어에서 파라미터를 넣지 않으면 Default 값이 적용
Resources:
# 스택 내부에서 사용할 리소스 이름
  Cloud9:
# 리소스 타입  
    Type: AWS::Cloud9::EnvironmentEC2
    Properties:
# Cloud9 리소스의 이름    
      Name: !Ref AWS::StackName
# N분 동안 사용하지 않으면 EC2 instance를 Stop
      AutomaticStopTimeMinutes: 60
# Cloud9에서 사용할 EC2 instance type
      InstanceType: !Ref InstanctType
```

## AWS CLI

  - 콘솔에서 간편하게 처리 가능
  - 무료

### Example
```
aws cloud9 create-environment-ec2 \
  --name my-demo-env \
  --instance-type t2.micro \
  --automatic-stop-time-minutes 60
```

## Terraform

  - 개발자에게 익숙한 문법 제공
  - 다양한 클라우드 서비스 지원
  - Enterprise 지원

### Example
```
resource "aws_cloud9_environment_ec2" "example" {
  instance_type = "t2.micro"
  name = "example-env"
  automatic_stop_time_minutes = 60
}
```

## 다음 단계
- [Serverless Architecture로 웹 서비스 만들기](../web)