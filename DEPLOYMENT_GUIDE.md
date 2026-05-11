# 배포 가이드

## 📦 1단계: 프로젝트를 로컬로 가져오기

### 현재 위치에서 전체 프로젝트 다운로드

이 프로젝트를 로컬 컴퓨터로 가져가려면:

1. **VS Code에서 직접 열기** (Figma Make가 VS Code 확장으로 실행 중인 경우)
   - 이미 로컬 파일 시스템에 있습니다
   - 터미널에서 `pwd` 명령으로 현재 위치 확인

2. **전체 폴더 복사** (다른 환경에서 작업하는 경우)
   ```bash
   # 현재 디렉토리의 모든 파일을 원하는 위치로 복사
   cp -r /workspaces/default/code /your/desired/path/my-app
   ```

### 필수 파일 확인

다음 파일들이 있는지 확인하세요:
- ✅ `index.html` - **수동으로 생성 필요** (아래 내용 참조)
- ✅ `src/main.tsx` - 이미 생성됨
- ✅ `package.json` - 업데이트됨
- ✅ `.gitignore` - 생성됨
- ✅ `tsconfig.json` - 생성됨
- ✅ `vite.config.ts` - 이미 존재

### ⚠️ index.html 파일 수동 생성

프로젝트 루트에 `index.html` 파일을 다음 내용으로 생성하세요:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 💻 2단계: 로컬 개발 환경 설정

### 1. Node.js 설치
```bash
# Node.js 버전 확인 (18 이상 필요)
node -v

# 없으면 https://nodejs.org 에서 다운로드
```

### 2. pnpm 설치 (권장)
```bash
npm install -g pnpm
```

### 3. 의존성 설치
```bash
cd /path/to/your/project
pnpm install
```

### 4. 환경 변수 설정 (Supabase 사용 시)
프로젝트 루트에 `.env` 파일 생성:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. 로컬 개발 서버 실행
```bash
pnpm dev
```

브라우저에서 `http://localhost:5173` 열기

---

## 🐙 3단계: GitHub 저장소 생성 및 푸시

### GitHub에서 새 저장소 생성
1. https://github.com/new 방문
2. 저장소 이름 입력 (예: `my-app`)
3. Public 또는 Private 선택
4. **"Add a README file" 체크 해제** (이미 있음)
5. "Create repository" 클릭

### 로컬에서 Git 초기화 및 푸시
```bash
# Git 초기화 (아직 안 했다면)
git init

# 파일 스테이징
git add .

# 첫 커밋
git commit -m "Initial commit: Migrated from Figma Make"

# 원격 저장소 연결
git remote add origin https://github.com/your-username/your-repo-name.git

# 메인 브랜치로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

---

## ☁️ 4단계: GCP에 배포

Google Cloud Platform에 배포하는 방법은 여러 가지가 있습니다:

### 옵션 A: Cloud Run (추천 - 가장 간단)

**장점:** 
- 서버리스 (자동 스케일링)
- 사용한 만큼만 지불
- Docker 기반으로 간단

**단계:**

1. **Google Cloud SDK 설치**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Windows/Linux
   # https://cloud.google.com/sdk/docs/install 참조
   ```

2. **GCP 프로젝트 초기화**
   ```bash
   gcloud init
   gcloud auth login
   
   # 새 프로젝트 생성
   gcloud projects create my-app-project --name="My App"
   gcloud config set project my-app-project
   
   # 필요한 API 활성화
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

3. **Dockerfile 생성** (프로젝트 루트에)
   ```dockerfile
   # Build stage
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install --frozen-lockfile
   COPY . .
   RUN pnpm build

   # Production stage
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 8080
   CMD ["nginx", "-g", "daemon off;"]
   ```

4. **nginx.conf 생성** (프로젝트 루트에)
   ```nginx
   server {
       listen 8080;
       server_name _;
       
       root /usr/share/nginx/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # 캐싱 설정
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

5. **Cloud Run에 배포**
   ```bash
   # Cloud Build를 사용하여 배포
   gcloud run deploy my-app \
     --source . \
     --platform managed \
     --region asia-northeast3 \
     --allow-unauthenticated \
     --port 8080
   
   # 배포 완료 후 URL이 출력됩니다
   ```

6. **환경 변수 설정** (Supabase 등)
   ```bash
   gcloud run services update my-app \
     --set-env-vars="VITE_SUPABASE_URL=your_url,VITE_SUPABASE_ANON_KEY=your_key"
   ```

### 옵션 B: Firebase Hosting (정적 사이트 호스팅)

**장점:**
- 초고속 CDN
- 무료 SSL 인증서
- 간단한 설정

**단계:**

1. **Firebase CLI 설치**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Firebase 프로젝트 초기화**
   ```bash
   firebase init hosting
   
   # 질문에 답변:
   # - Public directory: dist
   # - Single-page app: Yes
   # - GitHub 자동 배포: 선택사항
   ```

3. **빌드 및 배포**
   ```bash
   pnpm build
   firebase deploy
   ```

### 옵션 C: App Engine (전통적인 방식)

1. **app.yaml 생성**
   ```yaml
   runtime: nodejs18
   
   handlers:
     - url: /.*
       secure: always
       redirect_http_response_code: 301
       script: auto
   ```

2. **배포**
   ```bash
   gcloud app deploy
   ```

---

## 📊 비용 예상

### Cloud Run (추천)
- 월 200만 요청 무료
- 그 이상: $0.40/백만 요청
- 메모리/CPU 사용량에 따라 추가

### Firebase Hosting
- 월 10GB 저장 및 360MB/일 전송 무료
- 그 이상: $0.026/GB

### App Engine
- 일일 할당량 내 무료
- 초과 시 인스턴스 시간당 과금

---

## 🔄 CI/CD 설정 (선택사항)

GitHub Actions를 사용한 자동 배포:

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy my-app \
          --source . \
          --platform managed \
          --region asia-northeast3 \
          --allow-unauthenticated
```

GitHub Secrets에 추가:
- `GCP_PROJECT_ID`: GCP 프로젝트 ID
- `GCP_SA_KEY`: Service Account JSON 키

---

## 🐛 트러블슈팅

### "index.html not found" 오류
→ 프로젝트 루트에 `index.html` 파일이 있는지 확인

### "Module not found" 오류
→ `pnpm install` 다시 실행

### Supabase 연결 오류
→ `.env` 파일의 환경 변수 확인

### 빌드 오류
→ `pnpm build` 로컬에서 먼저 테스트

### Cloud Run 포트 오류
→ Dockerfile에서 `EXPOSE 8080` 확인

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] `index.html` 파일 생성됨
- [ ] 로컬에서 `pnpm dev` 정상 작동
- [ ] 로컬에서 `pnpm build` 성공
- [ ] `.env` 파일 환경 변수 설정 (필요시)
- [ ] `.gitignore`에 민감한 파일들 추가됨
- [ ] GitHub 저장소 생성 및 푸시 완료
- [ ] GCP 프로젝트 생성 및 결제 활성화
- [ ] 필요한 GCP API 활성화됨

---

## 📚 추가 리소스

- [Vite 공식 문서](https://vitejs.dev/)
- [Cloud Run 문서](https://cloud.google.com/run/docs)
- [Firebase Hosting 문서](https://firebase.google.com/docs/hosting)
- [React Router 문서](https://reactrouter.com/)
- [Supabase 문서](https://supabase.com/docs)

---

문제가 발생하면 각 서비스의 로그를 확인하세요:

```bash
# Cloud Run 로그
gcloud run logs read my-app --region=asia-northeast3

# Firebase 배포 로그
firebase deploy --debug
```
