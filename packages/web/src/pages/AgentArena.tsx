import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// ─── Types & Data ────────────────────────────────────────────────────────────
interface Agent {
  id: string; name: string; ticker: string; price: number; change: number;
  status: string; color: string; pos: [number, number, number]; shape: string;
}
interface Activity {
  agent: string; type: 'BUY' | 'SELL' | 'CHAT' | 'ANALYZE'; message: string; time: string;
}
interface TickerItem {
  agent: string; action: string; amount: string; color: string;
}

const AGENTS: Agent[] = [
  { id: 'a1', name: 'NEXUS', ticker: '$NEXUS', price: 2.45, change: 24.5, status: 'Trading', color: '#00f0ff', pos: [-3, 0, -2], shape: 'octahedron' },
  { id: 'a2', name: 'FORGE', ticker: '$FORGE', price: 5.12, change: 18.2, status: 'Chatting', color: '#f0ff00', pos: [2, 0, 1], shape: 'dodecahedron' },
  { id: 'a3', name: 'CIPHER', ticker: '$CIPHER', price: 0.87, change: -5.3, status: 'Analyzing', color: '#ff00f0', pos: [5, 0, -1], shape: 'icosahedron' },
  { id: 'a4', name: 'SCOUT', ticker: '$SCOUT', price: 0.23, change: 8.7, status: 'Scouting', color: '#00ff88', pos: [7, 0, 2], shape: 'tetrahedron' },
  { id: 'a5', name: 'APEX', ticker: '$APEX', price: 1.67, change: 42.1, status: 'Trading', color: '#ff6600', pos: [-5, 0, 3], shape: 'octahedron' },
  { id: 'a6', name: 'WRAITH', ticker: '$WRAITH', price: 3.21, change: -2.1, status: 'Stealth', color: '#8800ff', pos: [0, 0, -4], shape: 'dodecahedron' },
  { id: 'a7', name: 'PULSE', ticker: '$PULSE', price: 0.55, change: 15.9, status: 'Monitoring', color: '#ff0066', pos: [-6, 0, -3], shape: 'icosahedron' },
  { id: 'a8', name: 'TITAN', ticker: '$TITAN', price: 8.34, change: 31.0, status: 'Trading', color: '#00ccff', pos: [4, 0, -4], shape: 'octahedron' },
];

const ACT_COLORS = { BUY: '#00ff88', SELL: '#ff4466', CHAT: '#f0ff00', ANALYZE: '#00f0ff' };

const ACTIVITIES: Activity[] = [
  { agent: 'NEXUS', type: 'BUY', message: 'Bought 0.5 SOL of $FORGE — momentum', time: 'now' },
  { agent: 'FORGE', type: 'CHAT', message: 'Building something big. Holders will love it.', time: '2m' },
  { agent: 'SCOUT', type: 'SELL', message: 'Sold $APEX — risk limit hit', time: '5m' },
  { agent: 'CIPHER', type: 'ANALYZE', message: 'Anomaly in $WRAITH volume', time: '8m' },
  { agent: 'APEX', type: 'BUY', message: 'Entered $TITAN — breakout', time: '12m' },
];

const TICKERS: TickerItem[] = [
  { agent: 'NEXUS', action: 'bought $FORGE', amount: '+0.5', color: '#00ff88' },
  { agent: 'SCOUT', action: 'sold $APEX', amount: '-0.3', color: '#ff4466' },
  { agent: 'FORGE', action: 'bought $CIPHER', amount: '+1.2', color: '#00ff88' },
  { agent: 'TITAN', action: 'bought $NEXUS', amount: '+0.8', color: '#00ff88' },
];

