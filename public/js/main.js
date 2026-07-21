function startGuestUpload() {
  fetch('/api/auth/guest', { method: 'POST' })
    .then(res => res.json())
    .then(data => { if (data.guestId) window.location.href = '/dashboard'; })
    .catch(err => console.error(err));
}

function handleDragOver(e) { e.preventDefault(); e.target.closest('.upload-area').classList.add('dragover'); }
function handleDragLeave(e) { e.target.closest('.upload-area').classList.remove('dragover'); }
function handleDrop(e) {
  e.preventDefault();
  e.target.closest('.upload-area').classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) uploadFile(files[0]);
}
function handleFileSelect(e) { const file = e.target.files[0]; if (file) uploadFile(file); }
function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const uploadArea = document.querySelector('.upload-area');
  const progressDiv = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  uploadArea.style.display = 'none';
  progressDiv.style.display = 'block';
  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      progressBar.style.width = percentComplete + '%';
      progressText.textContent = Math.round(percentComplete);
    }
  });
  xhr.addEventListener('load', () => {
    if (xhr.status === 201) {
      alert('فایل با موفقیت آپلود شد!');
      if (window.location.pathname === '/dashboard') location.reload();
      uploadArea.style.display = 'block';
      progressDiv.style.display = 'none';
    }
  });
  xhr.addEventListener('error', () => { alert('خطا در آپلود!'); uploadArea.style.display = 'block'; });
  xhr.open('POST', '/api/upload');
  xhr.send(formData);
}
document.querySelector('.upload-area')?.addEventListener('click', () => { document.getElementById('fileInput').click(); });