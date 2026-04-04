export default function Footer() {
  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3
              className="text-lg font-bold text-[var(--foreground)] mb-2"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              ⚖️ 법령이지
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              누구나 쉽게 찾는 대한민국 법률
              <br />
              법제처 Open API 기반 공공서비스
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">
              바로가기
            </h4>
            <ul className="space-y-1 text-sm text-[var(--text-muted)]">
              <li>
                <a href="/search" className="hover:text-[var(--primary)]">
                  법령 검색
                </a>
              </li>
              <li>
                <a href="/precedent" className="hover:text-[var(--primary)]">
                  판례 검색
                </a>
              </li>
              <li>
                <a href="/compare" className="hover:text-[var(--primary)]">
                  신구대조 비교
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">
              데이터 출처
            </h4>
            <ul className="space-y-1 text-sm text-[var(--text-muted)]">
              <li>
                <a
                  href="https://www.law.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)]"
                >
                  국가법령정보센터
                </a>
              </li>
              <li>
                <a
                  href="https://open.law.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)]"
                >
                  법제처 Open API
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} 법령이지 (LawEasy). 법제처 Open API
          기반 공공서비스.
        </div>
      </div>
    </footer>
  );
}
