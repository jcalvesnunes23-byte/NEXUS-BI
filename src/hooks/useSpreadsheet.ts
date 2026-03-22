import * as XLSX from 'xlsx';
import { SheetColumn, SheetData, KPI, ChartConfig, InsightCard } from '../types';

// Motor de Higienização (AI Sanitizer Engine)
function inferNumberLocaleAndClean(values: unknown[]): { isNumeric: boolean, values: (number | null)[] } {
  const samples = values.filter(v => v !== null && v !== undefined && v !== '');
  if (samples.length === 0) return { isNumeric: false, values: [] };

  let isBRLFormat = false;
  let isUSFormat = false;

  // 1. Scan heurístico pela amostra para detecção de formato predominante
  for (const s of samples.map(String)) {
    if (s.match(/\d+\.\d{3},\d{2}/)) isBRLFormat = true; // Ex: 1.500,00
    if (s.match(/\d+,\d{3}\.\d{2}/)) isUSFormat = true; // Ex: 1,500.00
  }

  // 2. Limpeza com base no contexto
  const cleanedValues = values.map(v => {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'number') return v;
    
    // Removemos moedas, espaços malucos e acentos
    let s = String(v).replace(/R\$|\$|€|£/g, '').trim();
    if (s === '') return null;
    
    if (isBRLFormat || (!isUSFormat && s.includes(',') && s.split(',').length === 2 && s.split(',')[1].length <= 2)) {
      // Padrão Brasil (1.000,00)
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (isUSFormat) {
      // Padrão EUA (1,000.00)
      s = s.replace(/,/g, '');
    } else {
      // Fallback Engine AI: Resolve ambiguidades sozinho
      s = s.replace(/\s+/g, '');
      if (s.includes(',') && s.includes('.')) {
        const lastComma = s.lastIndexOf(',');
        const lastDot = s.lastIndexOf('.');
        if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.'); // , é decimal
        else s = s.replace(/,/g, ''); // . é decimal
      } else if (s.includes(',')) {
        if (s.match(/,\d{1,2}$/)) s = s.replace(',', '.');
        else s = s.replace(/,/g, '');
      }
    }
    
    const n = Number(s);
    return isNaN(n) ? null : n;
  });

  const validNumbers = cleanedValues.filter(v => v !== null);
  // Se mais de 60% da amostra se transformou num float perfeito, é uma coluna numérica
  const numericRatio = validNumbers.length / samples.length;
  return { isNumeric: numericRatio >= 0.6, values: cleanedValues };
}

function detectColumnType(values: unknown[]): SheetColumn['type'] {
  const sample = values.filter(v => v !== null && v !== undefined && v !== '');
  if (sample.length === 0) return 'text';
  
  const dateCount = sample.filter(v => {
    if (v instanceof Date) return !isNaN(v.getTime());
    const s = String(v).trim();
    if (s.length < 6) return false;
    
    // Tenta formato ISO ou US
    let d = new Date(s);
    if (!isNaN(d.getTime())) return true;
    
    // Fallback: Formato BR DD/MM/YYYY
    const brDateMatch = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
    if (brDateMatch) {
      const day = parseInt(brDateMatch[1], 10);
      const month = parseInt(brDateMatch[2], 10) - 1;
      const year = parseInt(brDateMatch[3], 10);
      d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return true;
    }
    return false;
  }).length;
  
  if (dateCount / sample.length > 0.6) return 'date';
  
  const uniq = new Set(sample.map(String));
  if (uniq.size <= Math.min(30, sample.length * 0.4)) return 'categorical';
  
  return 'text';
}

export function rebuildSheetData(
  rawData: Record<string, unknown>[], 
  fileName: string, 
  sheetNames: string[], 
  activeSheet: string
): SheetData {
  if (rawData.length === 0) {
    return { fileName, sheetNames, activeSheet, columns: [], rowCount: 0, rawData };
  }

  const keys = Object.keys(rawData[0]);
  const columns: SheetColumn[] = keys.map(key => {
    const rawColValues = rawData.map(r => r[key]);
    
    // Injeção da Engine IA
    const { isNumeric, values: cleanedNumbers } = inferNumberLocaleAndClean(rawColValues);
    const type = isNumeric ? 'numeric' : detectColumnType(rawColValues);
    const finalValues = type === 'numeric' ? cleanedNumbers : rawColValues;
    
    if (type === 'numeric') {
       rawData.forEach((r, idx) => r[key] = finalValues[idx]);
    }

    const unique = type === 'categorical' ? [...new Set(finalValues.filter(Boolean).map(String))] : undefined;
    return { name: key, type, values: finalValues as (string | number | null)[], unique };
  });

  return { fileName, sheetNames, activeSheet, columns, rowCount: rawData.length, rawData };
}

