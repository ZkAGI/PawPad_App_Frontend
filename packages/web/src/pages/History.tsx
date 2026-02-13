export default function History() {
  // TODO: Wire up to apiService.getTransactionHistory()
  const transactions: unknown[] = [];

  return (
    <div className="page fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>History</h1>

      {transactions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📜</p>
          <p style={{ color: 'var(--text-muted)' }}>No transactions yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* TODO: Map transactions here */}
        </div>
      )}
    </div>
  );
}
