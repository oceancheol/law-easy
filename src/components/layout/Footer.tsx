import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl">&#9878;&#65039;</span>
              <span className="text-lg font-bold text-[var(--foreground)]">
                LawEasy
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              누구나 쉽게 찾는 대한민국 법률
              <br />
              법제처 Open API 기반 공공서비스
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              서비스
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <Link href="/situation" className="hover:text-[var(--primary)] transition-colors">
                  상황분석
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[var(--primary)] transition-colors">
                  법령 검색
                </Link>
              </li>
              <li>
                <Link href="/precedent" className="hover:text-[var(--primary)] transition-colors">
                  판례 검색
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[var(--primary)] transition-colors">
                  신구대조 비교
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-[var(--primary)] transition-colors">
                  용어사전
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              데이터 출처
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <a
                  href="https://www.law.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  국가법령정보센터 ↗
                </a>
              </li>
              <li>
                <a
                  href="https://open.law.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  법제처 Open API ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[var(--border-light)] text-center text-xs text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} LawEasy. 법제처 Open API 기반 공공서비스.
        </div>
      </div>
    </footer>
  );
}
