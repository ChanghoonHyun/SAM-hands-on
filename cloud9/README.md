# 개발환경 셋팅하기

## cloud9

동일한 개발환경을 위해서 cloud9을 사용하겠습니다.

1. 싱가포르 리전 선택
2. 서비스 클릭
3. Cloud9 클릭
![cloud9-1](/cloud9/images/cloud9-1.png)
4. Create Environment 클릭
![cloud9-2](/cloud9/images/cloud9-2.png)
5. Name 입력
6. Next step 클릭
![cloud9-3](/cloud9/images/cloud9-3.png)
7. Next step 클릭
![cloud9-4](/cloud9/images/cloud9-4.png)
8. Create environment 클릭
![cloud9-5](/cloud9/images/cloud9-5.png)
9. 생성이 완료되면 View -> Editors -> Ace 로 template editor를 변경합니다.
![cloud9-6](/cloud9/images/cloud9-6.png)

### 이제부터 모든 작업은 Cloud9에서 진행하겠습니다.

## github

CI/CD를 위해 개인 계정으로 Fork 후 작업 하겠습니다.

- https://github.com/ChanghoonHyun/SAM-hands-on 로 이동
- fork 클릭
![fork 클릭](/cloud9/images/github-fork.png)
- ~/environment $ git clone https://github.com/{your-git-username}/SAM-hands-on.git ~/environment/SAM-hands-on
- ~/environment $ git config --global user.name "Your Name"
- ~/environment $ git config --global user.email you@example.com
- ~/environment $ git config --global credential.helper cache --timeout=86400

## 다음 단계
- [IaC](../IaC)