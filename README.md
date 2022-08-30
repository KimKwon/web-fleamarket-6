<div align="center">
  <img width="150" alt="Logo" src="https://user-images.githubusercontent.com/22493971/187073491-e734a0ac-4a68-44e4-84a5-9ddd6ea7bc61.png">
</div>



<div align="center">
  <br />
  <br />
  <p>우아한 중고거래, <b><i>FFFlea Market</i></b></p>
  <p>
    <b>우아한테크캠프 마지막 프로젝트</b> 
    <div>
        <span>authored by</span>
        <a href="https://github.com/KimKwon">jjinny</a> 
        <span> and </span>
        <a href="https://github.com/ja960508">Lee Jooam</a>
    </div>  
  </p>

  <span>⭐️ </span>
  <a href="http://3.38.100.23/">데모 보러가기 (준비중)</a>
  <br />
  <span>:pen: </span>
  <a href="https://github.com/woowa-techcamp-2022/web-fleamarket-6/wiki">위키 보러가기 (준비중)</a>
</div>

<br>

## 뭐로 만드신거죠?

### Client
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Styled-Components](https://img.shields.io/badge/styled--components-%23DB7093.svg?style=for-the-badge&logo=styled-components&logoColor=white)


### Server
![mySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![PM2](https://img.shields.io/static/v1?style=for-the-badge&message=PM2&color=2B037A&logo=PM2&logoColor=FFFFFF&label=)
![node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-%2320232a.svg?style=for-the-badge&logo=NestJS&logoColor=%23E0234E)


### DevOps
![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)
![Amazon S3](https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+S3&color=569A31&logo=Amazon+S3&logoColor=FFFFFF&label=)
![Amazon RDS](https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+RDS&color=527FFF&logo=Amazon+RDS&logoColor=FFFFFF&label=)
![Amazon EC2](https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+EC2&color=222222&logo=Amazon+EC2&logoColor=FF9900&label=)


### Communication
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)
![Slack](https://img.shields.io/static/v1?style=for-the-badge&message=Slack&color=4A154B&logo=Slack&logoColor=FFFFFF&label=)
![Figma](https://img.shields.io/static/v1?style=for-the-badge&message=Figma&color=F24E1E&logo=Figma&logoColor=FFFFFF&label=)


---

## 어떻게 시작하나요?

위키의 [사전세팅](https://github.com/woowa-techcamp-2022/web-fleamarket-6/wiki/Prerequisite)을 참고해주세요!


---


## 구현한 기능들


<div style="display: flex;justify-content: space-between; margin-bottom: 3rem;">
    <div>
        <h3>
            페이지 라우팅간 애니메이션
        </h3>
        <img src="https://user-images.githubusercontent.com/22493971/187088426-324d0cfe-0c31-42fb-be17-1080586095af.gif" width="300" />
        <li>
            history의 push, pop 이벤트에 따라 좌우 트랜지션 애니메이션이 나타납니다.
        </li>
    </div>
    <div>
        <h3>
            홈페이지
        </h3>
        <img src="https://user-images.githubusercontent.com/22493971/187348235-3a461643-c89e-4725-ba28-59bef6f72a71.gif" width="300" />
        <li>유저 동작에 따라 각 페이지로 이동이 가능합니다.</li>
        <li>상품들은 스크롤을 끝까지 내리면 무한 스크롤 형태로 새로운 컨텐츠가 로드됩니다.</li>
        <li>
            로그인 중일 경우 상품에 하트를 눌러 관심목록으로 등록할 수 있습니다.</li>
        <li>
            카테고리 페이지로 이동 후 선택할 경우 카테고리에 따라 상품이 필터링됩니다.
        </li>
    </div>    
</div>

---

<div style="display: flex;justify-content: space-between; margin-bottom: 3rem;gap: 1rem;">
    <div>
        <h3>
            Github OAuth
        </h3>
        <img src="https://i.imgur.com/iHJRbiX.gif" width="300"  />
        <li>깃허브 아이디를 통해 OAuth 로그인이 가능합니다.</li>
    </div>
    <div>    
        <h3>
            지역 변경하기 
        </h3>
        <img src="https://i.imgur.com/1fy5nsu.gif" width="300" />
        <li>로그인 중일 경우 헤더 중앙 버튼을 클릭해 지역 변경하기 페이지로 이동할 수 있습니다.</li>
        <li>지역 변경하기 페이지는 검색 기능을 제공합니다.</li> 
    </div>
</div>

---

<div>
    <h3>
    글쓰기
</h3>

<img src="https://i.imgur.com/K4ycCek.gif" width="300" />

<li>로그인 중일 경우 하단의 글쓰기 버튼을 통해 글쓰기 페이지로 이동합니다.</li>
<li>사진과 그 외의 인풋들을 입력하고 새로운 글을 등록할 수 있습니다.</li>    
</div>

---

<h3>
    마이페이지 (판매목록/채팅목록/관심목록)
</h3>

<div align="center">
    <img src="https://i.imgur.com/ufOBLOK.png" width="200" />    
    <img src="https://i.imgur.com/nJ8NQy4.png" width="200" />
    <img src="https://i.imgur.com/Jj5STUX.png" width="200" />
</div>

<li>해당 유저가 업로드한 상품 목록이 나타납니다.</li>
<li>해당 유저가 참여중인 채팅방의 목록이 나타납니다.</li>
<li>해당 유저가 좋아요를 누른 상품의 목록이 나타납니다.</li>

---

<h3>
    채팅기능
</h3>

<img src="https://i.imgur.com/gMl8YmX.gif" />
