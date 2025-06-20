import React, { useState, useEffect, useRef } from 'react';

// --- 初期データ ---
// データ構造を更新し、actionPlanを追加しました。
const initialData = [
  {
    id: 'company',
    level: '会社',
    name: '第37期 全社目標',
    children: [
      {
        id: 'bu-video',
        level: '事業',
        name: '映像事業',
        objectives: [
          { id: 'obj-v1', goal: '高品質な映像コンテンツで市場をリードする', kgi: 'コンテンツ売上30億円達成', ksf: '独自コンテンツの制作力強化と配信チャネルの多角化', kpi: '年間制作本数50本 / 新規プラットフォームとの契約数5件', status: '進行中', progress: 70, comment: '主要な配信プラットフォームとの契約は完了。独自コンテンツの制作がやや遅延しているが、年内には目標達成の見込み。', actionPlan: '1. Q3中に新規コンテンツ企画を5本立案\n2. Q4開始までに主要クリエイターのスケジュールを確保\n3. 海外配信プラットフォームとの交渉を開始' },
        ],
        children: [
          { id: 'dept-prod', level: '部署', name: '制作部', objectives: [{ id: 'obj-p1', goal: '魅力的な映像を制作する', kgi: '視聴率平均10%', ksf: 'クリエイターの育成', kpi: '新人監督作品の公開数 3本/年', status: '進行中', progress: 50, comment: '新人監督2名の作品が制作中。1名はスケジュール通り。', actionPlan: '' }], children: [{id: 'person-a1', level: '個人', name: '鈴木 一郎', objectives: [{id: 'obj-s1', goal: '担当番組の品質向上', kgi: '担当番組の評価スコア4.5/5.0', ksf: '最新編集技術の習得', kpi: '月間トレーニング時間10時間', status: '完了', progress: 100, comment: '全ての目標を達成済み。', actionPlan: ''}], children: []}] },
          { id: 'dept-ops', level: '部署', name: '業務部', objectives: [{ id: 'obj-o1', goal: '制作プロセスの効率化', kgi: '制作コスト10%削減', ksf: 'ワークフローの見直し', kpi: '1案件あたりの平均制作期間を5日短縮', status: '課題あり', progress: 30, comment: '新しいワークフロー管理ツールの導入に手間取っており、一部のチームで反発があるため、説明会を再度実施予定。', actionPlan: '' }], children: [{id: 'person-a2', level: '個人', name: '高橋 二郎', objectives: [{id: 'obj-t1', goal: 'スケジュール管理の徹底', kgi: '遅延発生率5%未満', ksf: '関係各所との密な連携', kpi: '週次定例での進捗確認率100%', status: '未着手', progress: 0, comment: '', actionPlan: ''}], children: []}] },
        ],
      },
       { id: 'dept-ga', level: '部署', name: '総務部', objectives: [{ id: 'obj-ga1', goal: '全社の生産性を高める職場環境の提供', kgi: '従業員満足度調査のスコア80点以上', ksf: '福利厚生の充実とオフィス環境の改善', kpi: '新しい福利厚生制度の導入 年2件', status: '進行中', progress: 80, comment: '新しい福利厚生を1件導入済み。オフィス環境改善のためのアンケートを実施中。', actionPlan: '' }], children: [{id: 'person-d1', level: '個人', name: '渡辺 六郎', objectives: [{id: 'obj-w1', goal: '備品管理の効率化', kgi: '備品発注のリードタイム1日短縮', ksf: '管理システムの導入', kpi: 'システム入力率100%', status: '完了', progress: 100, comment: 'システム導入完了。', actionPlan: ''}], children: []}] },
       { id: 'dept-acct', level: '部署', name: '経理部', objectives: [{ id: 'obj-ac1', goal: '迅速かつ正確な財務報告', kgi: '月次決算の5営業日以内での完了', ksf: '会計プロセスの自動化', kpi: '手作業による仕訳入力の80%削減', status: '進行中', progress: 60, comment: '', actionPlan: '' }], children: [{id: 'person-d2', level: '個人', name: '山本 七郎', objectives: [{id: 'obj-y1', goal: '請求書処理の迅速化', kgi: '請求書処理の平均時間を30%削減', ksf: 'OCRツールの活用', kpi: 'ツールの読取精度98%', status: '進行中', progress: 90, comment: 'OCRツールの精度が目標に到達。', actionPlan: ''}], children: []}] },
    ],
    objectives: [
        { id: 'obj-c1', goal: '持続可能な成長と社会貢献の両立', kgi: '5年間で企業価値を2倍にし、ESG評価でAランクを獲得する', ksf: '中核事業の強化と新規事業の創出、及び全社的なDX推進', kpi: '年間売上成長率15% / 新規事業売上比率20% / DX投資効果(ROI)30%', status: '進行中', progress: 40, comment: '全社DXの進捗は計画通り。新規事業の立ち上げにやや遅れあり。', actionPlan: '' },
    ],
  },
];