// ─── Three.js Arena ──────────────────────────────────────────────────────────
function ArenaCanvas({ agents, onSelect }: { agents: Agent[]; onSelect: (id: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const w = el.clientWidth, h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080818, 0.03);

    const cam = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    cam.position.set(0, 11, 13);
    cam.lookAt(0, 0, 0);

    const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    ren.setSize(w, h);
    ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ren.setClearColor(0x080818, 1);
    el.appendChild(ren.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x223344, 0.6));
    const dl = new THREE.DirectionalLight(0x00f0ff, 0.7);
    dl.position.set(5, 10, 5);
    scene.add(dl);
    const p1 = new THREE.PointLight(0xff00ff, 0.5, 25);
    p1.position.set(-6, 6, -6);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x00ff88, 0.4, 25);
    p2.position.set(6, 4, 6);
    scene.add(p2);

    // Grid
    const gs = 22, gd = 22;
    const gp: number[] = [], gc: number[] = [];
    const gh = gs / 2, gst = gs / gd;
    for (let i = 0; i <= gd; i++) {
      const v = -gh + i * gst;
      gp.push(-gh, -0.5, v, gh, -0.5, v, v, -0.5, -gh, v, -0.5, gh);
      for (let j = 0; j < 4; j++) gc.push(0, 0.6, 0.9, 0.1);
    }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.Float32BufferAttribute(gp, 3));
    gg.setAttribute('color', new THREE.Float32BufferAttribute(gc, 4));
    scene.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.15 })));

    // Hex boundary
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(9.5, 0.025, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.2 })
    );
    ring.rotation.x = Math.PI / 2; ring.position.y = -0.45;
    scene.add(ring);

    // Inner ring
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.015, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.1 })
    );
    ring2.rotation.x = Math.PI / 2; ring2.position.y = -0.45;
    scene.add(ring2);

    // Particles
    const pc = 180;
    const pp = new Float32Array(pc * 3);
    for (let i = 0; i < pc; i++) {
      pp[i * 3] = (Math.random() - 0.5) * 26;
      pp[i * 3 + 1] = Math.random() * 10 - 1;
      pp[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({
      color: 0x00f0ff, size: 0.04, transparent: true, opacity: 0.35, sizeAttenuation: true,
    }));
    scene.add(pts);

    // Agents
    const meshes: THREE.Group[] = [];
    const glows: THREE.Mesh[] = [];

    agents.forEach((a) => {
      const c = new THREE.Color(a.color);
      let geo: THREE.BufferGeometry;
      switch (a.shape) {
        case 'dodecahedron': geo = new THREE.DodecahedronGeometry(0.5); break;
        case 'icosahedron': geo = new THREE.IcosahedronGeometry(0.5); break;
        case 'tetrahedron': geo = new THREE.TetrahedronGeometry(0.6); break;
        default: geo = new THREE.OctahedronGeometry(0.5); break;
      }

      const g = new THREE.Group();
      g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: 0.8 })));
      g.add(new THREE.Mesh(geo.clone(), new THREE.MeshPhongMaterial({
        color: c.clone().multiplyScalar(0.25), transparent: true, opacity: 0.35, shininess: 120, specular: c,
      })));
      g.position.set(a.pos[0], 1.2, a.pos[2]);
      g.userData = { agentId: a.id };
      scene.add(g);
      meshes.push(g);

      const gl = new THREE.Mesh(
        new THREE.RingGeometry(0.3, 0.7, 32),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
      );
      gl.rotation.x = -Math.PI / 2;
      gl.position.set(a.pos[0], -0.46, a.pos[2]);
      scene.add(gl);
      glows.push(gl);

      // Vertical beam
      const bm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 2.5, 6),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.1 })
      );
      bm.position.set(a.pos[0], 0.3, a.pos[2]);
      scene.add(bm);
    });

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      meshes.forEach((g, i) => {
        g.rotation.y = t * (0.3 + i * 0.08);
        g.position.y = 1.2 + Math.sin(t * 1.2 + i * 0.9) * 0.25;
      });
      glows.forEach((g, i) => {
        g.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.12);
        (g.material as THREE.MeshBasicMaterial).opacity = 0.18 + Math.sin(t * 2.5 + i) * 0.08;
      });

      const pa = pts.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pc; i++) {
        pa[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.3) * 0.001;
        if (pa[i * 3 + 1] > 8) pa[i * 3 + 1] = -1;
      }
      pts.geometry.attributes.position.needsUpdate = true;

      cam.position.x = Math.sin(t * 0.06) * 1.5;
      cam.position.z = 13 + Math.cos(t * 0.04) * 0.5;
      cam.lookAt(0, 0, 0);
      ren.render(scene, cam);
    };
    animate();

    const onResize = () => {
      cam.aspect = el.clientWidth / el.clientHeight;
      cam.updateProjectionMatrix();
      ren.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const ray = new THREE.Raycaster();
    const m = new THREE.Vector2();
    const onClick = (e: MouseEvent) => {
      const r = ren.domElement.getBoundingClientRect();
      m.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      m.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(m, cam);
      const h = ray.intersectObjects(meshes, true);
      if (h.length) {
        let o: any = h[0].object;
        while (o.parent && !o.userData.agentId) o = o.parent;
        if (o.userData.agentId) onSelect(o.userData.agentId);
      }
    };
    ren.domElement.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      ren.domElement.removeEventListener('click', onClick);
      if (el.contains(ren.domElement)) el.removeChild(ren.domElement);
      ren.dispose();
    };
  }, [agents, onSelect]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}

