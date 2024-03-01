# _school-news-feed_

### [프로젝트 개요]

-   #### '학교소식 뉴스피드' 를 위한 백엔드 구현

### [프로젝트 내용]

-   #### 개발 스택은 NestJS 프레임워크 기반 DynamoDB를 사용함
-   #### Swagger(http://localhost:3000/api-docs) 기반 API 관련 확인이 가능함

-   #### API 구현 항목
    - ##### 학교 생성: [POST] /api/schools { schoolRegion, schoolName }
    - ##### 학교 소식 생성: [POST] /api/schools/:schoolId/news { content }
    - ##### 학교 소식 삭제: [DELETE] /api/schools/:schoolId/news/:newsId
    - ##### 학교 소식 수정: [PUT] /api/schools/:schoolId/news/:newsId { content }
    - ##### 학교 소식 구독 설정: [POST] /api/students/:studentId/subscriptions/:schoolId
    - ##### 학교 소식 구독 해제: [DELETE] /api/students/:studentId/subscriptions/:schoolId
    - ##### 구독 학교 리스트 확인: [GET] /api/students/:studentId/subscriptions
    - ##### 구독한 학교 소식 확인: [GET] /api/students/:studentId/newsfeed

-   #### DB 설계 항목
    - ##### Schools
        | Name         | Type   | Note         |
        |--------------|--------|--------------|
        | idx          | number | partitionKey |
        | schoolRegion | string |              |
        | schoolName   | string |              |
        | createdAt    | string |              |

    - ##### News
        | Name      | Type   | Note         |
        |-----------|--------|--------------|
        | idx       | number | partitionKey |
        | schoolId  | number |              |
        | newsId    | number |              |
        | content   | string |              |
        | isDelete  | number |              |
        | createdAt | string |              |
        | updatedAt | string |              |
        | deletedAt | string |              |

    - ##### Subscriptions
        | Name          | Type   | Note         |
        |---------------|--------|--------------|
        | idx           | number | partitionKey |
        | studentId     | number |              |
        | schoolId      | number |              |
        | currentNewsId | number |              |
        | lastNewsId    | number |              |
        | isCancel      | number |              |
        | createdAt     | string |              |
        | canceledAt    | string |              |

### [프로젝트 빌드 & 테스트 & 실행 방법]

-   #### npm i && npm run test && npm run test:e2e && npm start
