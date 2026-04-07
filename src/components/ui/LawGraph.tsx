"use client";

import { useEffect, useRef, useCallback } from "react";

interface GraphNode {
  id: string;
  label: string;
  type: "situation" | "keyword" | "law" | "precedent";
  meta?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface LawGraphProps {
  nodes: { id: string; label: string; type: "situation" | "keyword" | "law" | "precedent"; meta?: string }[];
  edges: GraphEdge[];
  onNodeClick?: (node: { id: string; label: string; type: string; meta?: string }) => void;
}

const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  situation: { bg: "#F39C12", border: "#E67E22", text: "#fff" },
  keyword: { bg: "#2B4C7E", border: "#1A3A5C", text: "#fff" },
  law: { bg: "#27AE60", border: "#1E8449", text: "#fff" },
  precedent: { bg: "#8E44AD", border: "#6C3483", text: "#fff" },
};

const NODE_RADIUS: Record<string, number> = {
  situation: 40,
  keyword: 30,
  law: 25,
  precedent: 22,
};

export default function LawGraph({ nodes: rawNodes, edges, onNodeClick }: LawGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const hoveredRef = useRef<string | null>(null);
  const settledRef = useRef(false);
  const animRef = useRef<number>(0);
  const dimRef = useRef({ w: 800, h: 500 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const nodes = nodesRef.current;
    const { w, h } = dimRef.current;
    const dpr = window.devicePixelRatio || 1;
    const hovered = hoveredRef.current;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // 간선
    for (const edge of edges) {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;
      const isHighlight = hovered && (hovered === source.id || hovered === target.id);
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = isHighlight ? "rgba(43, 76, 126, 0.6)" : "rgba(213, 207, 199, 0.5)";
      ctx.lineWidth = isHighlight ? 2.5 : 1;
      ctx.stroke();
    }

    // 노드
    for (const node of nodes) {
      const r = NODE_RADIUS[node.type] || 20;
      const colors = NODE_COLORS[node.type] || NODE_COLORS.keyword;
      const isHovered = hovered === node.id;
      const drawR = isHovered ? r + 4 : r;

      // 그림자
      ctx.shadowColor = isHovered ? colors.border : "transparent";
      ctx.shadowBlur = isHovered ? 15 : 0;

      // 원
      ctx.beginPath();
      ctx.arc(node.x, node.y, drawR, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg;
      ctx.fill();
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // 텍스트
      ctx.fillStyle = colors.text;
      ctx.font = `${node.type === "situation" ? "bold 12px" : "11px"} Pretendard, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxWidth = r * 1.8;
      const label = node.label;
      if (ctx.measureText(label).width > maxWidth && label.length > 6) {
        const mid = Math.ceil(label.length / 2);
        ctx.fillText(label.slice(0, mid), node.x, node.y - 6);
        ctx.fillText(label.slice(mid), node.x, node.y + 6);
      } else {
        ctx.fillText(label, node.x, node.y);
      }

      // 타입 라벨
      if (node.meta) {
        ctx.fillStyle = "rgba(62, 44, 30, 0.5)";
        ctx.font = "9px Pretendard, sans-serif";
        ctx.fillText(node.meta, node.x, node.y + drawR + 12);
      }
    }
  }, [edges]);

  // 시뮬레이션 — rawNodes 바뀔 때만 실행
  useEffect(() => {
    if (rawNodes.length === 0) return;

    const container = canvasRef.current?.parentElement;
    if (container) {
      const isMobile = window.innerWidth < 640;
      dimRef.current = {
        w: container.clientWidth,
        h: isMobile ? Math.max(350, window.innerHeight * 0.5) : Math.max(500, container.clientHeight),
      };
    }
    const { w, h } = dimRef.current;
    const cx = w / 2;
    const cy = h / 2;

    // 초기 위치
    settledRef.current = false;
    nodesRef.current = rawNodes.map((node, i) => {
      if (node.type === "situation") {
        return { ...node, x: cx, y: cy, vx: 0, vy: 0 };
      }
      const angle = (2 * Math.PI * i) / rawNodes.length;
      const dist = node.type === "keyword" ? 130 : node.type === "law" ? 230 : 260;
      return {
        ...node,
        x: cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 50,
        y: cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
      };
    });

    let tick = 0;
    const maxTicks = 150;

    function simulate() {
      const nodes = nodesRef.current;

      // 반발력
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 2500 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx += fx;
          nodes[i].vy += fy;
          nodes[j].vx -= fx;
          nodes[j].vy -= fy;
        }
      }

      // 인력 (간선)
      for (const edge of edges) {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const idealDist = source.type === "situation" ? 160 : 130;
        const force = (dist - idealDist) * 0.008;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }

      // 중앙 인력
      for (const node of nodes) {
        node.vx += (cx - node.x) * 0.0008;
        node.vy += (cy - node.y) * 0.0008;
      }

      // 상황 노드 고정
      const sitNode = nodes.find((n) => n.type === "situation");
      if (sitNode) {
        sitNode.x = cx;
        sitNode.y = cy;
        sitNode.vx = 0;
        sitNode.vy = 0;
      }

      // 속도 적용 + 감쇠
      const damping = 0.82;
      for (const node of nodes) {
        if (node.type === "situation") continue;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;
        const r = NODE_RADIUS[node.type] || 20;
        node.x = Math.max(r + 10, Math.min(w - r - 10, node.x));
        node.y = Math.max(r + 10, Math.min(h - r - 10, node.y));
      }

      draw();
      tick++;
      if (tick < maxTicks) {
        animRef.current = requestAnimationFrame(simulate);
      } else {
        // 시뮬레이션 완료 — 노드 고정
        settledRef.current = true;
        for (const node of nodes) {
          node.vx = 0;
          node.vy = 0;
        }
        draw();
      }
    }

    simulate();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNodes, edges]);

  // 좌표 변환 — DPR 무관하게 CSS 좌표로 변환
  function getCanvasCoords(clientX: number, clientY: number): { mx: number; my: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    return { mx: clientX - rect.left, my: clientY - rect.top };
  }

  // 노드 히트 테스트 — 모바일에서 터치 영역 넓힘
  function findNodeAt(mx: number, my: number, extraPadding = 0): GraphNode | null {
    for (const node of nodesRef.current) {
      const r = (NODE_RADIUS[node.type] || 20) + 5 + extraPadding;
      const dx = mx - node.x;
      const dy = my - node.y;
      if (dx * dx + dy * dy < r * r) return node;
    }
    return null;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { mx, my } = getCanvasCoords(e.clientX, e.clientY);
    const node = findNodeAt(mx, my);
    const newHovered = node?.id ?? null;

    if (hoveredRef.current !== newHovered) {
      hoveredRef.current = newHovered;
      const canvas = canvasRef.current;
      if (canvas) canvas.style.cursor = newHovered ? "pointer" : "default";
      draw();
    }
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onNodeClick) return;
    const { mx, my } = getCanvasCoords(e.clientX, e.clientY);
    const node = findNodeAt(mx, my);
    if (node) onNodeClick(node);
  }

  // 터치 이벤트 — 모바일 지원
  function handleTouchEnd(e: React.TouchEvent<HTMLCanvasElement>) {
    if (!onNodeClick) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const { mx, my } = getCanvasCoords(touch.clientX, touch.clientY);
    const node = findNodeAt(mx, my, 8); // 모바일은 터치 영역 더 넓게
    if (node) {
      e.preventDefault();
      onNodeClick(node);
    }
  }

  function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    const touch = e.touches[0];
    if (!touch) return;
    const { mx, my } = getCanvasCoords(touch.clientX, touch.clientY);
    const node = findNodeAt(mx, my, 8);
    const newHovered = node?.id ?? null;
    if (hoveredRef.current !== newHovered) {
      hoveredRef.current = newHovered;
      draw();
    }
  }

  // 리사이즈 대응
  useEffect(() => {
    function handleResize() {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const newW = container.clientWidth;
      const newH = Math.max(350, Math.min(500, window.innerHeight * 0.5));
      if (Math.abs(dimRef.current.w - newW) > 20 || Math.abs(dimRef.current.h - newH) > 20) {
        dimRef.current = { w: newW, h: newH };
        // 노드 위치 비율 유지하며 재조정
        const nodes = nodesRef.current;
        if (nodes.length > 0) {
          const cx = newW / 2;
          const cy = newH / 2;
          const sitNode = nodes.find((n) => n.type === "situation");
          if (sitNode) {
            sitNode.x = cx;
            sitNode.y = cy;
          }
          for (const node of nodes) {
            node.x = Math.max(30, Math.min(newW - 30, node.x));
            node.y = Math.max(30, Math.min(newH - 30, node.y));
          }
        }
        draw();
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  if (rawNodes.length === 0) return null;

  return (
    <div className="relative w-full" style={{ minHeight: 350 }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="touch-none"
      />
      {/* 범례 */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg border border-[var(--border)] p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.situation.bg }} />
          <span>내 상황</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.keyword.bg }} />
          <span>키워드</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.law.bg }} />
          <span>관련 법령</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.precedent.bg }} />
          <span>관련 판례</span>
        </div>
      </div>
    </div>
  );
}