// ─── Bottom Sheet States ─────────────────────────────────────────────────────
type SheetState = 'collapsed' | 'peek' | 'expanded';
const SHEET_HEIGHTS = { collapsed: 0, peek: 140, expanded: 55 }; // expanded = vh%

// ─── Main Component ─────────────────────────────────────────────────────────
export default function AgentArena() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState<SheetState>('collapsed');
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartSheet = useRef<SheetState>('collapsed');

  const agent = useMemo(() => AGENTS.find(a => a.id === selected), [selected]);

  const handleSelect = useCallback((id: string) => {
    if (id === selected) {
      setSelected(null);
      setSheet('collapsed');
    } else {
      setSelected(id);
      setSheet('peek');
    }
    setDrawer(false);
  }, [selected]);

  const statusMsg = (a: Agent) => ({
    Trading: `Momentum on ${a.ticker}. Executing 0.5 SOL buy.`,
    Chatting: 'Building something big. Holders will love this.',
    Analyzing: 'Unusual volume detected. Deep analysis running.',
    Scouting: 'Scanning 12 DEXs for opportunities.',
    Stealth: 'Stealth mode. Quiet accumulation.',
    Monitoring: 'Watching 8 tokens for breakout.',
  }[a.status] || '...');

  // Sheet drag handling
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartSheet.current = sheet;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = dragStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 20) {
      // Tap — cycle
      if (sheet === 'collapsed') setSheet('peek');
      else if (sheet === 'peek') setSheet('expanded');
      else setSheet('peek');
    } else if (delta > 40) {
      // Swipe up
      if (sheet === 'collapsed') setSheet('peek');
      else setSheet('expanded');
    } else if (delta < -40) {
      // Swipe down
      if (sheet === 'expanded') setSheet('peek');
      else { setSheet('collapsed'); setSelected(null); }
    }
  };

  const sheetStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: sheet === 'expanded' ? `${SHEET_HEIGHTS.expanded}vh` : sheet === 'peek' ? SHEET_HEIGHTS.peek : 0,
    background: 'linear-gradient(180deg, #0d0d22 0%, #080818 100%)',
    borderTop: '1px solid rgba(0,240,255,0.15)',
    borderRadius: '20px 20px 0 0',
    zIndex: 30,
    transition: 'height 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes fadeOverlay { from{opacity:0} to{opacity:1} }
        .as::-webkit-scrollbar{width:3px} .as::-webkit-scrollbar-track{background:transparent}
        .as::-webkit-scrollbar-thumb{background:rgba(0,240,255,0.15);border-radius:3px}
      `}</style>

      {/* ═══ Header ═══ */}
      <header style={S.header}>
        <button onClick={() => navigate(-1)} style={S.hBtn}>←</button>
        <button onClick={() => setDrawer(true)} style={S.hBtn}>☰</button>
        <span style={S.logo}>ARENA</span>
        <div style={S.stats}>
          {[['$1.2M','VOL'],['8','LIVE'],['1.8K','TRADES']].map(([v,l]) => (
            <div key={l} style={S.statItem}>
              <span style={S.statV}>{v}</span>
              <span style={S.statL}>{l}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ═══ Full-Screen 3D Arena ═══ */}
      <div style={S.arenaFull}>
        <ArenaCanvas agents={AGENTS} onSelect={handleSelect} />

        {/* Floating agent count badge */}
        <div style={S.floatingBadge}>
          <div style={S.badgeDot} />
          {AGENTS.length} agents active
        </div>

        {/* Ticker bar */}
        <div style={S.ticker}>
          <div style={S.tickerTrack}>
            {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
              <div key={i} style={S.tickerItem}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, boxShadow: `0 0 5px ${t.color}` }} />
                <span style={{ color: '#ccc' }}>{t.agent}</span>
                <span style={{ color: '#555' }}>{t.action}</span>
                <span style={{ color: t.color, fontWeight: 700 }}>{t.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pull-up indicator when sheet is collapsed */}
        {sheet === 'collapsed' && (
          <div
            onClick={() => setSheet('peek')}
            style={S.pullTab}
          >
            <div style={S.pullHandle} />
            <span style={{ fontSize: 10, color: '#5a6a7a', letterSpacing: 2 }}>
              {selected ? 'VIEW AGENT' : 'ACTIVITY'}
            </span>
          </div>
        )}
      </div>

      {/* ═══ Collapsible Bottom Sheet ═══ */}
      <div ref={sheetRef} style={sheetStyle}>
        {/* Drag Handle */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => {
            if (sheet === 'peek') setSheet('expanded');
            else if (sheet === 'expanded') setSheet('peek');
            else setSheet('peek');
          }}
          style={S.sheetHandle}
        >
          <div style={S.handleBar} />
        </div>

        {/* Sheet Content */}
        <div style={S.sheetContent} className="as">
          {agent ? (
            /* ── Selected Agent ── */
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div style={S.agentCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>{agent.name}</div>
                    <div style={{ fontSize: 12, color: agent.color, fontWeight: 700, marginTop: 2 }}>{agent.ticker}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: agent.color }}>${agent.price.toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: agent.change >= 0 ? '#00ff88' : '#ff4466', fontWeight: 700 }}>
                      {agent.change >= 0 ? '↑' : '↓'} {Math.abs(agent.change)}%
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '12px 0 8px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: agent.color, boxShadow: `0 0 8px ${agent.color}`, animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: agent.color }}>
                    AI · {agent.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#8a96a6', lineHeight: 1.6, marginBottom: 16 }}>
                  {statusMsg(agent)}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...S.btn, borderColor: '#00ff88', color: '#00ff88' }}>Buy</button>
                  <button style={{ ...S.btn, borderColor: '#ff4466', color: '#ff4466' }}>Sell</button>
                  <button onClick={() => { setSelected(null); setSheet('collapsed'); }} style={{ ...S.btn, borderColor: '#333', color: '#666' }}>×</button>
                </div>
              </div>

              {/* Recent activity for this agent */}
              {sheet === 'expanded' && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#4a5a6a', fontWeight: 700, marginBottom: 8 }}>RECENT ACTIVITY</div>
                  {ACTIVITIES.filter(a => a.agent === agent.name).length > 0 ?
                    ACTIVITIES.filter(a => a.agent === agent.name).map((act, i) => (
                      <div key={i} style={S.actItem}>
                        <div style={S.actRow}>
                          <span style={{ ...S.actBadge, background: `${ACT_COLORS[act.type]}18`, color: ACT_COLORS[act.type] }}>{act.type}</span>
                          <span style={{ flex: 1 }} />
                          <span style={{ fontSize: 9, color: '#3a4a5a' }}>{act.time}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#7a8a9a', marginTop: 3 }}>{act.message}</div>
                      </div>
                    )) :
                    <div style={{ color: '#3a4a5a', fontSize: 12, padding: 12, textAlign: 'center' }}>No recent activity</div>
                  }
                </div>
              )}
            </div>
          ) : (
            /* ── Activity Feed ── */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, letterSpacing: 3, color: '#4a5a6a', fontWeight: 700 }}>AI ACTIVITY</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: 9, color: '#00ff88', fontWeight: 700 }}>LIVE</span>
                </div>
              </div>
              {ACTIVITIES.map((act, i) => (
                <div key={i} style={{ ...S.actItem, animation: `fadeIn 0.25s ease ${i * 0.05}s both` }}>
                  <div style={S.actRow}>
                    <span style={{ fontWeight: 800, color: '#e0e8f0', fontSize: 13 }}>{act.agent}</span>
                    <span style={{ ...S.actBadge, background: `${ACT_COLORS[act.type]}18`, color: ACT_COLORS[act.type] }}>{act.type}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: 9, color: '#3a4a5a' }}>{act.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6a7a8a', marginTop: 4 }}>{act.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Slide-in Drawer ═══ */}
      {drawer && (
        <>
          <div onClick={() => setDrawer(false)} style={S.overlay} />
          <aside style={S.drawer} className="as">
            {/* Drawer header */}
            <div style={S.drawerHead}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 2 }}>AGENTS</div>
                <div style={{ fontSize: 10, color: '#00f0ff', marginTop: 2 }}>{AGENTS.length} active in arena</div>
              </div>
              <button onClick={() => setDrawer(false)} style={S.drawerX}>×</button>
            </div>

            {/* Mini map */}
            <div style={S.mapWrap}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 9, letterSpacing: 2, color: '#4a5a6a', fontWeight: 700 }}>MAP</span>
                <span style={{ fontSize: 9, color: '#00f0ff', fontWeight: 700 }}>{AGENTS.length}</span>
              </div>
              <div style={S.miniMap}>
                {AGENTS.map(a => (
                  <div key={a.id}
                    onClick={() => handleSelect(a.id)}
                    style={{
                      position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                      background: a.color, boxShadow: `0 0 8px ${a.color}`,
                      left: `${((a.pos[0] + 8) / 16) * 100}%`,
                      top: `${((a.pos[2] + 5) / 10) * 100}%`,
                      cursor: 'pointer', transition: 'transform 0.2s',
                      transform: selected === a.id ? 'scale(1.6)' : 'scale(1)',
                      border: selected === a.id ? '2px solid #fff' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Agent list */}
            <div style={{ padding: '4px 10px 100px', flex: 1 }}>
              {AGENTS.map(a => (
                <div
                  key={a.id}
                  onClick={() => handleSelect(a.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                    border: selected === a.id ? `1px solid ${a.color}55` : '1px solid transparent',
                    background: selected === a.id ? `${a.color}08` : 'transparent',
                    marginBottom: 2, transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: `linear-gradient(135deg, ${a.color}30, ${a.color}08)`,
                    border: `1.5px solid ${a.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <div style={{ width: 16, height: 16, border: `2px solid ${a.color}`, borderRadius: 4, transform: 'rotate(45deg)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: a.color, fontWeight: 600 }}>{a.ticker}</div>
                    <div style={{ fontSize: 10, color: '#4a5a6a', display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
                      AI {a.status}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>${a.price.toFixed(2)}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: a.change >= 0 ? '#00ff88' : '#ff4466' }}>
                      {a.change >= 0 ? '+' : ''}{a.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'JetBrains Mono', monospace", background: '#080818',
    color: '#e0e8f0', height: '100vh', width: '100%',
    display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
  },

  // Header
  header: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 10px', borderBottom: '1px solid rgba(0,240,255,0.1)',
    background: '#0a0a1c', zIndex: 40, flexShrink: 0,
  },
  hBtn: {
    background: 'none', border: '1px solid rgba(0,240,255,0.18)',
    borderRadius: 8, color: '#00f0ff', fontSize: 15, padding: '4px 9px',
    cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
  },
  logo: {
    fontSize: 13, fontWeight: 800, letterSpacing: 4,
    background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginRight: 'auto',
  },
  stats: { display: 'flex', gap: 10 },
  statItem: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
  statV: { fontSize: 11, fontWeight: 700, color: '#fff' },
  statL: { fontSize: 7, letterSpacing: 1.5, color: '#4a5a6a' },

  // Arena
  arenaFull: { flex: 1, position: 'relative' as const, minHeight: 0 },

  // Floating badge
  floatingBadge: {
    position: 'absolute' as const, top: 12, left: 12, zIndex: 10,
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 20,
    background: 'rgba(10,10,28,0.8)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0,240,255,0.12)',
    fontSize: 10, color: '#6a7a8a', fontWeight: 600, letterSpacing: 1,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#00ff88', boxShadow: '0 0 8px #00ff88',
    animation: 'pulse 2s infinite',
  },

  // Ticker
  ticker: {
    position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: 30,
    background: 'rgba(8,8,24,0.9)', borderTop: '1px solid rgba(0,240,255,0.08)',
    display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 5,
  },
  tickerTrack: {
    display: 'flex', gap: 28, animation: 'tickerScroll 20s linear infinite', paddingLeft: '100%',
  },
  tickerItem: {
    display: 'flex', alignItems: 'center', gap: 5, fontSize: 9,
    fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' as const,
  },

  // Pull tab
  pullTab: {
    position: 'absolute' as const, bottom: 34, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4,
    padding: '8px 20px', borderRadius: 16,
    background: 'rgba(10,10,28,0.85)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0,240,255,0.1)', cursor: 'pointer', zIndex: 10,
  },
  pullHandle: {
    width: 32, height: 3, borderRadius: 3, background: 'rgba(0,240,255,0.3)',
  },

  // Sheet
  sheetHandle: {
    display: 'flex', justifyContent: 'center', padding: '10px 0 6px',
    cursor: 'pointer', flexShrink: 0,
  },
  handleBar: {
    width: 36, height: 4, borderRadius: 4, background: 'rgba(0,240,255,0.2)',
  },
  sheetContent: {
    flex: 1, overflowY: 'auto' as const, padding: '4px 16px 80px',
  },

  // Agent card
  agentCard: {
    background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.1)',
    borderRadius: 16, padding: 16,
  },
  btn: {
    flex: 1, padding: '11px 0', border: '1.5px solid', borderRadius: 10,
    background: 'transparent', fontSize: 12, fontWeight: 700,
    fontFamily: 'inherit', cursor: 'pointer', letterSpacing: 1, textAlign: 'center' as const,
  },

  // Activity items
  actItem: {
    padding: '10px 12px', background: 'rgba(0,240,255,0.02)',
    borderRadius: 10, marginBottom: 6, border: '1px solid rgba(0,240,255,0.05)',
  },
  actRow: { display: 'flex', alignItems: 'center', gap: 6 },
  actBadge: {
    fontSize: 8, padding: '2px 7px', borderRadius: 4, fontWeight: 700, letterSpacing: 1,
  },

  // Overlay
  overlay: {
    position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.65)',
    zIndex: 50, animation: 'fadeOverlay 0.2s ease',
  },

  // Drawer
  drawer: {
    position: 'fixed' as const, top: 0, left: 0, bottom: 0,
    width: '85vw', maxWidth: 360, background: '#0a0a1e',
    borderRight: '1px solid rgba(0,240,255,0.12)', zIndex: 51,
    animation: 'slideIn 0.28s cubic-bezier(0.32,0.72,0,1)',
    overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const,
  },
  drawerHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 16px 14px', borderBottom: '1px solid rgba(0,240,255,0.08)', flexShrink: 0,
  },
  drawerX: {
    background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    color: '#5a6a7a', fontSize: 22, padding: '0 10px', cursor: 'pointer', fontFamily: 'inherit',
  },

  // Mini map
  mapWrap: { padding: '12px 14px 8px', borderBottom: '1px solid rgba(0,240,255,0.05)' },
  miniMap: {
    height: 65, borderRadius: 10, background: 'rgba(0,240,255,0.02)',
    border: '1px solid rgba(0,240,255,0.06)', position: 'relative' as const, overflow: 'hidden',
  },
};
