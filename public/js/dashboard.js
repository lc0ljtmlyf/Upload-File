async function loadFiles() {
  try {
    const response = await fetch('/api/files');
    const files = await response.json();
    const filesList = document.getElementById('filesList');
    document.getElementById('totalFiles').textContent = files.length;
    let totalDownloads = 0;
    files.forEach(f => totalDownloads += f.downloads);
    document.getElementById('totalDownloads').textContent = totalDownloads;
    if (files.length === 0) {
      filesList.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="fas fa-inbox fa-3x mb-3"></i><p>هنوز فایلی آپلود نکرده‌اید</p></div>';
      return;
    }
    filesList.innerHTML = files.map(file => `
      <div class="col-md-6"><div class="file-card"><div class="file-name"><i class="fas fa-file"></i> ${file.originalName}</div>
      <div class="file-info"><span>${formatFileSize(file.size)}</span><span>${new Date(file.uploadDate).toLocaleDateString('fa-IR')}</span><span><i class="fas fa-download"></i> ${file.downloads}</span></div>
      <div class="file-actions"><button class="btn btn-download btn-sm" onclick="downloadFile('${file.downloadUrl}', '${file.originalName}' )"><i class="fas fa-download"></i> دانلود</button>
      <button class="btn btn-delete btn-sm" onclick="deleteFile('${file._id}' )"><i class="fas fa-trash"></i> حذف</button></div></div></div>
    `).join('');
  } catch (error) { console.error(error); }
}
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
function downloadFile(url, name) { const link = document.createElement('a'); link.href = url; link.download = name; link.click(); }
async function deleteFile(fileId) {
  if (!confirm('آیا مطمئن هستید؟')) return;
  try {
    const response = await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
    if (response.ok) { alert('فایل حذف شد!'); loadFiles(); } else alert('خطا!');
  } catch (error) { alert('خطا!'); }
}
async function logout() { try { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/'; } catch (error) {} }
function handleDragOver(e) { e.preventDefault(); e.target.closest('.upload-area').classList.add('dragover'); }
function handleDragLeave(e) { e.target.closest('.upload-area').classList.remove('dragover'); }
function handleDrop(e) { e.preventDefault(); e.target.closest('.upload-area').classList.remove('dragover'); const files = e.dataTransfer.files; if (files.length > 0) uploadFile(files[0]); }
function handleFileSelect(e) { const file = e.target.files[0]; if (file) uploadFile(file); }
function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const uploadArea = document.querySelector('.upload-area');
  const progressDiv = document.getElementById('uploadProgress');
  uploadArea.style.display = 'none';
  progressDiv.style.display = 'block';
  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', (e) => { if (e.lengthComputable) { const pc = (e.loaded / e.total) * 100; document.getElementById('progressBar').style.width = pc + '%'; document.getElementById('progressText').textContent = Math.round(pc); } });
  xhr.addEventListener('load', () => { if (xhr.status === 201) { alert('آپلود شد!'); loadFiles(); uploadArea.style.display = 'block'; progressDiv.style.display = 'none'; } });
  xhr.addEventListener('error', () => { alert('خطا!'); uploadArea.style.display = 'block'; });
  xhr.open('POST', '/api/upload');
  xhr.send(formData);
}
document.querySelector('.upload-area')?.addEventListener('click', () => { document.getElementById('fileInput').click(); });
loadFiles();
setInterval(loadFiles, 30000);