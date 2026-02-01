// Global variables
let currentSchedule = {
    sleepStart: "08:00",
    sleepEnd: "16:00",
    studyStart: "20:00",
    studyEnd: "04:00"
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const isGodFirstPage = document.querySelector('.god-first-page');
    const isMainPage = document.querySelector('.main-page');

    if (isGodFirstPage) {
        initializeGodFirstPage();
    }

    if (isMainPage) {
        initializeMainPage();
    }
});

// God First Page Functions
function initializeGodFirstPage() {
    // Enter button functionality
    const enterButton = document.getElementById('enterApp');
    if (enterButton) {
        enterButton.addEventListener('click', function() {
            // Add animation effect
            enterButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entering...';
            enterButton.disabled = true;

            // Simulate loading delay
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1500);
        });
    }

    // Add typing effect to the title
    const title = document.querySelector('.god-first-title');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        setTimeout(typeWriter, 1000);
    }
}

// Main Page Functions
function initializeMainPage() {
    // Initialize current time display
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Initialize countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Load saved schedule
    loadSavedSchedule();

    // Event listeners for schedule controls
    document.getElementById('saveSchedule')?.addEventListener('click', saveSchedule);
    document.getElementById('resetSchedule')?.addEventListener('click', resetSchedule);

    // Update timeline based on schedule
    updateTimeline();

    // Add animation to luxury items
    animateLuxuryItems();

    // Add notification for schedule changes
    setupNotifications();
}

// Update current date and time
function updateDateTime() {
    const now = new Date();

    // Format time
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Format date
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update DOM elements
    const currentTimeElement = document.getElementById('currentTime');
    const currentDateElement = document.getElementById('currentDate');

    if (currentTimeElement) currentTimeElement.textContent = timeString;
    if (currentDateElement) currentDateElement.textContent = dateString;

    // Update mode indicator based on time
    updateModeIndicator(now);
}

// Update mode indicator (night/day)
function updateModeIndicator(now) {
    const hour = now.getHours();
    const modeIndicator = document.querySelector('.mode-indicator');

    if (modeIndicator) {
        if (hour >= 20 || hour < 4) {
            // Night study hours
            modeIndicator.className = 'mode-indicator night-mode';
            modeIndicator.innerHTML = '<i class="fas fa-moon"></i> NIGHT STUDY MODE ACTIVE';
            modeIndicator.style.background = 'rgba(30, 58, 138, 0.3)';
            modeIndicator.style.border = '1px solid rgba(59, 130, 246, 0.5)';
        } else if (hour >= 4 && hour < 8) {
            // Wind down hours
            modeIndicator.className = 'mode-indicator winddown-mode';
            modeIndicator.innerHTML = '<i class="fas fa-wind"></i> WIND DOWN MODE ACTIVE';
            modeIndicator.style.background = 'rgba(139, 92, 246, 0.3)';
            modeIndicator.style.border = '1px solid rgba(167, 139, 250, 0.5)';
        } else {
            // Sleep hours
            modeIndicator.className = 'mode-indicator sleep-mode';
            modeIndicator.innerHTML = '<i class="fas fa-bed"></i> SLEEP MODE ACTIVE - AVOID DISTRACTIONS';
            modeIndicator.style.background = 'rgba(59, 130, 246, 0.3)';
            modeIndicator.style.border = '1px solid rgba(96, 165, 250, 0.5)';
        }
    }
}

// Update countdown to next schedule change
function updateCountdown() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    let nextChange = '';

    // Determine next schedule change based on current schedule
    if (hour >= 8 && hour < 16) {
        // Currently in sleep time, next is transition
        const nextHour = 16;
        const hoursLeft = nextHour - hour - 1;
        const minutesLeft = 59 - minute;
        const secondsLeft = 59 - second;
        nextChange = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    } else if (hour >= 16 && hour < 20) {
        // Currently in transition, next is study
        const nextHour = 20;
        const hoursLeft = nextHour - hour - 1;
        const minutesLeft = 59 - minute;
        const secondsLeft = 59 - second;
        nextChange = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    } else if (hour >= 20 || hour < 4) {
        // Currently in study, next is wind down
        const nextHour = hour < 4 ? 4 : 4;
        const hoursLeft = (nextHour + 24 - hour - 1) % 24;
        const minutesLeft = 59 - minute;
        const secondsLeft = 59 - second;
        nextChange = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    } else if (hour >= 4 && hour < 8) {
        // Currently in wind down, next is sleep
        const nextHour = 8;
        const hoursLeft = nextHour - hour - 1;
        const minutesLeft = 59 - minute;
        const secondsLeft = 59 - second;
        nextChange = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    }

    // Update DOM
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = nextChange;
    }
}

// Load saved schedule from localStorage
function loadSavedSchedule() {
    const savedSchedule = localStorage.getItem('messiahStudySchedule');

    if (savedSchedule) {
        currentSchedule = JSON.parse(savedSchedule);

        // Update input values
        document.getElementById('sleepStart').value = currentSchedule.sleepStart;
        document.getElementById('sleepEnd').value = currentSchedule.sleepEnd;
        document.getElementById('studyStart').value = currentSchedule.studyStart;
        document.getElementById('studyEnd').value = currentSchedule.studyEnd;

        // Update summary cards
        updateSummaryCards();
    }
}

