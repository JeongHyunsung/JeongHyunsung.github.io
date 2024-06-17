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

# 2024.05.19,21

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

# 2024.05.27 

## Goal 
- auth0 학습 
- https://developer.auth0.com/resources/code-samples/api/express/basic-authorization
- https://manage.auth0.com/dashboard/us/dev-fe08mjqzeio0l00y/applications/SnWTdCeqXyGxwbaW5WRzJHRPZVS8xF9X/quickstart

## Auth0 - react tutorial
1. Auth0 dashboard 에서 app을 만들고 setting 을 완료한다. 
2. Domain, clientID 를 가져와 사용한다.
3. @auth0/auth0-react 라이브러리 설치


# 2024.06.05

### Problem : Express server HTTP 502 error 
- express 서버가 http request 에 응답하기 위해 db 서버에 접속하는 과정에서 password authentication 이 실패함 
- 이전에 이 문제는 db 서버의 container 접속 후, authentication method 를 결정하는 pg_hba.conf 파일을 수정하여 해결함.
- attempt 1 : 해당 방법으로 모든 사용자에 대하여 authentication method 를 trust 로 변경 &rarr; 'root' role 이 존재하지 않는다 함.
- attempt 1-1 : pool 에서 username 을 superuser인 postgres 로 변경함 
- solved : 정상적으로 응답

# 2024.06.09

## Goal 
- DB requirement 작성
- 카드 element 구현

## DB requirement
1. User (나중에 구현)
- 개인 프로필 정보 불러오기
- User ID, Password DB

2. Post 
- post 에는 blog post 와 project post 두가지 종류가 있음.
- 각각의 post 는 image, title, content 를 포함

3. Tag 
- 각각의 post 는 1개 이상의 Tag 를 가지고 있음.

4. functional requirement
4.1. 모든 post 를 시간 순서대로 가져오기
4.2. 모든 Blog post 를 가져오기
4.3. 모든 Project post 를 가져오기
4.4. Tag 를 선택하면 해당하는 post 검색하기 

## DB psql command
1. db 접속 
\c [DB Name] [Connection User}
2. 조회
\list(or \l) : 전체 Database Instance 목록
\dt : 접속한 DB Instance의 Table 목록
\ds : Sequence 목록
\df : Function 목록
\dv : View 목록
\du : User 목록
3. 테이블 조회
\d  [table name]

# 2024.06.11

## Goal
- connection pool 이용해 db 서버에서 1개의 post 에 관한 데이터 가져와서 client web의 카드 element 에 표현하기.
- db 서버에서 sql query 에 대해 정상적인 응답을 하지 않았는데, 이 문제를 해결해야 함.
- Home 기능과 각 카드를 눌렀을때 포스트를 보여주는 기능 구현.

### Problem : invalid response from posegres server.
- Solution 1: connection pool 을 생성할때 데이터베이스의 이름을 사용중인 main_db 대신 기본값인 postgres로 설정되어 있었음.
- 정신 차려 !!!! 

## 기능 구현
1. 각 post 를 보여주는 Route를 설정하여, 해당 Route에서 보여지는 element 안에서 해당 포스트의 모든 정보를 db로부터 받아와 보여줄 수 있어야 함.

2. 여러 포스트를 카드 형태로 보여주는 Home element 에서는 필요한 정보만 받아와 card 속에 렌더링 해주어야 함.

# 2024.06.12, 6.17

## Goal 
- 기능 구현 계속하기

dangerouslySetInnerHTML은 XSS(Cross-Site Scripting) 공격의 위험을 내포하므로, 가능한 경우 사용을 피하는 것이 좋습니다. 대안으로서 다음과 같은 방법들을 고려할 수 있습니다:

마크다운 렌더링 라이브러리 사용: Markdown을 HTML로 변환하는 라이브러리를 사용하여 클라이언트 측에서 Markdown을 HTML로 변환하고 표시할 수 있습니다. 예를 들어, React에서는 react-markdown 라이브러리를 사용할 수 있습니다.

jsx
코드 복사
import React from 'react';
import ReactMarkdown from 'react-markdown';

function BlogPost({ title, author, content }) {
  return (
    <div className="blog-post">
      <h2>{title}</h2>
      <p>Written by {author}</p>
      <div className="blog-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default BlogPost;
이 방법은 Markdown을 안전하게 HTML로 변환하여 렌더링합니다. react-markdown 등의 라이브러리는 기본적으로 XSS 공격을 막기 위한 방어 메커니즘을 내장하고 있습니다.

HTML 필터링 및 이스케이프 처리: 서버 측에서 블로그 게시물을 HTML로 변환하기 전에 HTML 필터링 및 이스케이프 처리를 수행하여 안전한 HTML을 생성합니다. 이를 통해 사용자 입력을 신뢰할 수 있는 HTML로 변환할 수 있습니다.

javascript
코드 복사
const sanitizeHtml = require('sanitize-html');

// 예시: Markdown을 HTML로 변환하고 필터링 및 이스케이프 처리
function convertMarkdownToSafeHtml(markdownContent) {
  // Markdown을 HTML로 변환하는 로직 추가
  const htmlContent = convertMarkdownToHtml(markdownContent);

  // 안전한 HTML 필터링 및 이스케이프 처리
  const safeHtml = sanitizeHtml(htmlContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags, // 허용할 HTML 태그 설정
    allowedAttributes: sanitizeHtml.defaults.allowedAttributes // 허용할 HTML 속성 설정
  });

  return safeHtml;
}
위 예시에서 sanitize-html 라이브러리는 특정 HTML 태그와 속성만 허용하도록 설정하여 안전한 HTML을 생성합니다.

템플릿 엔진 사용: 서버 측에서 템플릿 엔진을 사용하여 데이터를 HTML로 렌더링할 수 있습니다. 많은 템플릿 엔진은 XSS 공격 방어를 위한 기본적인 보안 메커니즘을 제공합니다.

예를 들어, Express에서 Handlebars를 사용하는 경우:

javascript
코드 복사
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('.hbs', exphbs({ /* 설정 */ }));
app.set('view engine', '.hbs');

app.get('/blog/:postId', (req, res) => {
  const postId = req.params.postId;
  // DB에서 postId에 해당하는 블로그 포스트를 가져오는 로직
  const blogPost = getBlogPostById(postId);

  // 블로그 포스트를 Handlebars 템플릿에 전달하여 HTML로 렌더링
  res.render('blog-post', { blogPost });
});
Handlebars 템플릿에서는 기본적으로 HTML 이스케이프를 수행하므로, 안전하게 데이터를 HTML로 렌더링할 수 있습니다.

이러한 방법들을 통해 dangerouslySetInnerHTML을 회피하고, 안전하게 사용자 입력을 HTML로 렌더링할 수 있습니다. 선택한 방법은 사용하는 프레임워크나 라이브러리, 보안 요구 사항 등에 따라 달라질 수 있습니다.

- 본문 저장은 marked 와 같은 markdown 라이브러리를 이용할 것.
import marked from 'marked';

const markdownText = '# Hello, Markdown!';
const htmlText = marked(markdownText);