export async function readSpreadsheet(file: File, sheetName?: string): Promise<SheetData> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetNames = wb.SheetNames;
  const active = sheetName ?? sheetNames[0];
  const ws = wb.Sheets[active];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: null });

  return rebuildSheetData(raw, file.name, sheetNames, active);
}

export function generateKPIs(data: SheetData): KPI[] {
  const kpis: KPI[] = [];
  const numericCols = data.columns.filter(c => c.type === 'numeric');
  const icons = ['💰','📊','📈','🎯','💎','⚡','🏆','🔢'];

  // Verifica se há contexto de múltiplos MESES para gerar Tendências coerentes.
  // Datas dentro do mesmo mês não constituem uma tendência válida.
  const dateCols = data.columns.filter(c => c.type === 'date');
  let hasValidTimeDomain = false;
  if (dateCols.length > 0) {
    const dates = dateCols[0].values.filter(v => v !== null);
    // Extrai YYYY-MM de cada data para identificar meses distintos
    const uniqueMonths = new Set(
      dates.map(d => {
        const s = String(d);
        // Tenta ISO (2024-03-15) ou detecta data válida
        try {
          const dt = new Date(s);
          if (!isNaN(dt.getTime())) return `${dt.getFullYear()}-${dt.getMonth()}`;
        } catch { /* */ }
        return null;
      }).filter(Boolean)
    );
    // Somente emite tendências se houver dados de 2+ meses diferentes
    hasValidTimeDomain = uniqueMonths.size >= 2;
  }

  // Determina se uma coluna é do tipo "taxa/porcentagem" para usar média
  const isRatioColumn = (col: SheetColumn): boolean => {
    const name = col.name.toLowerCase();
    if (name.includes('%') || name.includes('percent') || name.includes('taxa') ||
        name.includes('eficiência') || name.includes('eficiencia') || name.includes('rendimento') ||
        name.includes('porcentagem') || name.includes('ratio') || name.includes('rate')) return true;
    // Se todos os valores são entre 0 e 1, provavelmente é uma taxa decimal
    const nums = col.values.filter(v => typeof v === 'number') as number[];
    if (nums.length > 2 && nums.every(n => n >= 0 && n <= 1)) return true;
    return false;
  };

  // Ordena por volume (soma) — exceto colunas de taxa que usam média
  const colStats = numericCols.map(col => {
    const nums = col.values.filter(v => v !== null && typeof v === 'number') as number[];
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = nums.length > 0 ? sum / nums.length : 0;
    const isRatio = isRatioColumn(col);
    return { col, nums, sum, avg, isRatio };
  }).filter(s => s.nums.length > 0).sort((a, b) => {
    // Colunas de taxa vão para o fim do ranking
    if (a.isRatio && !b.isRatio) return 1;
    if (!a.isRatio && b.isRatio) return -1;
    return b.sum - a.sum;
  });

  colStats.slice(0, 8).forEach(({ col, nums, sum, avg, isRatio }, i) => {
    // Para colunas de porcentagem/taxa, usa MÉDIA. Para volume, usa SOMA.
    const displayValue = isRatio ? avg : sum;
    
    const formatVal = (n: number, pct: boolean) => {
      if (pct) {
        // Se os valores são decimais (0.68), converte para %
        const pctVal = n <= 1 ? n * 100 : n;
        return pctVal.toFixed(1) + '%';
      }
      if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
      if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
      return n.toFixed(n % 1 === 0 ? 0 : 2);
    };

    let trend = 0;
    let trendUp = false;
    let showTrend = false;

    if (hasValidTimeDomain) {
      const mid = Math.floor(nums.length / 2);
      const firstHalf = nums.slice(0, mid).reduce((a, b) => a + b, 0) / (mid || 1);
      const secondHalf = nums.slice(mid).reduce((a, b) => a + b, 0) / (nums.length - mid || 1);
      trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
      trendUp = trend >= 0;
      showTrend = true;
    }

    const labelPrefix = isRatio ? 'Média — ' : '';
    kpis.push({
      id: `kpi-${i}`,
      label: labelPrefix + col.name,
      value: formatVal(displayValue, isRatio),
      rawValue: displayValue,
      trend: showTrend ? Math.abs(trend) : undefined,
      trendUp: showTrend ? trendUp : undefined,
      icon: isRatio ? '📊' : icons[i % icons.length],
      column: col.name,
    });

    // Para a métrica principal de volume, adiciona KPI de média secundária
    if (i === 0 && !isRatio) {
      const avgVal = avg;
      kpis.push({
        id: `kpi-avg-${i}`,
        label: `Média — ${col.name}`,
        value: formatVal(avgVal, false),
        rawValue: avgVal,
        icon: '📊',
        column: col.name,
      });
    }
  });

  return kpis;
}


