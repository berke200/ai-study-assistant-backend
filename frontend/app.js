// ====================================================================
//  AI STUDY ASSISTANT — STABLE & BEAUTIFUL UI
// ====================================================================

console.log("AI Study Assistant Frontend Loaded");

const API = "http://127.0.0.1:9000";

// ====================================================================
//  ELEMENTS
// ====================================================================

const summaryBtn = document.getElementById("summaryBtn");
const summaryPdf = document.getElementById("summaryPdf");
const summaryOutput = document.getElementById("summaryOutput");

const studyBtn = document.getElementById("studyBtn");
const studyPdf = document.getElementById("studyPdf");
const studyOutput = document.getElementById("studyOutput");

// ====================================================================
//  UTILITY FUNCTIONS
// ====================================================================

function cleanMarkdown(text) {
    if (!text) return "";
    return text
        .replace(/\\n/g, "\n")
        .replace(/\\\\n/g, "\n")
        .replace(/```(json)?/g, "")
        .replace(/^"+|"+$/g, "")
        .trim();
}

function showLoading(button) {
    if (!button) return;

    const btnText = button.querySelector('.btn-text');
    if (btnText) {
        btnText.innerHTML = '<div class="loading-spinner"></div>Processing...';
    }
    button.disabled = true;
}

function hideLoading(button, text) {
    if (!button) return;

    const btnText = button.querySelector('.btn-text');
    if (btnText) {
        btnText.textContent = text;
    }
    button.disabled = false;
}

function showSkeleton(target) {
    if (!target) return;

    const html = `
        <div style="padding: 20px;">
            <div class="loading-spinner"></div>
            <div style="color: var(--text-muted); margin-top: 10px;">Processing your document...</div>
        </div>
    `;
    target.innerHTML = html;
}

function showStatus(message, type = 'info', target) {
    if (!target) return;

    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type}`;
    statusDiv.textContent = message;

    target.innerHTML = '';
    target.appendChild(statusDiv);

    return statusDiv;
}

// ====================================================================
//  STUDY NOTES SYSTEM - SIMPLE & WORKING
// ====================================================================

function initializeStudyNotes() {
    const output = document.getElementById("studyOutput");
    if (!output) {
        console.error("studyOutput element not found");
        return;
    }

    const content = output.innerHTML;

    // Eğer zaten collapsible yapı varsa veya içerik yoksa çık
    if (content.includes('note-section') || !content.trim()) {
        return;
    }

    // Basit collapsible yapı oluştur
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    let newHTML = '';
    let currentSection = null;
    let sectionContent = '';

    // Tüm child nodes'ları işle
    Array.from(tempDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();

            // H2 veya H3 başlıklarını yakala
            if (tagName === 'h2' || tagName === 'h3') {
                // Önceki section'ı kapat
                if (currentSection) {
                    newHTML += `</div></div>`;
                }

                // Yeni section başlat
                const title = node.textContent.trim();
                newHTML += `
                    <div class="note-section">
                        <div class="note-header">
                            ${title}
                            <span class="note-arrow">▶</span>
                        </div>
                        <div class="note-body">
                `;
                currentSection = title;
            }
            // Section içeriği
            else if (currentSection) {
                newHTML += node.outerHTML;
            }
            // Section dışı içerik
            else {
                newHTML += node.outerHTML;
            }
        }
    });

    // Son section'ı kapat
    if (currentSection) {
        newHTML += `</div></div>`;
    }

    // Eğer collapsible yapı oluşturulduysa uygula
    if (newHTML.includes('note-section')) {
        output.innerHTML = newHTML;
        setupCollapsibleSections();
    }
}

function setupCollapsibleSections() {
    const sections = document.querySelectorAll(".note-section");

    sections.forEach(section => {
        const header = section.querySelector(".note-header");
        const body = section.querySelector(".note-body");
        const arrow = section.querySelector(".note-arrow");

        // Null check - çok önemli!
        if (!header || !body || !arrow) {
            console.warn('Missing elements in section, skipping...');
            return;
        }

        // Başlangıçta tüm body'leri gizle
        body.style.display = 'none';

        header.addEventListener('click', () => {
            const isCurrentlyOpen = body.style.display === 'block';

            if (isCurrentlyOpen) {
                // Kapat
                body.style.display = 'none';
                arrow.textContent = '▶';
                section.classList.remove('note-open');
            } else {
                // Aç
                body.style.display = 'block';
                arrow.textContent = '▼';
                section.classList.add('note-open');
            }
        });
    });
}

// ====================================================================
//  SUMMARY FUNCTIONALITY
// ====================================================================

if (summaryBtn) {
    summaryBtn.addEventListener("click", async () => {
        if (!summaryPdf || !summaryPdf.files.length) {
            showStatus("Please upload a PDF file first.", "error", summaryOutput);
            return;
        }

        showLoading(summaryBtn);
        showSkeleton(summaryOutput);

        const formData = new FormData();
        formData.append("file", summaryPdf.files[0]);

        try {
            const response = await fetch(`${API}/upload-pdf`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const text = await response.text();
            const cleaned = cleanMarkdown(text);

            if (!cleaned || cleaned.includes("Error processing PDF")) {
                throw new Error("Failed to process PDF. Please try again.");
            }

            // Markdown'ı HTML'e çevir ve göster
            summaryOutput.innerHTML = marked.parse(cleaned);

        } catch (error) {
            console.error("Summary error:", error);
            showStatus(`Error: ${error.message}`, "error", summaryOutput);
        } finally {
            hideLoading(summaryBtn, "Summarize PDF");
        }
    });
}

// ====================================================================
//  STUDY NOTES FUNCTIONALITY
// ====================================================================

if (studyBtn) {
    studyBtn.addEventListener("click", async () => {
        if (!studyPdf || !studyPdf.files.length) {
            showStatus("Please upload a PDF file first.", "error", studyOutput);
            return;
        }

        showLoading(studyBtn);
        showSkeleton(studyOutput);

        const formData = new FormData();
        formData.append("file", studyPdf.files[0]);

        try {
            const response = await fetch(`${API}/study-notes-from-pdf`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const text = await response.text();
            const cleaned = cleanMarkdown(text);

            if (!cleaned || cleaned.includes("Error generating study notes")) {
                throw new Error("Failed to generate study notes. Please try again.");
            }

            // Önce markdown'ı HTML'e çevir
            studyOutput.innerHTML = marked.parse(cleaned);

            // Sonra collapsible yapıyı oluştur
            setTimeout(() => {
                try {
                    initializeStudyNotes();
                } catch (error) {
                    console.error("Error initializing study notes:", error);
                    // Hata olsa bile normal içerik gözüksün
                }
            }, 100);

        } catch (error) {
            console.error("Study notes error:", error);
            showStatus(`Error: ${error.message}`, "error", studyOutput);
        } finally {
            hideLoading(studyBtn, "Generate Study Notes");
        }
    });
}

// ====================================================================
//  INITIALIZATION
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Study Assistant initialized');

    // Marked.js options
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
            sanitize: false
        });
    }

    // Debug info
    console.log('Elements status:', {
        summaryBtn: !!summaryBtn,
        studyBtn: !!studyBtn
    });
});