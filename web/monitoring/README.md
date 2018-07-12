# 웹 서비스 모니터링 하기

## X-Ray

어플리케이션의 성능, 동작 등을 추적 할 수 있는 프로파일 도구입니다.
시각화, 상세 도표 등을 제공하고 검색이 가능합니다.
![x-ray-summary1](/web/monitoring/images/x-ray-summary1.png)
![x-ray-summary2](/web/monitoring/images/x-ray-summary2.png)
[출처 : 윤석찬님의 AWS X-Ray를 통한 서버리스 분산 애플리케이션 추적하기](https://www.youtube.com/watch?v=BEg__eV1mT8)

Lambda에서는 X-Ray Daemon이 기본적으로 내장 돼있으며 Trace 옵션을 이용해서 X-Ray Daemon을 활성화 시킬 수 있습니다.

[web/backend/template.yaml](../backend/template.yaml)
```yaml
  UsersFunction:                        
    Type: AWS::Serverless::Function
    Properties:
      # X-Ray 사용
      Tracing: Active
``` 



- [?](../)