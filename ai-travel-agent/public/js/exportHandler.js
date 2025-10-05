class TripExporter {
    constructor() {
        this.tripData = null;
        this.itineraryHTML = '';
    }

    setTripData(formData, itineraryHTML) {
        this.tripData = formData;
        this.itineraryHTML = itineraryHTML;
    }

    cleanHTMLForExport(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Remove all <ol> numbering by converting to <ul>
        tempDiv.querySelectorAll('ol').forEach(ol => {
            const ul = document.createElement('ul');
            ul.innerHTML = ol.innerHTML;
            Array.from(ol.attributes).forEach(attr => {
                ul.setAttribute(attr.name, attr.value);
            });
            ol.parentNode.replaceChild(ul, ol);
        });
        
        return tempDiv.innerHTML;
    }

    exportToPDF() {
    if (!this.itineraryHTML) {
        alert(currentLang === 'vi' ? 'Chưa có lịch trình để xuất!' : 'No itinerary to export!');
        return;
    }

    // Create a simple, clean container with better page break handling
    const printWindow = document.createElement('div');
    printWindow.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 750px; margin: 0 auto;">
            <h1 style="color: #667eea; text-align: center; margin-bottom: 25px; border-bottom: 3px solid #667eea; padding-bottom: 15px; page-break-after: avoid;">
                ✈️ ${this.tripData?.destination || 'Travel'} Itinerary
            </h1>
            <div style="line-height: 1.6; color: #333;">
                ${this.cleanHTMLForExport(this.itineraryHTML)}
            </div>
        </div>
        <style>
            * { box-sizing: border-box; }
            h1 { 
                color: #667eea; 
                font-size: 22px; 
                margin: 20px 0 12px; 
                border-bottom: 2px solid #667eea; 
                padding-bottom: 8px;
                page-break-after: avoid;
            }
            h2 { 
                color: #667eea; 
                font-size: 18px; 
                margin: 18px 0 10px; 
                border-left: 4px solid #667eea; 
                padding-left: 12px;
                page-break-after: avoid;
            }
            h3 { 
                color: #764ba2; 
                font-size: 16px; 
                margin: 15px 0 8px;
                page-break-after: avoid;
            }
            h4 { 
                color: #555; 
                font-size: 15px; 
                margin: 12px 0 6px;
                page-break-after: avoid;
            }
            p { 
                margin: 8px 0; 
                line-height: 1.6;
                page-break-inside: avoid;
            }
            ul, ol { 
                list-style: none; 
                margin: 10px 0; 
                padding-left: 0;
                page-break-inside: avoid;
            }
            li { 
                margin: 8px 0; 
                padding-left: 18px; 
                position: relative;
                page-break-inside: avoid;
            }
            li:before { 
                content: "•"; 
                color: #667eea; 
                font-weight: bold; 
                position: absolute; 
                left: 0; 
            }
            a { 
                color: #667eea; 
                text-decoration: none; 
                font-weight: 600;
                word-wrap: break-word;
            }
            strong, b { 
                color: #667eea; 
                font-weight: 700; 
            }
            
            /* Weather sections - keep together */
            .weather-current,
            .weather-forecast,
            .forecast-day {
                page-break-inside: avoid;
            }
            
            /* Prevent orphans and widows */
            p, li {
                orphans: 3;
                widows: 3;
            }
            
            /* Force page breaks before major sections if needed */
            h2 {
                page-break-before: auto;
            }
        </style>
    `;

    // PDF configuration with better page handling
    const opt = {
        margin: [12, 12, 12, 12], // top, right, bottom, left
        filename: `${this.tripData?.destination || 'trip'}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: ['h1', 'h2', 'h3', 'h4', 'p', 'li', 'ul', 'ol', '.weather-current', '.weather-forecast', '.forecast-day']
        }
    };

    // Show loading
    const exportBtn = document.getElementById('exportButton');
    const originalText = exportBtn ? exportBtn.textContent : '';
    if (exportBtn) exportBtn.textContent = '⏳ Đang tạo PDF...';

    // Generate PDF
    html2pdf()
        .set(opt)
        .from(printWindow)
        .save()
        .then(() => {
            if (exportBtn) exportBtn.textContent = originalText;
        })
        .catch(err => {
            console.error('PDF Error:', err);
            alert('Lỗi khi tạo PDF. Vui lòng thử lại!');
            if (exportBtn) exportBtn.textContent = originalText;
        });
}

    exportToHTML() {
        if (!this.itineraryHTML) {
            alert(currentLang === 'vi' ? 'Chưa có lịch trình để xuất!' : 'No itinerary to export!');
            return;
        }

        const cleanedHTML = this.cleanHTMLForExport(this.itineraryHTML);

        const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.tripData?.destination || 'Travel'} Itinerary</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.8;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
            color: #667eea;
            font-size: 2.5em;
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
            margin-bottom: 30px;
        }
        h2 {
            color: #667eea;
            font-size: 1.8em;
            margin: 25px 0 15px;
            padding-left: 15px;
            border-left: 5px solid #667eea;
        }
        h3 {
            color: #764ba2;
            font-size: 1.4em;
            margin: 20px 0 12px;
        }
        h4 {
            color: #555;
            font-size: 1.2em;
            margin: 18px 0 10px;
        }
        p {
            margin: 12px 0;
            line-height: 1.8;
        }
        a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }
        a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
        ul, ol {
            list-style: none;
            margin: 15px 0;
            padding-left: 0;
        }
        li {
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
        }
        li:before {
            content: "• ";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 1.2em;
        }
        strong, b {
            color: #667eea;
            font-weight: 700;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✈️ ${this.tripData?.destination || 'Travel'} Itinerary</h1>
        ${cleanedHTML}
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tripData?.destination || 'trip'}_${Date.now()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToMarkdown() {
        if (!this.itineraryHTML) {
            alert(currentLang === 'vi' ? 'Chưa có lịch trình để xuất!' : 'No itinerary to export!');
            return;
        }

        const cleanedHTML = this.cleanHTMLForExport(this.itineraryHTML);
        
        let markdown = `# ✈️ ${this.tripData?.destination || 'Travel'} Itinerary\n\n`;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanedHTML;
        
        markdown += this.htmlToMarkdown(tempDiv);

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tripData?.destination || 'trip'}_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToText() {
        if (!this.itineraryHTML) {
            alert(currentLang === 'vi' ? 'Chưa có lịch trình để xuất!' : 'No itinerary to export!');
            return;
        }

        const cleanedHTML = this.cleanHTMLForExport(this.itineraryHTML);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanedHTML;
        
        let text = `${'='.repeat(60)}\n`;
        text += `${this.tripData?.destination || 'TRAVEL'} ITINERARY\n`;
        text += `${'='.repeat(60)}\n\n`;
        text += tempDiv.textContent || tempDiv.innerText || '';

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tripData?.destination || 'trip'}_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    htmlToMarkdown(element) {
        let markdown = '';
        
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) markdown += text + '\n';
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                switch(tagName) {
                    case 'h1':
                        markdown += `\n# ${node.textContent}\n\n`;
                        break;
                    case 'h2':
                        markdown += `\n## ${node.textContent}\n\n`;
                        break;
                    case 'h3':
                        markdown += `\n### ${node.textContent}\n\n`;
                        break;
                    case 'h4':
                        markdown += `\n#### ${node.textContent}\n\n`;
                        break;
                    case 'p':
                        markdown += `${node.textContent}\n\n`;
                        break;
                    case 'a':
                        markdown += `[${node.textContent}](${node.href})`;
                        break;
                    case 'strong':
                    case 'b':
                        markdown += `**${node.textContent}**`;
                        break;
                    case 'em':
                    case 'i':
                        markdown += `*${node.textContent}*`;
                        break;
                    case 'ul':
                    case 'ol':
                        node.querySelectorAll('li').forEach(li => {
                            markdown += `- ${li.textContent}\n`;
                        });
                        markdown += '\n';
                        break;
                    default:
                        markdown += this.htmlToMarkdown(node);
                }
            }
        });
        
        return markdown;
    }
}

// Initialize exporter
const tripExporter = new TripExporter();