# MWC 시계

MWC 시계와 첫 제품 **Mil-W-46374B 데저트카키**를 소개하는 한국어 정적 브랜드 사이트입니다.

## 구성

- 홈 — 브랜드 한 줄 소개와 대표 제품
- 내 소개 — 브랜드를 시작한 이유와 제작 원칙
- 제품 — 데저트카키 소개와 임시 사양
- 이야기 — 제작 기록과 아카이브용 글 목록
- 연락하기 — 임시 이메일 연락처

## 실행

빌드 도구와 설치 과정이 없습니다. 저장소 최상위의 `index.html`을 브라우저에서 열면 됩니다. 로컬 서버가 필요하다면 다음처럼 실행할 수 있습니다.

```powershell
python -m http.server 8000
```

이후 `http://localhost:8000`으로 접속하세요.

## 수정할 곳

- 텍스트 및 섹션 구조: `index.html`
- 색상·타이포그래피·반응형 스타일: `styles.css`
- 모바일 메뉴·스크롤 상태: `script.js`
- 홈 착용 이미지: `assets/desert-khaki-on-wrist.jpg`
- 제품 다이얼 이미지: `assets/desert-khaki-dial-detail.jpg`
- 제품 야광·케이스백 이미지: `assets/desert-khaki-lume.jpg`, `assets/desert-khaki-caseback.jpg`
- 무브먼트 조립·분해도: `assets/miyota-2035-exploded-view.jpg`
- 디자인 원칙과 토큰: `DESIGN.md`

제작자 사진, 연락처와 일부 이야기 글은 현재 자연스러운 임시 문구로 채워져 있습니다. 실제 정보가 정해지면 반드시 교체해 주세요.

제품 사진은 [서플라이루트의 MIL-W-46374B 데저트 카키 컬렉션 상품 페이지](https://supplyroute.co.kr/product/detail.html?product_no=4037&cate_no=449&display_group=3)에서 가져왔습니다.
MIYOTA 2035 조립·분해도와 무브먼트 사양은 [MIYOTA 공식 Cal. 2035 페이지](https://miyotamovement.com/product/2035/)를 참조했습니다.
