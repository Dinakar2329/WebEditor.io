
const combinedEditor = CodeMirror.fromTextArea(
  document.getElementById("combinedEditorTextarea"),
  {
    mode: "htmlmixed",
    theme: "monokai",
    lineNumbers: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    },
    hintOptions: {
      completeSingle: false,
    },
  }
);

const updatePreview = () => {
  const code = combinedEditor.getValue();
  const previewFrame = document.getElementById("previewFrame");
  const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
  preview.open();
  preview.write(code);
  preview.close();

  // Extract and update title
  const titleMatch = code.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'Untitled';
  document.getElementById('displayTitle').textContent = title;
  document.getElementById('pageTitle').textContent = title.toLowerCase().replace(/\s+/g, '-') + '.html';

  // Update favicon if present
  const faviconMatch = code.match(/<link[^>]*rel=["']icon["'][^>]*>/i);
  if (faviconMatch) {
      const hrefMatch = faviconMatch[0].match(/href=["'](.*?)["']/i);
      if (hrefMatch) {
          const favicon = document.createElement('link');
          favicon.rel = 'icon';
          favicon.href = hrefMatch[1];
          const existingFavicon = document.querySelector('link[rel="icon"]');
          if (existingFavicon) {
              document.head.removeChild(existingFavicon);
          }
          document.head.appendChild(favicon);
      }
  }
};

combinedEditor.on("change", updatePreview);



let isDark = false;
const themeToggle = document.getElementById("themeToggle");
const Title = document.getElementById("Title");
themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  Title.style.color = isDark ? "white" : "black";
});


const fullscreenBtn = document.getElementById("fullscreenBtn");
let fullscreenWindow;
fullscreenBtn.addEventListener("click", () => {
  if (!fullscreenWindow || fullscreenWindow.closed) {
    fullscreenWindow = window.open();
  }
  const code = combinedEditor.getValue();
  const newWindow = fullscreenWindow.document;
  newWindow.open();
  newWindow.write(code);
  newWindow.close();

});


const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  const code = combinedEditor.getValue();
  if (!code) {
    alert("No code to download.");
    return;
  }
  const blob = new Blob([code], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const titleMatch = code.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'Untitled';
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
});


updatePreview();