export function generateCharts(data: SheetData): ChartConfig[] {
  const charts: ChartConfig[] = [];
  const getNumScore = (col: SheetColumn) => (col.values.filter(v => typeof v === 'number') as number[]).reduce((a, b) => a + Math.abs(b), 0);
  const numericCols = data.columns.filter(c => c.type === 'numeric').sort((a, b) => getNumScore(b) - getNumScore(a));
  const categoricalCols = data.columns.filter(c => c.type === 'categorical');
  const dateCols = data.columns.filter(c => c.type === 'date');
  const MAX_LABELS = 12;
  let chartId = 0;

  const groupByCategory = (catCol: SheetColumn, numCol: SheetColumn, aggregation: 'sum' | 'avg' = 'sum') => {
    const grouped: Record<string, { sum: number; count: number }> = {};

    data.rawData.forEach(row => {
      const key = String(row[catCol.name] ?? 'N/A');
      const val = Number(row[numCol.name] ?? 0);
      if (!isNaN(val)) {
        if (!grouped[key]) grouped[key] = { sum: 0, count: 0 };
        grouped[key].sum += val;
        grouped[key].count++;
      }
    });
    return Object.entries(grouped)
      .map(([label, { sum, count }]) => ({ label, value: aggregation === 'avg' ? sum / count : sum }))
      .filter(e => !isNaN(e.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_LABELS);
  };

  // 1. Gráfico de barras de ranking por categoria (principal métrica)
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    const catCol = categoricalCols[0];
    const numCol = numericCols[0];
    const entries = groupByCategory(catCol, numCol, 'sum');
    if (entries.length > 0) {
      chartId++;
      const total = entries.reduce((a, e) => a + e.value, 0);
      charts.push({
        id: `chart-ranking-${chartId}`,
        type: 'bar',
        title: `Ranking: ${numCol.name} por ${catCol.name}`,
        xColumn: catCol.name, yColumn: numCol.name,
        data: entries,
        description: `Total: ${entries.reduce((a, e) => a + e.value, 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} · ${entries.length} categorias · Barras coloridas indicam acima/abaixo da média`,
      });

      // 2. Donut de participação proporcional (mesmos dados)
      chartId++;
      charts.push({
        id: `chart-donut-${chartId}`,
        type: 'donut',
        title: `Participação % de ${catCol.name} em ${numCol.name}`,
        xColumn: catCol.name, yColumn: numCol.name,
        data: entries.slice(0, 7),
        description: `Distribuição proporcional — top ${Math.min(entries.length, 7)} de ${entries.length} categorias representam o volume total`,
      });
    }

    // 3. Gráfico de média por categoria (desempenho eficiente)
    if (entries.length > 1) {
      const avgEntries = groupByCategory(catCol, numCol, 'avg');
      chartId++;
      charts.push({
        id: `chart-avg-${chartId}`,
        type: 'bar',
        title: `Média de ${numCol.name} por ${catCol.name}`,
        xColumn: catCol.name, yColumn: numCol.name,
        data: avgEntries,
        description: `Eficiência por categoria — valores mostram a média por registro, não o total acumulado`,
      });
    }
  }

  // 4. Comparação entre 2 categorias distintas (se houver)
  if (categoricalCols.length > 1 && numericCols.length > 0) {
    const catCol = categoricalCols[1];
    const numCol = numericCols[0];
    const entries = groupByCategory(catCol, numCol, 'sum');
    if (entries.length > 1) {
      chartId++;
      charts.push({
        id: `chart-comp-${chartId}`,
        type: 'bar',
        title: `${numCol.name} por ${catCol.name}`,
        xColumn: catCol.name, yColumn: numCol.name,
        data: entries,
        description: `Comparativo entre categorias de "${catCol.name}" — ideal para identificar gargalos e líderes de performance`,
      });
    }
  }

  // 5. Segunda métrica numérica importante (volume separado)
  if (categoricalCols.length > 0 && numericCols.length > 1) {
    const catCol = categoricalCols[0];
    const numCol = numericCols[1];
    const entries = groupByCategory(catCol, numCol, 'sum');
    if (entries.length > 0) {
      chartId++;
      charts.push({
        id: `chart-second-${chartId}`,
        type: 'bar',
        title: `${numCol.name} por ${catCol.name}`,
        xColumn: catCol.name, yColumn: numCol.name,
        data: entries,
        description: `Análise complementar de ${numCol.name} segmentado por ${catCol.name}`,
      });
    }
  }

  // 6–7. Séries temporais
  dateCols.slice(0, 1).forEach(dateCol => {
    numericCols.slice(0, 2).forEach(numCol => {
      const grouped: Record<string, number> = {};
      data.rawData.forEach(row => {
        const d = row[dateCol.name];
        if (!d) return;
        try {
          const dt = new Date(String(d));
          if (isNaN(dt.getTime())) return;
          const key = dt.toISOString().slice(0, 10);
          grouped[key] = (grouped[key] ?? 0) + Number(row[numCol.name] ?? 0);
        } catch { return; }
      });
      const entries = Object.entries(grouped)
        .filter(([, v]) => !isNaN(v))
        .sort((a, b) => a[0].localeCompare(b[0]));
      if (entries.length > 1) {
        chartId++;
        charts.push({
          id: `chart-time-${chartId}`,
          type: 'line',
          title: `Evolução: ${numCol.name} ao longo do tempo`,
          xColumn: dateCol.name, yColumn: numCol.name,
          data: entries.map(([label, value]) => ({ label, value })),
          description: `Série temporal de ${entries.length} períodos · Passe o mouse para ver variação vs período anterior`,
        });
      }
    });
  });

  return charts.slice(0, 8);
}


