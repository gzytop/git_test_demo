const textInput = document.querySelector('#qr-text');
const charCount = document.querySelector('#char-count');
const statusText = document.querySelector('#status');
const output = document.querySelector('#qr-output');
const generateBtn = document.querySelector('#generate-btn');
const clearBtn = document.querySelector('#clear-btn');
const sampleBtn = document.querySelector('#sample-btn');
const downloadBtn = document.querySelector('#download-btn');

const SAMPLE_TEXT = 'https://github.com/gzytop/git_test_demo';

function setStatus(message) {
  statusText.textContent = message;
}

function updateCount() {
  charCount.textContent = `${textInput.value.length} / ${textInput.maxLength}`;
}

function getCanvas() {
  return output.querySelector('canvas');
}

async function generateQrCode() {
  const value = textInput.value.trim();

  if (!value) {
    output.innerHTML = '<span>请输入内容后再生成二维码</span>';
    downloadBtn.disabled = true;
    setStatus('内容不能为空');
    textInput.focus();
    return;
  }

  if (!window.QRCode) {
    setStatus('二维码库加载失败，请检查网络后重试');
    return;
  }

  output.innerHTML = '';

  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, value, {
      width: 320,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    output.appendChild(canvas);
    downloadBtn.disabled = false;
    setStatus('二维码已生成');
  } catch (error) {
    output.innerHTML = '<span>生成失败，请缩短内容后重试</span>';
    downloadBtn.disabled = true;
    setStatus('生成失败');
  }
}

function clearAll() {
  textInput.value = '';
  output.innerHTML = '<span>二维码将在这里显示</span>';
  downloadBtn.disabled = true;
  updateCount();
  setStatus('等待输入');
  textInput.focus();
}

function useSample() {
  textInput.value = SAMPLE_TEXT;
  updateCount();
  generateQrCode();
}

function downloadQrCode() {
  const canvas = getCanvas();

  if (!canvas) {
    return;
  }

  const link = document.createElement('a');
  link.download = 'qr-forge.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

textInput.addEventListener('input', () => {
  updateCount();
  setStatus(textInput.value.trim() ? '可以生成' : '等待输入');
});

generateBtn.addEventListener('click', generateQrCode);
clearBtn.addEventListener('click', clearAll);
sampleBtn.addEventListener('click', useSample);
downloadBtn.addEventListener('click', downloadQrCode);

updateCount();
