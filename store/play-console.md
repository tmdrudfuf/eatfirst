# Play Console 입력값 / 출시 체크리스트

## 1. 업로드 키 (한 번만, 직접 실행)

키는 저장소 밖에 두고 반드시 백업하세요. 비밀번호는 keytool이 물어볼 때 직접 입력합니다.

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore C:/Users/tmdru/eatfirst-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

`C:\Users\tmdru\.gradle\gradle.properties` 에 추가 (저장소에 넣지 않음):

```
EATFIRST_UPLOAD_STORE_FILE=C:/Users/tmdru/eatfirst-upload.jks
EATFIRST_UPLOAD_STORE_PASSWORD=<키스토어 비밀번호>
EATFIRST_UPLOAD_KEY_ALIAS=upload
EATFIRST_UPLOAD_KEY_PASSWORD=<키 비밀번호>
```

이 값이 없으면 release는 디버그 키로 서명되고, Play가 업로드를 거부합니다 (실수 방지).
Play App Signing을 쓰므로 업로드 키를 잃어버려도 Play 고객센터에서 재설정할 수 있습니다.

## 2. AAB 빌드

```bash
npx expo prebuild -p android --no-install
cd android && ./gradlew bundleRelease
```

결과: `android/app/build/outputs/bundle/release/app-release.aab`
다음 업로드부터는 `app.json`의 `expo.version`과 `expo.android.versionCode`를 올리세요 (versionCode는 매번 +1).

## 3. 앱 만들기 / 기본 정보

| 항목 | 값 |
|---|---|
| 앱 이름 | Eat First |
| 기본 언어 | English (United States) — 한국어 등록정보는 `listing.md` |
| 앱/게임 | 앱 · 무료 |
| 카테고리 | 음식 및 음료 (Food & Drink) |
| 연락처 이메일 | tmdrudfuf@gmail.com |
| 웹사이트 | https://tmdrudfuf.github.io/eatfirst/ |
| 개인정보처리방침 | https://tmdrudfuf.github.io/eatfirst/privacy.html |

## 4. 앱 콘텐츠 (App content)

| 항목 | 답 |
|---|---|
| 앱 액세스 권한 | 모든 기능을 특별한 액세스 없이 사용 가능 (로그인 없음) |
| 광고 | 예, 광고 포함 |
| 콘텐츠 등급 (IARC) | 폭력·성적·도박·약물 등 전부 아니오, 사용자 간 소통 없음, 위치 공유 없음, 디지털 구매 없음 → 전체이용가 예상 |
| 타겟층 | 13세 이상만 선택 (13세 미만 포함 시 가족 정책·인증 광고 SDK 요건이 붙음) |
| 뉴스 앱 / 정부 앱 / 금융 기능 / 건강 앱 | 아니오 |
| 광고 ID | 예, 사용함 — 용도: 광고 또는 마케팅 (AdMob) |

## 5. 데이터 보안 (Data safety) — 초안

앱이 직접 수집하는 데이터는 **없음** (음식 목록은 기기에만 저장, 서버 없음).
AdMob SDK가 수집하는 항목을 신고합니다. 제출 전 Google 공식 안내와 대조하세요:
https://developers.google.com/admob/android/privacy/play-data-disclosure

| 질문 | 답 |
|---|---|
| 필수 유형의 사용자 데이터를 수집 또는 공유하나요? | 예 (AdMob SDK) |
| 전송 중 암호화? | 예 |
| 계정 생성 | 앱에 계정 없음 |
| 데이터 삭제 요청 방법 | 계정이 없어 해당 없음 — 광고 ID 재설정 방법은 개인정보처리방침에 안내 |

신고할 데이터 유형 (모두: 수집됨, 공유됨, 필수, 목적 = 광고/마케팅 · 분석 · 사기 방지/보안):

- 위치 → 대략적인 위치 (IP 기반)
- 앱 활동 → 앱 상호작용 (광고 노출·클릭)
- 앱 정보 및 성능 → 진단
- 기기 또는 기타 ID → 광고 ID

## 6. 테스트 → 프로덕션

상태 (2026-10-06): 앱 생성·앱 콘텐츠·스토어 등록정보 완료, Alpha 트랙(대한민국·미국, 테스터 Owner)에 1 (1.0.0) 올리고 **검토 제출함**.


1. 비공개 테스트(Closed testing) 트랙 만들기 → AAB 업로드 → 테스터 이메일 목록 또는 Google 그룹 추가
2. 신규 개인 개발자 계정: 테스터 12명 이상이 14일 연속 참여해야 프로덕션 신청 가능 (Play Console에서 현재 기준 확인)
3. 테스터에게 옵트인 링크 공유 → 14일 후 프로덕션 액세스 신청 → 프로덕션 출시

## 7. AdMob 쪽

- 앱 ID `ca-app-pub-3024928824650244~8305611753`, 배너 단위 `ca-app-pub-3024928824650244/4696530073` → 코드 반영 완료
- 개인정보 보호 및 메시지 → GDPR(유럽) 동의 메시지 만들기 — 없으면 EEA/UK 사용자에게 광고가 제한됨
- 설정 → 테스트 기기에 본인 폰 등록 (실광고 빌드에서 본인 광고 클릭 방지)
- Play에 등록된 뒤 AdMob 앱을 스토어 등록정보와 연결
- app-ads.txt: 개발자 웹사이트 **도메인 루트**에 있어야 함. `tmdrudfuf.github.io/eatfirst`는 하위 경로라 안 되고,
  `tmdrudfuf.github.io` 저장소(사용자 사이트)를 따로 만들어 루트에 올리거나 개인 도메인이 필요 (권장 사항, 필수 아님)