// --- ユーティリティ関数 ---
const treeUtils = {
  updateNode: (nodes, nodeId, updater) => nodes.map(node => (node.id === nodeId) ? updater(node) : (node.children ? { ...node, children: treeUtils.updateNode(node.children, nodeId, updater) } : node)),
  deleteNode: (nodes, nodeId) => nodes.filter(node => node.id !== nodeId).map(node => ({ ...node, children: node.children ? treeUtils.deleteNode(node.children, nodeId) : [] })),
  addNode: (nodes, parentId, newNode) => nodes.map(node => (node.id === parentId) ? { ...node, children: [...(node.children || []), newNode] } : (node.children ? { ...node, children: treeUtils.addNode(node.children, parentId, newNode) } : node)),
};

// --- アイコンコンポーネント ---
const ChevronIcon = ({ isExpanded }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"></polyline></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);

// --- UIコンポーネント ---
const StatusBadge = ({ status }) => {
  const statusStyles = { '未着手': 'bg-gray-200 text-gray-800', '進行中': 'bg-blue-200 text-blue-800', '完了': 'bg-green-200 text-green-800', '課題あり': 'bg-red-200 text-red-800' };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>{status}</span>;
};

const ObjectiveCard = ({ objective, onEdit, onDelete }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
    <div className="flex justify-between items-start mb-3">
      <StatusBadge status={objective.status} />
      <div className="flex space-x-2"><button onClick={onEdit} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"><EditIcon /></button><button onClick={onDelete} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon /></button></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><div className="text-sm font-bold text-red-500">A: 目標 (Goal)</div><p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{objective.goal}</p></div>
      <div><div className="text-sm font-bold text-orange-500">B: 数値目標 (KGI)</div><p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{objective.kgi}</p></div>
      <div><div className="text-sm font-bold text-indigo-500">C: 重要成功要因 (KSF)</div><p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{objective.ksf}</p></div>
      <div><div className="text-sm font-bold text-teal-500">D: 重要業績評価指標 (KPI)</div><p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">{objective.kpi}</p></div>
    </div>
    <div className="mt-4">
        <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-gray-700 dark:text-gray-300">進捗率</span><span className="text-sm font-bold text-gray-900 dark:text-white">{objective.progress || 0}%</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${objective.progress || 0}%` }}></div></div>
    </div>
    {objective.comment && (<div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"><p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{objective.comment}</p></div>)}
    {objective.actionPlan && (<div className="mt-4"><div className="text-sm font-bold text-purple-500 mb-2">アクションプラン</div><div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"><p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{objective.actionPlan}</p></div></div>)}
  </div>
);

const EditObjectiveModal = ({ isOpen, onClose, onSave, objective, nodeId }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { 
        setFormData(objective || { goal: '', kgi: '', ksf: '', kpi: '', status: '未着手', progress: 0, comment: '', actionPlan: '' }); 
    }, [objective]);

    if (!isOpen) return null;

    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSave = () => { onSave(nodeId, formData); onClose(); };

    // Gemini API 呼び出し関数
    const callGeminiAPI = async (prompt) => {
        setIsLoading(true);
        setError('');
        try {
            const apiKey = ""; // APIキーは不要
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                throw new Error("AIからの応答が予期した形式ではありません。");
            }
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // アクションプラン生成
    const handleGenerateActionPlan = async () => {
        if (!formData.goal) {
            setError('アクションプランを生成するには、「目標(Goal)」を入力してください。');
            return;
        }
        const prompt = `以下の目標を達成するための、具体的なステップからなるアクションプランを日本語で3〜5個提案してください。箇条書きで記述してください。\n\n---\n目標(Goal): ${formData.goal}\n数値目標(KGI): ${formData.kgi || '未設定'}\n重要成功要因(KSF): ${formData.ksf || '未設定'}\n重要業績評価指標(KPI): ${formData.kpi || '未設定'}\n---`;
        const generatedText = await callGeminiAPI(prompt);
        if (generatedText) {
            setFormData(prev => ({ ...prev, actionPlan: generatedText }));
        }
    };
    
    // KSF/KPIのアイデア出し
    const handleGenerateIdeas = async () => {
        if (!formData.goal) {
            setError('アイデアを提案するには、「目標(Goal)」を入力してください。');
            return;
        }
        const prompt = `以下の「目標(Goal)」に基づいて、それを達成するための「重要成功要因(KSF)」と、進捗を測るための「重要業績評価指標(KPI)」のアイデアを、それぞれ3つずつ日本語で提案してください。それぞれの項目を箇条書きで記述し、KSFとKPIの間に明確な区切りを入れてください。\n\n---\n目標(Goal): ${formData.goal}\n---`;
        const generatedText = await callGeminiAPI(prompt);
        if (generatedText) {
            const ksfMatch = generatedText.match(/KSF:?\s*([\s\S]*?)KPI:?/i);
            const kpiMatch = generatedText.match(/KPI:?\s*([\s\S]*)/i);
            const suggestedKSF = ksfMatch ? ksfMatch[1].trim() : generatedText;
            const suggestedKPI = kpiMatch ? kpiMatch[1].trim() : '';

            setFormData(prev => ({ 
                ...prev, 
                ksf: prev.ksf ? `${prev.ksf}\n\n--- AIによる提案 ---\n${suggestedKSF}` : suggestedKSF,
                kpi: prev.kpi ? `${prev.kpi}\n\n--- AIによる提案 ---\n${suggestedKPI}` : suggestedKPI
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{objective ? '目標の編集' : '新しい目標の追加'}</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">A: 目標 (Goal)</label><textarea name="goal" value={formData.goal || ''} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                    <div className="text-right"><button onClick={handleGenerateIdeas} disabled={isLoading} className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 disabled:opacity-50 disabled:cursor-wait">✨ KSF/KPIのアイデア出し</button></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">C: 重要成功要因 (KSF)</label><textarea name="ksf" value={formData.ksf || ''} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">B: 数値目標 (KGI)</label><textarea name="kgi" value={formData.kgi || ''} onChange={handleChange} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">D: 重要業績評価指標 (KPI)</label><textarea name="kpi" value={formData.kpi || ''} onChange={handleChange} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">アクションプラン</label><button onClick={handleGenerateActionPlan} disabled={isLoading} className="ml-4 text-sm px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-wait">✨ アクションプランを自動生成</button><textarea name="actionPlan" value={formData.actionPlan || ''} onChange={handleChange} rows="4" className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">進捗状況</label><select name="status" value={formData.status || '未着手'} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option>未着手</option><option>進行中</option><option>完了</option><option>課題あり</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">進捗率 ({formData.progress || 0}%)</label><input type="range" name="progress" min="0" max="100" value={formData.progress || 0} onChange={handleChange} className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">コメント</label><textarea name="comment" value={formData.comment || ''} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                </div>
                <div className="mt-6 flex justify-end space-x-3"><button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">キャンセル</button><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={isLoading}>保存</button></div>
            </div>
        </div>
    );
};

const TreeNode = (props) => {
  const { node, expandedNodes, onToggleNode, onNodeUpdate, onNodeDelete, onNodeAdd } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(node.name);
  const inputRef = useRef(null);
  useEffect(() => { if (isEditing) inputRef.current?.focus(); }, [isEditing]);

  const handleSaveName = () => { if (name.trim()) onNodeUpdate(node.id, n => ({ ...n, name })); else setName(node.name); setIsEditing(false); };
  
  const isExpanded = expandedNodes.has(node.id);
  const levelColorMap = { '会社': 'text-purple-500', '事業': 'text-blue-500', '部署': 'text-green-500', 'チーム': 'text-yellow-500', '個人': 'text-pink-500' };

  return (
    <div className="relative pl-6 group">
      <div className="absolute left-3 top-0 h-full border-l-2 border-gray-300 dark:border-gray-600"></div>
      <div className="relative">
        <div className="absolute -left-3 top-9 h-px w-3 border-t-2 border-gray-300 dark:border-gray-600"></div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg my-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center p-4">
            <div className="cursor-pointer" onClick={() => onToggleNode(node.id)}><ChevronIcon isExpanded={isExpanded} /></div>
            <div className="ml-2 flex-grow">
              <span className={`font-bold ${levelColorMap[node.level] || 'text-gray-500'}`}>{node.level}</span>
              {isEditing ? <input ref={inputRef} type="text" value={name} onChange={e => setName(e.target.value)} onBlur={handleSaveName} onKeyDown={e => e.key === 'Enter' && handleSaveName()} className="text-lg font-semibold bg-gray-200 dark:bg-gray-700 p-1 rounded-md w-full"/> : <h3 className="text-lg font-semibold text-gray-900 dark:text-white" onDoubleClick={() => setIsEditing(true)}>{node.name}</h3>}
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onNodeAdd(node.id)} title="子ノードを追加" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><PlusIcon /></button>
              <button onClick={() => setIsEditing(true)} title="名前を編集" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><EditIcon /></button>
              {node.id !== 'company' && <button onClick={() => onNodeDelete(node.id)} title="ノードを削除" className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon /></button>}
            </div>
          </div>
          {isExpanded && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {node.objectives?.map(obj => <ObjectiveCard key={obj.id} objective={obj} onEdit={() => onNodeUpdate(node.id, n => n, obj)} onDelete={() => onNodeUpdate(node.id, n => ({ ...n, objectives: n.objectives.filter(o => o.id !== obj.id) }))}/>)}
              <button onClick={() => onNodeUpdate(node.id, n => n, null)} className="w-full mt-2 py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">新しい目標を追加...</button>
            </div>
          )}
        </div>
      </div>
      {isExpanded && node.children?.map(child => (<div className="pl-4" key={child.id}><TreeNode {...props} node={child} /></div>))}
    </div>
  );
};


// --- メインコンポーネント ---
export default function App() {
  const [treeData, setTreeData] = useState(initialData);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['company']));
  const [modalState, setModalState] = useState({ isOpen: false, objective: null, nodeId: null });

  const handleNodeUpdate = (nodeId, updater, objectiveToEdit = undefined) => { if (objectiveToEdit !== undefined) setModalState({ isOpen: true, objective: objectiveToEdit, nodeId }); else setTreeData(prev => treeUtils.updateNode(prev, nodeId, updater)); };
  const handleSaveObjective = (nodeId, objectiveData) => { const updater = node => { const objectives = node.objectives || []; if (objectiveData.id) return { ...node, objectives: objectives.map(o => o.id === objectiveData.id ? objectiveData : o) }; else return { ...node, objectives: [...objectives, { ...objectiveData, id: crypto.randomUUID() }] }; }; setTreeData(prev => treeUtils.updateNode(prev, nodeId, updater)); };
  const handleDeleteNode = (nodeId) => { if (window.confirm("このノードとすべての子ノードを削除しますか？")) setTreeData(prev => treeUtils.deleteNode(prev, nodeId)); };
  const handleAddNode = (parentId) => { const level = prompt("新しいノードの階層を入力 (例: 部署, 個人)"); const name = prompt("新しいノードの名前を入力"); if (name && level) { const newNode = { id: crypto.randomUUID(), level, name, objectives: [], children: [] }; setTreeData(prev => treeUtils.addNode(prev, parentId, newNode)); setExpandedNodes(prev => new Set(prev).add(parentId)); } };
  const handleToggleNode = (nodeId) => setExpandedNodes(prev => { const s = new Set(prev); s.has(nodeId) ? s.delete(nodeId) : s.add(nodeId); return s; });
  const handleExpandAll = () => { const s = new Set(); const expand = (nodes) => { for(const n of nodes) { s.add(n.id); if(n.children) expand(n.children); }}; expand(treeData); setExpandedNodes(s); };
  const handleCollapseAll = () => setExpandedNodes(new Set());

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8"><h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">階層的目標設定ツリー</h1><p className="text-gray-600 dark:text-gray-400 mt-2">組織全体の目標を視覚化し、整合性を確認します。</p></div>
        <div className="flex justify-center gap-4 mb-6"><button onClick={handleExpandAll} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">すべて展開</button><button onClick={handleCollapseAll} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600">すべて折りたたむ</button></div>
        <div className="max-w-4xl mx-auto">{treeData.map(rootNode => <TreeNode key={rootNode.id} node={rootNode} expandedNodes={expandedNodes} onToggleNode={handleToggleNode} onNodeUpdate={handleNodeUpdate} onNodeDelete={handleDeleteNode} onNodeAdd={handleAddNode} />)}</div>
        <EditObjectiveModal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, objective: null, nodeId: null })} onSave={handleSaveObjective} objective={modalState.objective} nodeId={modalState.nodeId} />
      </div>
    </div>
  );
}
