import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

interface DriftResult {
  domain: string;
  analogy: string;
  actionableInsight: string;
}

function App() {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DriftResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/drift/analogy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      if (!response.ok) throw new Error('Failed to reach the engine');

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>ParadigmDrift</h1>
        <p className="tagline">The Serendipity Engine for Lateral Thinking</p>
      </motion.div>

      <form onSubmit={handleDrift} className="input-group">
        <input
          type="text"
          placeholder="Describe what you're stuck on..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          disabled={loading}
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button type="submit" className="drift-button" disabled={loading || !problem.trim()}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Pivoting Perspective...
              </>
            ) : (
              <>
                Initiate Drift <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ color: '#ff4444', marginTop: '1rem' }}
          >
            {error}
          </motion.p>
        )}

        {result && (
          <motion.div 
            className="result-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="domain-tag">Domain: {result.domain}</div>
            <p className="analogy-text">{result.analogy}</p>
            
            <div className="insight-section">
              <div className="insight-title">Actionable Insight</div>
              <p className="insight-text">{result.actionableInsight}</p>
            </div>

            <button 
              onClick={handleDrift} 
              style={{ 
                marginTop: '2rem', 
                background: 'transparent', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <RefreshCw size={14} /> Try another analogy
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.4 }} 
          transition={{ delay: 1 }}
          style={{ marginTop: '4rem', fontSize: '0.9rem' }}
        >
          <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Type a challenge and see it through a different lens.
        </motion.div>
      )}
    </div>
  );
}

export default App;
