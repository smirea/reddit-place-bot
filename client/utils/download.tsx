export const downloadBlob = (fileName: string, mimeType: string, data: string) => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

export const downloadURL = (data: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style.display = 'none';
    a.click();
    a.remove();
};