export function generateLocalInsights(data: SheetData, kpis: KPI[]): InsightCard[] {
  const insights: InsightCard[] = [];
  const numericCols = data.columns.filter(c => c.type === 'numeric');
  const categoricalCols = data.columns.filter(c => c.type === 'categorical');

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toFixed(n % 1 === 0 ? 0 : 2);
  };

  // --- Insight 1: KPI principal + leitura gerencial ---
  if (kpis.length > 0) {
    const k = kpis[0];
    const numCol = numericCols.find(c => c.name === k.column);
    const nums = numCol ? (numCol.values.filter(v => typeof v === 'number') as number[]) : [];
    const avg = nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    const deviation = avg > 0 ? ((max - avg) / avg) * 100 : 0;

    insights.push({
      id: 'ins-1', number: 1, type: 'highlight',
      title: `Visão Estratégica — ${k.label}`,
      text: `O total acumulado é ${k.value}, com média por registro de ${fmt(avg)}. O pico máximo registrado atinge ${fmt(max)}, ${deviation.toFixed(0)}% acima da média — indicando forte concentração pontual.`,
      action: `Analise quais registros geram os picos e se representam padrão recorrente ou exceção.`,
    });
  }

  // --- Insight 2: Concentração de Pareto (80/20) ---
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    const catCol = categoricalCols[0];
    const numCol = numericCols[0];
    const grouped: Record<string, number> = {};
    data.rawData.forEach(row => {
      const key = String(row[catCol.name] ?? 'N/A');
      grouped[key] = (grouped[key] ?? 0) + Number(row[numCol.name] ?? 0);
    });
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((a, [,v]) => a + v, 0);

    if (sorted.length > 0 && total > 0) {
      // Calcula quantas categorias representam 80% do total
      let accumulated = 0;
      let paretoCount = 0;
      for (const [, v] of sorted) {
        accumulated += v;
        paretoCount++;
        if (accumulated / total >= 0.8) break;
      }
      const topPct = ((sorted[0][1] / total) * 100).toFixed(1);
      const paretoMsg = paretoCount <= Math.ceil(sorted.length * 0.3)
        ? `Atenção ao Princípio de Pareto: apenas ${paretoCount} de ${sorted.length} categorias respondem por 80% do volume total.`
        : `A distribuição é relativamente equilibrada entre as ${sorted.length} categorias.`;

      insights.push({
        id: 'ins-2', number: 2, type: paretoCount <= Math.ceil(sorted.length * 0.3) ? 'alert' : 'trend',
        title: `Concentração em ${catCol.name}`,
        text: `"${sorted[0][0]}" domina com ${topPct}% do volume de ${numCol.name} (${fmt(sorted[0][1])}). ${paretoMsg}`,
        action: `Reduza dependência de poucos itens. Avalie se a concentração é risco ou vantagem competitiva.`,
      });
    }

    // --- Insight 3: Item de menor desempenho (oportunidade de melhoria) ---
    if (sorted.length > 1) {
      const [lastName, lastVal] = sorted[sorted.length - 1];
      const avgCat = total / sorted.length;
      const gapPct = avgCat > 0 ? ((avgCat - lastVal) / avgCat) * 100 : 0;
      insights.push({
        id: 'ins-3', number: 3, type: 'suggestion',
        title: `Oportunidade em "${lastName}"`,
        text: `"${lastName}" registra ${fmt(lastVal)} em ${numCol.name}, ${gapPct.toFixed(0)}% abaixo da média das categorias (${fmt(avgCat)}). Há espaço real de melhoria.`,
        action: `Investigue gargalos operacionais ou de demanda para "${lastName}" e implante plano de ação específico.`,
      });
    }
  }

  // --- Insight 4: Qualidade dos dados com impacto estimado ---
  const totalCells = data.rowCount * data.columns.length;
  const nullCells = data.columns.reduce((acc, col) => acc + col.values.filter(v => v === null || v === '').length, 0);
  const fillRate = totalCells > 0 ? ((totalCells - nullCells) / totalCells) * 100 : 100;
  insights.push({
    id: 'ins-4', number: 4, type: fillRate < 90 ? 'alert' : 'highlight',
    title: fillRate < 90 ? '⚠️ Qualidade de Dados Comprometida' : '✅ Integridade dos Dados',
    text: fillRate < 90
      ? `${nullCells} campos vazios detectados (${(100 - fillRate).toFixed(1)}% das células). Isso pode distorcer KPIs, médias e gráficos de análise.`
      : `${fillRate.toFixed(1)}% de preenchimento — base de dados íntegra com ${data.rowCount.toLocaleString('pt-BR')} registros e ${data.columns.length} colunas.`,
    action: fillRate < 90
      ? 'Priorize o preenchimento dos campos críticos antes de tomar decisões baseadas nestes dados.'
      : 'Dados confiáveis. Compartilhe este dashboard com sua equipe para decisões orientadas por evidência.',
  });

  // --- Insight 5: Eficiência / spread dos dados ---
  if (numericCols.length > 1) {
    const col = numericCols[1];
    const nums = col.values.filter(v => typeof v === 'number') as number[];
    if (nums.length > 1) {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance = nums.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / nums.length;
      const stdDev = Math.sqrt(variance);
      const cv = avg !== 0 ? (stdDev / Math.abs(avg)) * 100 : 0; // Coeficiente de Variação
      const stability = cv < 20 ? 'Alta Estabilidade' : cv < 50 ? 'Variabilidade Moderada' : 'Alta Dispersão';
      insights.push({
        id: 'ins-5', number: 5, type: cv > 50 ? 'alert' : 'suggestion',
        title: `${stability} em ${col.name}`,
        text: `O Coeficiente de Variação de ${col.name} é ${cv.toFixed(1)}% — ${cv < 20 ? 'resultados consistentes, processo previsível e bem-controlado.' : cv < 50 ? 'variações moderadas; investigue causas pontuais.' : 'alta instabilidade; processos ou demanda muito irregulares.'}`,
        action: cv > 30 ? `Padronize processos associados a "${col.name}" para reduzir volatilidade e tornar o desempenho mais previsível.` : `Mantenha as práticas atuais que garantem consistência em "${col.name}".`,
      });
    }
  }

  return insights;
}
