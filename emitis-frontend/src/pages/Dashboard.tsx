// ==========================================
// Emitis — Dashboard Page (dados reais)
// ==========================================
import { useEffect, useState } from 'react';
import { Users, FileText, Clock, TrendingUp, PackageOpen } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { notasFiscaisService } from '../services/notasFiscais';
import { clientesService } from '../services/clientes';
import { useAuth } from '../hooks/useAuth';
import type { ChartData, NotaFiscal } from '../types';

interface KPIs {
  totalClientes: number;
  totalNFs: number;
  emitidas: number;
  pendentes: number;
  canceladas: number;
  receita: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const STATUS_LABEL: Record<string, string> = {
  emitida: 'Emitida',
  pendente: 'Pendente',
  cancelada: 'Cancelada',
};

const STATUS_ICON: Record<string, string> = {
  emitida: '✅',
  pendente: '⏳',
  cancelada: '❌',
};

const STATUS_COLOR: Record<string, string> = {
  emitida: 'var(--clr-success-bg)',
  pendente: 'var(--clr-warning-bg)',
  cancelada: 'var(--clr-danger-bg)',
};

export function DashboardPage() {
  const { tenant } = useAuth();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [chart, setChart] = useState<ChartData[]>([]);
  const [recent, setRecent] = useState<NotaFiscal[]>([]);
  const [activeChart, setActiveChart] = useState<'area' | 'bar'>('area');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [clientes, nfKpis, chartData, recentNFs] = await Promise.all([
        clientesService.getAll(),
        Promise.resolve(notasFiscaisService.getKPIs()),
        Promise.resolve(notasFiscaisService.getChartData()),
        Promise.resolve(notasFiscaisService.getRecent(5)),
      ]);
      setKpis({
        totalClientes: clientes.length,
        totalNFs: nfKpis.total,
        emitidas: nfKpis.emitidas,
        pendentes: nfKpis.pendentes,
        canceladas: nfKpis.canceladas,
        receita: nfKpis.receita,
      });
      setChart(chartData);
      setRecent(recentNFs);
      setLoading(false);
    }
    load();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)',
        borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem',
      }}>
        <div style={{ color: 'var(--clr-text-muted)', marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
            {p.dataKey === 'valor' ? fmt(p.value) : `${p.value} NF${p.value !== 1 ? 's' : ''}`}
          </div>
        ))}
      </div>
    );
  };

  const hora = new Date().getHours();
  const greeting = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = tenant?.nome_empresa?.split(' ')[0] || '';

  const emptyState = (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '3rem 1rem',
      color: 'var(--clr-text-muted)', gap: '0.75rem',
    }}>
      <PackageOpen size={36} strokeWidth={1.5} style={{ opacity: 0.4 }} />
      <p style={{ fontSize: '0.875rem' }}>Nenhum dado ainda</p>
    </div>
  );

  const hasData = kpis && kpis.totalNFs > 0;
  const chartHasData = chart.some((d) => d.emitidas > 0);

  return (
    <div className="animate-slideup">
      {/* Greeting */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}{primeiroNome ? ', ' : ''}<span className="gradient-text">{primeiroNome}</span>
          </h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-indigo"><Users size={22} /></div>
          <div className="kpi-label">Total de Clientes</div>
          <div className="kpi-value">{loading ? '—' : (kpis?.totalClientes ?? 0)}</div>
          {kpis?.totalClientes === 0 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
              Nenhum cliente cadastrado
            </div>
          )}
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-cyan"><FileText size={22} /></div>
          <div className="kpi-label">Notas Emitidas</div>
          <div className="kpi-value">{loading ? '—' : (kpis?.emitidas ?? 0)}</div>
          {kpis?.emitidas === 0 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
              Nenhuma nota emitida
            </div>
          )}
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-amber"><Clock size={22} /></div>
          <div className="kpi-label">NFs Pendentes</div>
          <div className="kpi-value">{loading ? '—' : (kpis?.pendentes ?? 0)}</div>
          {kpis?.pendentes === 0 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
              Nenhuma nota pendente
            </div>
          )}
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-green"><TrendingUp size={22} /></div>
          <div className="kpi-label">Receita Total</div>
          <div className="kpi-value" style={{ fontSize: kpis?.receita ? '1.35rem' : '1.75rem' }}>
            {loading ? '—' : fmt(kpis?.receita ?? 0)}
          </div>
          {kpis?.receita === 0 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
              Referente a NFs emitidas
            </div>
          )}
        </div>
      </div>

      {/* Charts + Recent */}
      <div className="dashboard-grid">
        {/* Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">Notas Fiscais por Mês</div>
              <div className="chart-subtitle">Últimos 6 meses</div>
            </div>
            {chartHasData && (
              <div className="filter-tabs">
                <button
                  className={`filter-tab${activeChart === 'area' ? ' active' : ''}`}
                  onClick={() => setActiveChart('area')}
                  id="chart-area-tab"
                >
                  Área
                </button>
                <button
                  className={`filter-tab${activeChart === 'bar' ? ' active' : ''}`}
                  onClick={() => setActiveChart('bar')}
                  id="chart-bar-tab"
                >
                  Barras
                </button>
              </div>
            )}
          </div>

          {!chartHasData ? emptyState : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                {activeChart === 'area' ? (
                  <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradNF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                    <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="emitidas" stroke="#6366f1" strokeWidth={2} fill="url(#gradNF)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                ) : (
                  <BarChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                    <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="emitidas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>

              <div className="chart-legend" style={{ marginTop: 12 }}>
                <div className="chart-legend-item">
                  <div className="chart-legend-dot" style={{ background: '#6366f1' }} />
                  Notas emitidas / pendentes
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="chart-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-header">
            <div>
              <div className="chart-title">Últimas Notas Fiscais</div>
              <div className="chart-subtitle">Movimentações recentes</div>
            </div>
          </div>

          {recent.length === 0 ? emptyState : (
            <div className="recent-list" style={{ flex: 1 }}>
              {recent.map((nf) => (
                <div key={nf.id} className="recent-item">
                  <div className="recent-item-left">
                    <div
                      className="recent-item-icon"
                      style={{ background: STATUS_COLOR[nf.status], fontSize: '1rem' }}
                    >
                      {STATUS_ICON[nf.status]}
                    </div>
                    <div>
                      <div className="recent-item-name">{nf.numero}</div>
                      <div className="recent-item-date">{nf.cliente_nome} · {STATUS_LABEL[nf.status]}</div>
                    </div>
                  </div>
                  <div className="recent-item-value">{fmt(nf.valor)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Summary */}
      {hasData && (
        <div style={{ marginTop: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Distribuição por Status</h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Emitidas', count: kpis.emitidas, color: 'var(--clr-success)' },
                { label: 'Pendentes', count: kpis.pendentes, color: 'var(--clr-warning)' },
                { label: 'Canceladas', count: kpis.canceladas, color: 'var(--clr-danger)' },
              ].map((s) => {
                const pct = kpis.totalNFs > 0 ? Math.round((s.count / kpis.totalNFs) * 100) : 0;
                return (
                  <div key={s.label} style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--clr-text-secondary)' }}>{s.label}</span>
                      <span style={{ fontWeight: 700 }}>
                        {s.count}{' '}
                        <span style={{ color: 'var(--clr-text-muted)', fontWeight: 400 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--clr-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: s.color, borderRadius: 3,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
