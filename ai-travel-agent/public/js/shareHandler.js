class ShareHandler {
    constructor() {
        this.tripData = null;
        this.itineraryText = '';
    }

    setTripData(formData, itineraryHTML) {
        this.tripData = formData;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itineraryHTML;
        this.itineraryText = tempDiv.textContent || tempDiv.innerText || '';
    }

    getShareText() {
        if (!this.tripData) return "Hãy xem kế hoạch du lịch này!";
        const destination = this.tripData.destination || 'chuyến đi sắp tới của tôi';
        let shareText = `Hãy xem lịch trình du lịch của tôi cho ${destination}!\n\n`;
        shareText += this.itineraryText.substring(0, 200) + '...'; // Cắt bớt để chia sẻ
        return shareText;
    }

    share(platform) {
        if (!this.tripData) {
            alert(t('noItineraryToShare'));
            return;
        }

        const text = encodeURIComponent(this.getShareText());
        const url = encodeURIComponent(window.location.href);
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                break;
            case 'email':
                const subject = encodeURIComponent(`Lịch trình du lịch của tôi cho ${this.tripData.destination}`);
                shareUrl = `mailto:?subject=${subject}&body=${text}`;
                break;
            default:
                return;
        }
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
}

const shareHandler = new ShareHandler();