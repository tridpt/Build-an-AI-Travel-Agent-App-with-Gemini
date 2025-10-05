class TripExporter {
    constructor() {
        this.tripData = null;
        this.planContent = null;
    }
    
    setTripData(formData, planContent) {
        this.tripData = formData;
        this.planContent = planContent;
    }
    
    // Export as PDF
    exportToPDF() {
        const element = document.getElementById('planContent');
        const destination = this.tripData?.destination || 'Trip';
        const filename = `${destination}_${new Date().getTime()}.pdf`;
        
        // Use browser's print to PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${destination} - Travel Itinerary</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    h1, h2, h3 { color: #667eea; }
                    strong { color: #667eea; }
                    a { color: #667eea; text-decoration: none; }
                    hr { border: 1px solid #e0e0e0; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1>🌍 ${destination} - Travel Itinerary</h1>
                <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
                <hr>
                ${element.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
    
    // Export as HTML
    exportToHTML() {
        const element = document.getElementById('planContent');
        const destination = this.tripData?.destination || 'Trip';
        const filename = `${destination}_${new Date().getTime()}.html`;
        
        const htmlContent = `
<!DOCTYPE html>
<html lang="${currentLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${destination} - Travel Itinerary</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 { 
            color: #667eea; 
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        h2 { 
            color: #667eea; 
            font-size: 2em;
            margin-top: 30px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        h3 { 
            color: #764ba2; 
            font-size: 1.5em;
        }
        strong { 
            color: #667eea; 
            font-weight: 600;
        }
        a { 
            display: inline-block;
            padding: 6px 12px;
            margin: 5px 5px 5px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s;
        }
        a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }
        hr { 
            border: none;
            border-top: 1px dashed #e0e0e0;
            margin: 20px 0;
        }
        ul, ol {
            margin-left: 25px;
            margin-bottom: 15px;
        }
        li {
            margin-bottom: 8px;
        }
        p {
            margin-bottom: 12px;
            line-height: 1.8;
        }
        .metadata {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 ${destination}</h1>
        <div class="metadata">
            <p><strong>📅 ${currentLang === 'vi' ? 'Ngày tạo' : 'Generated'}:</strong> ${new Date().toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}</p>
            ${this.tripData ? `
                <p><strong>📍 ${currentLang === 'vi' ? 'Điểm đến' : 'Destination'}:</strong> ${this.tripData.destination || 'N/A'}</p>
                <p><strong>📅 ${currentLang === 'vi' ? 'Thời gian' : 'Duration'}:</strong> ${this.tripData.startDate} → ${this.tripData.endDate}</p>
                <p><strong>💰 ${currentLang === 'vi' ? 'Ngân sách' : 'Budget'}:</strong> ${this.tripData.budget.toLocaleString()} ${t('currency')}</p>
                <p><strong>👥 ${currentLang === 'vi' ? 'Số người' : 'Travelers'}:</strong> ${this.tripData.travelers}</p>
            ` : ''}
        </div>
        <hr>
        ${element.innerHTML}
        <div class="footer">
            <p>🤖 ${currentLang === 'vi' ? 'Được tạo bởi' : 'Generated by'} AI Travel Agent</p>
            <p>${currentLang === 'vi' ? 'Trợ lý du lịch thông minh' : 'Smart Travel Assistant'}</p>
        </div>
    </div>
</body>
</html>`;
        
        this.downloadFile(htmlContent, filename, 'text/html');
    }
    
    // Export as Markdown
    exportToMarkdown() {
        const element = document.getElementById('planContent');
        const destination = this.tripData?.destination || 'Trip';
        const filename = `${destination}_${new Date().getTime()}.md`;
        
        // Convert HTML to Markdown
        let markdown = `# 🌍 ${destination}\n\n`;
        markdown += `**${currentLang === 'vi' ? 'Ngày tạo' : 'Generated'}:** ${new Date().toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}\n\n`;
        
        if (this.tripData) {
            markdown += `## ${currentLang === 'vi' ? 'Thông tin chuyến đi' : 'Trip Information'}\n\n`;
            markdown += `- **${currentLang === 'vi' ? 'Điểm đến' : 'Destination'}:** ${this.tripData.destination || 'N/A'}\n`;
            markdown += `- **${currentLang === 'vi' ? 'Thời gian' : 'Duration'}:** ${this.tripData.startDate} → ${this.tripData.endDate}\n`;
            markdown += `- **${currentLang === 'vi' ? 'Ngân sách' : 'Budget'}:** ${this.tripData.budget.toLocaleString()} ${t('currency')}\n`;
            markdown += `- **${currentLang === 'vi' ? 'Số người' : 'Travelers'}:** ${this.tripData.travelers}\n\n`;
        }
        
        markdown += `---\n\n`;
        
        // Simple HTML to Markdown conversion
        let content = element.innerHTML;
        content = content.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n');
        content = content.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n');
        content = content.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n');
        content = content.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
        content = content.replace(/<em>(.*?)<\/em>/g, '*$1*');
        content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
        content = content.replace(/<li>(.*?)<\/li>/g, '- $1\n');
        content = content.replace(/<ul[^>]*>/g, '\n');
        content = content.replace(/<\/ul>/g, '\n');
        content = content.replace(/<ol[^>]*>/g, '\n');
        content = content.replace(/<\/ol>/g, '\n');
        content = content.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n');
        content = content.replace(/<br\s*\/?>/g, '\n');
        content = content.replace(/<hr\s*\/?>/g, '\n---\n\n');
        content = content.replace(/<[^>]+>/g, '');
        content = content.replace(/&nbsp;/g, ' ');
        content = content.replace(/&amp;/g, '&');
        content = content.replace(/&lt;/g, '<');
        content = content.replace(/&gt;/g, '>');
        
        markdown += content;
        
        this.downloadFile(markdown, filename, 'text/markdown');
    }
    
    // Export as plain text
    exportToText() {
        const element = document.getElementById('planContent');
        const destination = this.tripData?.destination || 'Trip';
        const filename = `${destination}_${new Date().getTime()}.txt`;
        
        let text = `${'='.repeat(60)}\n`;
        text += `${destination.toUpperCase()} - TRAVEL ITINERARY\n`;
        text += `${'='.repeat(60)}\n\n`;
        text += `${currentLang === 'vi' ? 'Ngày tạo' : 'Generated'}: ${new Date().toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}\n\n`;
        
        if (this.tripData) {
            text += `${currentLang === 'vi' ? 'Điểm đến' : 'Destination'}: ${this.tripData.destination || 'N/A'}\n`;
            text += `${currentLang === 'vi' ? 'Thời gian' : 'Duration'}: ${this.tripData.startDate} → ${this.tripData.endDate}\n`;
            text += `${currentLang === 'vi' ? 'Ngân sách' : 'Budget'}: ${this.tripData.budget.toLocaleString()} ${t('currency')}\n`;
            text += `${currentLang === 'vi' ? 'Số người' : 'Travelers'}: ${this.tripData.travelers}\n\n`;
        }
        
        text += `${'-'.repeat(60)}\n\n`;
        
        // Convert HTML to plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;
        text += tempDiv.textContent || tempDiv.innerText || '';
        
        this.downloadFile(text, filename, 'text/plain');
    }
    
    // Helper function to download file
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Global instance
const tripExporter = new TripExporter();