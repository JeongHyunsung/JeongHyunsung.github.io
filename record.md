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

# 2024.05.17

## Goal
- website authentication 개념 학습 및 코드 분석( https://testdriven.io/blog/web-authentication-methods/ )

## Website authentication, authorization 개념
### Definition
- authentication : process of verifying the credentials of a user or device attempting to access a restricted system
- authorization : process of giving user authority based on authentication
### Http basic authentication
1. flow  
- unauthenticated client request restricted resource  
- HTTP 401 Unauthorized returned with header WWW-Authenticate
- WWW-Authenticate: Basic header causes browser to display username and password prompt 
- request authorization 
2. pros  
- simple
- fast  
3. cons   
- Security issue(Base64 encoding) &rarr; Digest Authentication(password is sent in MD5 hashed form)
- Authentication required every request
### Session based Authentication
1. idea
- user's state is stored in server  

2. flow 
- client request HTTP POST to "/login" with credentials
- server validate credentials
- if valid, server generate session and save in memory with sending session ID back to browser
- browser stores session ID as cookie, which gets sent anytime a request is made to the server

3. pros
- improved user experience
- many frameworks provide this feature

4. cons 
- cookies sent every request even if it does not required.
- Vulnerable to CSRF attacks
### Token-Based Authentication
1. idea 
- use Token instead of cookies in Session-based authentication

# 2024.05.19

## Goal 
- website authentication 코드 분석(https://github.com/iqbal125/react-hooks-blog-fullstack)
- auth0-js, history 라이브러리 사용방법 학습

## auth0-js 라이브러리
- auth0-js : client-side library for Auth0 
- https://auth0.com/docs/libraries/auth0js

### Initialization : initialize new instance of Auth0 application
```Ruby
var webAuth = new auth0.WebAuth({
    domain: #required
    clientID: #required
    redirectUrl: 
    scope: 
    audience:
    responseType: 
    responseMode:
    leeway:
    _disableDeprecationWarnings:
})
```

### Login : 