// Save schedule to localStorage
function saveSchedule() {
    // Get values from inputs
    currentSchedule = {
        sleepStart: document.getElementById('sleepStart').value,
        sleepEnd: document.getElementById('sleepEnd').value,
        studyStart: document.getElementById('studyStart').value,
        studyEnd: document.getElementById('studyEnd').value
    };

    // Save to localStorage
    localStorage.setItem('messiahStudySchedule', JSON.stringify(currentSchedule));

    // Update timeline and summary
    updateTimeline();
    updateSummaryCards();

    // Show success message
    showNotification('Schedule saved successfully!', 'success');

    // Update countdown
    updateCountdown();
}

// Reset schedule to default
function resetSchedule() {
    currentSchedule = {
        sleepStart: "08:00",
        sleepEnd: "16:00",
        studyStart: "20:00",
        studyEnd: "04:00"
    };

    // Update input values
    document.getElementById('sleepStart').value = currentSchedule.sleepStart;
    document.getElementById('sleepEnd').value = currentSchedule.sleepEnd;
    document.getElementById('studyStart').value = currentSchedule.studyStart;
    document.getElementById('studyEnd').value = currentSchedule.studyEnd;

    // Save to localStorage
    localStorage.setItem('messiahStudySchedule', JSON.stringify(currentSchedule));

    // Update timeline and summary
    updateTimeline();
    updateSummaryCards();

    // Show notification
    showNotification('Schedule reset to default!', 'info');

    // Update countdown
    updateCountdown();
}

// Update summary cards with current schedule
function updateSummaryCards() {
    const summaryCards = document.querySelectorAll('.summary-value');

    if (summaryCards.length >= 3) {
        summaryCards[0].textContent = `${currentSchedule.sleepStart} - ${currentSchedule.sleepEnd}`;
        summaryCards[1].textContent = `${currentSchedule.studyStart} - ${currentSchedule.studyEnd}`;
    }
}

// Update timeline with current schedule
function updateTimeline() {
    // Parse times
    const sleepStart = parseTime(currentSchedule.sleepStart);
    const sleepEnd = parseTime(currentSchedule.sleepEnd);
    const studyStart = parseTime(currentSchedule.studyStart);
    const studyEnd = parseTime(currentSchedule.studyEnd);

    // Update timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length >= 6) {
        // Sleep time
        timelineItems[0].querySelector('.timeline-time').textContent =
            `${formatTimeForDisplay(sleepStart)} - ${formatTimeForDisplay(sleepEnd)}`;

        // Transition time (between sleep and study)
        timelineItems[1].querySelector('.timeline-time').textContent =
            `${formatTimeForDisplay(sleepEnd)} - ${formatTimeForDisplay(studyStart)}`;

        // Study block 1
        const studyMidpoint = calculateMidpoint(studyStart, studyEnd);
        timelineItems[2].querySelector('.timeline-time').textContent =
            `${formatTimeForDisplay(studyStart)} - ${formatTimeForDisplay(studyMidpoint)}`;

        // Break
        timelineItems[3].querySelector('.timeline-time').textContent =
            `${formatTimeForDisplay(studyMidpoint)} - ${formatTimeForDisplay(addMinutes(studyMidpoint, 60))}`;

        // Study block 2
        const afterBreak = addMinutes(studyMidpoint, 60);
        timelineItems[4].querySelector('.timeline-time').textContent =
            `${formatTimeForDisplay(afterBreak)} - ${formatTimeForDisplay(studyEnd)}`;

        // Wind down
        timelineItems[5].querySelector('.timeline-time').textContent =
            `${formatTimeForDisplay(studyEnd)} - ${formatTimeForDisplay(sleepStart)}`;
    }
}

// Parse time string to hours and minutes
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
}

// Format time for display
function formatTimeForDisplay(time) {
    const period = time.hours >= 12 ? 'PM' : 'AM';
    let displayHours = time.hours % 12;
    if (displayHours === 0) displayHours = 12;

    return `${displayHours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')} ${period}`;
}

// Calculate midpoint between two times
function calculateMidpoint(start, end) {
    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;

    // Handle overnight case
    const totalMinutes = endMinutes < startMinutes ?
        (endMinutes + 24 * 60) - startMinutes :
        endMinutes - startMinutes;

    const midpointMinutes = startMinutes + Math.floor(totalMinutes / 2);

    return {
        hours: Math.floor(midpointMinutes / 60) % 24,
        minutes: midpointMinutes % 60
    };
}

// Add minutes to a time
function addMinutes(time, minutesToAdd) {
    const totalMinutes = time.hours * 60 + time.minutes + minutesToAdd;

    return {
        hours: Math.floor(totalMinutes / 60) % 24,
        minutes: totalMinutes % 60
    };
}

// Animate luxury items
function animateLuxuryItems() {
    const luxuryItems = document.querySelectorAll('.luxury-item');

    luxuryItems.forEach((item, index) => {
        // Add delay based on index
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('animate-pulse');
    });
}

// Setup notifications
function setupNotifications() {
    // Check if notifications are scheduled for today
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    const today = new Date().toDateString();

    if (lastNotificationDate !== today) {
        // Schedule daily notification
        setTimeout(() => {
            showNotification('Daily Reminder: Stay focused on your goals. Avoid daytime distractions!', 'info');
            localStorage.setItem('lastNotificationDate', today);
        }, 3000);
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add keyframes for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Add close button event listener
    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS for animate-pulse class
const animatePulseStyle = document.createElement('style');
animatePulseStyle.textContent = `
    .animate-pulse {
        animation: pulse-animation 2s infinite;
    }

    @keyframes pulse-animation {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(animatePulseStyle);