export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.fontSize = '16px';
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    if (selection) { selection.removeAllRanges(); selection.addRange(range); }
    textarea.setSelectionRange(0, textarea.value.length);
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch { return false; }
}
