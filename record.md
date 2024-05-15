# 2024.05.15

## React component 정리
- Index 
- App 
- Context_state_config : react의 usereducer 을 이용해 global state 와 dispach function 을 정의하며 <Context.Provider> 태그로 감싸주어 모든 컴포넌트에서 global state 를 사용가능하게 함 
- Routes : Context, hook 폴더 안의 모든 component, 기능을 모음.

### Problem : Client container 안에 authorization 을 위한 라이브러리 auth0-js 가 설치되지 않음.
- attempt1 : docker exec -it client /bin/bash 명령어 이용 container 접속, npm list 로 설치된 라이브러리 확인  &rarr; auth0-js 라이브러리 설치는 되어 있으나, dependency 에러 UNMET DEPENDENCY. 
- attempt 1-1 : 왜 dependency 에러가 발생할까?  &rarr; 이전에 생성해놓은 docker image 가 삭제되지 않은 상황에서 다시 docker compose up 을 실행하여 발생했을 가능성. 
- solved : docker image를 삭제하고 다시 compose 를 했을떄 문제 해결 
