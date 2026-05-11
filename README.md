# My App

React + TypeScript + Vite + Tailwind CSS application originally created with Figma Make.

## 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- pnpm (권장) 또는 npm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 프로젝트 구조

```
├── src/
│   ├── app/
│   │   ├── App.tsx          # 메인 애플리케이션 컴포넌트
│   │   └── components/       # React 컴포넌트들
│   ├── styles/               # CSS 파일들
│   └── main.tsx              # 애플리케이션 진입점
├── index.html                # HTML 템플릿
├── vite.config.ts            # Vite 설정
└── package.json
```

## 환경 변수

Supabase를 사용하는 경우 `.env` 파일을 생성하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## GCP 배포

자세한 배포 가이드는 아래 섹션을 참고하세요.
