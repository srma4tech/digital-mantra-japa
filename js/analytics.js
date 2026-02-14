const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

let analyticsReady = false;

function canUseAnalytics() {
  if (!window?.APP_CONFIG?.gaMeasurementId && GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return false;
  }

  if (localStorage.getItem('analyticsEnabled') !== 'true') {
    return false;
  }

  if (navigator.doNotTrack === '1') {
    return false;
  }

  return true;
}

function getMeasurementId() {
  return window?.APP_CONFIG?.gaMeasurementId || GA_MEASUREMENT_ID;
}

export function initAnalytics() {
  if (analyticsReady || !canUseAnalytics()) return;

  const id = getMeasurementId();
  if (!id || !id.startsWith('G-')) return;

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.onload = () => {
    window.gtag('js', new Date());
    window.gtag('config', id, {
      anonymize_ip: true,
      transport_type: 'beacon'
    });
    analyticsReady = true;
  };
  script.onerror = () => {
    analyticsReady = false;
  };

  document.head.appendChild(script);
}

export function trackEvent(name, params = {}) {
  if (!analyticsReady || !window.gtag) return;
  if (localStorage.getItem('analyticsEnabled') !== 'true') return;
  if (navigator.doNotTrack === '1') return;
  window.gtag('event', name, params);
}
