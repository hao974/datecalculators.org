document.addEventListener('DOMContentLoaded', function() {
    // Initialize date inputs with today's date
    initializeDateInputs();
    
    // Set up tab switching
    setupTabs();
    
    // Set up accordion for FAQs
    setupAccordion();
    
    // Set up theme toggle
    setupThemeToggle();
    
    // Set up event listeners for all calculators
    setupCalculators();
    
    // Set up milestone options
    setupMilestoneOptions();
    
    // Set up moment templates
    setupMomentTemplates();
    
    // Set up life visualization
    setupLifeVisualization();
});

/**
 * Initializes all date inputs with appropriate default values
 */
function initializeDateInputs() {
    const today = new Date();
    const todayFormatted = formatDateForInput(today);
    
    // Set default values for date inputs
    document.getElementById('startDate').value = todayFormatted;
    
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7); // Default to 7 days later
    document.getElementById('endDate').value = formatDateForInput(endDate);
    
    document.getElementById('baseDate').value = todayFormatted;
    document.getElementById('weekdayDate').value = todayFormatted;
    
    // Set birth date to 25 years ago as a default
    const birthDate = new Date();
    birthDate.setFullYear(today.getFullYear() - 25);
    document.getElementById('birthDate').value = formatDateForInput(birthDate);
    
    // Set default value for days to add/subtract
    document.getElementById('daysToAddSubtract').value = 30;
}

/**
 * Formats a Date object into YYYY-MM-DD format for input elements
 */
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Sets up tab switching functionality
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Sets up accordion functionality for FAQs
 */
function setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Toggle active class on the clicked item
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, make it active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Sets up theme toggle functionality
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if theme preference is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Apply theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', () => {
        // Toggle dark theme class on body
        document.body.classList.toggle('dark-theme');
        
        // Save preference to localStorage
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
}

/**
 * Sets up all calculator functionalities
 */
function setupCalculators() {
    // Setup date difference calculator
    setupDateDifferenceCalculator();
    
    // Setup add/subtract days calculator
    setupAddSubtractDaysCalculator();
    
    // Setup weekday finder
    setupWeekdayFinder();
    
    // Setup age calculator
    setupAgeCalculator();
}

/**
 * Sets up the date difference calculator
 */
function setupDateDifferenceCalculator() {
    const calculateDiffBtn = document.getElementById('calculateDiff');
    
    calculateDiffBtn.addEventListener('click', () => {
        const startDateStr = document.getElementById('startDate').value;
        const endDateStr = document.getElementById('endDate').value;
        
        if (!startDateStr || !endDateStr) {
            showResult('diffResult', 'Please select both start and end dates.');
            return;
        }
        
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        
        // Calculate the difference in various units
        const diffResult = calculateDateDifference(startDate, endDate);
        
        // Display the result
        showResult('diffResult', `
            <div class="result-detail">
                <div class="result-item">
                    <span class="result-number">${diffResult.days}</span>
                    <span class="result-label">Days</span>
                </div>
                <div class="result-item">
                    <span class="result-number">${diffResult.weeks.toFixed(1)}</span>
                    <span class="result-label">Weeks</span>
                </div>
                <div class="result-item">
                    <span class="result-number">${diffResult.months.toFixed(1)}</span>
                    <span class="result-label">Months</span>
                </div>
                <div class="result-item">
                    <span class="result-number">${diffResult.years.toFixed(2)}</span>
                    <span class="result-label">Years</span>
                </div>
            </div>
            <div class="meaning-prompt">
                ${generateMeaningPrompt(diffResult.days, startDate, endDate)}
            </div>
        `);
        
        // Show milestone options if appropriate
        if (diffResult.days > 30) {
            showMilestoneOptions(startDate, endDate, diffResult.days);
        }
    });
}

/**
 * Generates a meaning prompt based on the time difference
 */
function generateMeaningPrompt(days, startDate, endDate) {
    // Different prompts based on the time span
    if (days < 0) {
        return "Looking back on time that has passed can help us reflect on our journey and growth.";
    } else if (days === 0) {
        return "Today is a gift. That's why it's called the present.";
    } else if (days < 7) {
        return "A week can hold so many possibilities. What small joy can you plan for each day?";
    } else if (days < 30) {
        return "A month is enough time to build a new habit or start a mini project. What would you like to accomplish?";
    } else if (days < 90) {
        return "This season of your life has purpose. What would make this time meaningful for you?";
    } else if (days < 365) {
        return "Within a year, you can transform many aspects of your life. What seeds will you plant today?";
    } else {
        const years = Math.floor(days / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} is a significant chapter in your life story. How would you like this chapter to be remembered?`;
    }
}

/**
 * Shows milestone options based on the time period
 */
function showMilestoneOptions(startDate, endDate, days) {
    const milestoneContainer = document.createElement('div');
    milestoneContainer.className = 'milestone-options';
    
    let milestones = [];
    
    if (days > 30 && days < 365) {
        milestones = [
            "Learn a new skill",
            "Read 5 books",
            "Daily meditation",
            "Weekly nature walks",
            "Connect with old friends"
        ];
    } else if (days >= 365 && days < 1825) { // 1-5 years
        milestones = [
            "Career advancement",
            "Travel to new places",
            "Master a language",
            "Build meaningful relationships",
            "Improve health & fitness"
        ];
    } else { // 5+ years
        milestones = [
            "Major life transition",
            "Legacy project",
            "Financial freedom",
            "Personal transformation",
            "Mentor others"
        ];
    }
    
    milestones.forEach(milestone => {
        const option = document.createElement('div');
        option.className = 'milestone-option';
        option.textContent = milestone;
        option.addEventListener('click', () => {
            document.querySelectorAll('.milestone-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Show reflection prompt
            showReflection(milestone, days);
        });
        milestoneContainer.appendChild(option);
    });
    
    // Add to result
    const resultElement = document.getElementById('diffResult');
    
    // Check if milestone options already exist
    const existingOptions = resultElement.querySelector('.milestone-options');
    if (existingOptions) {
        existingOptions.remove();
    }
    
    // Check if reflection already exists
    const existingReflection = resultElement.querySelector('.reflection');
    if (existingReflection) {
        existingReflection.remove();
    }
    
    resultElement.appendChild(milestoneContainer);
}

/**
 * Shows a reflection prompt based on the selected milestone
 */
function showReflection(milestone, days) {
    const resultElement = document.getElementById('diffResult');
    
    // Remove existing reflection if any
    const existingReflection = resultElement.querySelector('.reflection');
    if (existingReflection) {
        existingReflection.remove();
    }
    
    const reflection = document.createElement('div');
    reflection.className = 'reflection';
    
    // Generate reflection prompt based on milestone
    let reflectionText = "";
    if (milestone.includes("skill") || milestone.includes("language")) {
        reflectionText = `Learning something new can transform how we see the world. What small steps could you take each day towards mastering ${milestone.toLowerCase()}?`;
    } else if (milestone.includes("book")) {
        reflectionText = "Books open new worlds and perspectives. Which titles have been on your reading list the longest?";
    } else if (milestone.includes("meditation") || milestone.includes("health")) {
        reflectionText = "Investing in your wellbeing creates ripples through all areas of your life. How might this practice change your daily experience?";
    } else if (milestone.includes("nature") || milestone.includes("travel")) {
        reflectionText = "New environments refresh our perspective. What places call to your spirit of adventure?";
    } else if (milestone.includes("connect") || milestone.includes("relationship")) {
        reflectionText = "Our connections give life meaning. Who are the people you want to prioritize in this chapter?";
    } else if (milestone.includes("career") || milestone.includes("financial")) {
        reflectionText = "Work can be a source of purpose and growth. What would make this professional chapter fulfilling for you?";
    } else if (milestone.includes("legacy") || milestone.includes("mentor")) {
        reflectionText = "What wisdom or values do you hope to pass on to others? Your influence can span generations.";
    } else {
        reflectionText = `This time period of ${Math.floor(days/30)} months is precious. How will you make it count?`;
    }
    
    reflection.textContent = reflectionText;
    resultElement.appendChild(reflection);
    
    // Show the reflection with a fade-in effect
    setTimeout(() => {
        reflection.style.display = 'block';
    }, 100);
}

/**
 * Calculates the difference between two dates in various units
 */
function calculateDateDifference(startDate, endDate) {
    // Calculate difference in milliseconds
    const diffMs = endDate - startDate;
    
    // Convert to days
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Convert to other units
    const weeks = days / 7;
    const months = days / 30.44; // Average days in a month
    const years = days / 365.25; // Account for leap years
    
    return { days, weeks, months, years };
}

/**
 * Sets up the add/subtract days calculator
 */
function setupAddSubtractDaysCalculator() {
    const addDaysBtn = document.getElementById('addDays');
    const subtractDaysBtn = document.getElementById('subtractDays');
    
    addDaysBtn.addEventListener('click', () => {
        calculateNewDate(true);
    });
    
    subtractDaysBtn.addEventListener('click', () => {
        calculateNewDate(false);
    });
}

/**
 * Calculates a new date by adding or subtracting days
 */
function calculateNewDate(isAdd) {
    const baseDateStr = document.getElementById('baseDate').value;
    const daysValue = document.getElementById('daysToAddSubtract').value;
    
    if (!baseDateStr || !daysValue) {
        showResult('addSubtractResult', 'Please enter a base date and number of days.');
        return;
    }
    
    const baseDate = new Date(baseDateStr);
    const days = parseInt(daysValue);
    
    if (isNaN(days)) {
        showResult('addSubtractResult', 'Please enter a valid number of days.');
        return;
    }
    
    // Calculate new date
    const newDate = new Date(baseDate);
    if (isAdd) {
        newDate.setDate(baseDate.getDate() + days);
    } else {
        newDate.setDate(baseDate.getDate() - days);
    }
    
    // Format the dates for display
    const formattedBaseDate = formatDateForDisplay(baseDate);
    const formattedNewDate = formatDateForDisplay(newDate);
    const weekday = getWeekdayName(newDate);
    
    // Display result
    const operation = isAdd ? 'Adding' : 'Subtracting';
    showResult('addSubtractResult', `
        <div class="result-date">${formattedNewDate}</div>
        <div class="result-day">${weekday}</div>
        <div class="result-detail">
            <div class="result-item">
                <span class="result-label">${operation} ${days} days to ${formattedBaseDate}</span>
            </div>
        </div>
        ${getHistoricalContext(newDate)}
        <div class="day-significance">
            ${getDaySignificance(newDate)}
        </div>
    `);
}

/**
 * Gets historical context for a date
 */
function getHistoricalContext(date) {
    const month = date.getMonth();
    const day = date.getDate();
    
    // Sample historical events for each month/day combination
    const events = {
        "0-1": "This day in 1892: Ellis Island began processing immigrants",
        "1-14": "This day in 1929: The St. Valentine's Day Massacre",
        "2-17": "This day in 461: Saint Patrick died",
        "3-15": "This day in 1912: The Titanic sank",
        "4-8": "This day in 1945: VE Day (Victory in Europe Day)",
        "5-6": "This day in 1944: D-Day landings in Normandy",
        "6-4": "This day in 1776: US Declaration of Independence signed",
        "7-6": "This day in 1945: Atomic bomb dropped on Hiroshima",
        "8-11": "This day in 2001: 9/11 terrorist attacks",
        "9-31": "This day in 1517: Martin Luther posted his 95 Theses",
        "10-11": "This day in 1918: End of World War I",
        "11-25": "Traditional Christmas Day celebration"
    };
    
    const key = `${month}-${day}`;
    
    if (events[key]) {
        return `<div class="historical-context">${events[key]}</div>`;
    } else {
        // Return a random event if specific date not found
        const keys = Object.keys(events);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return `<div class="historical-context">${events[randomKey]}</div>`;
    }
}

/**
 * Gets significance for a particular day
 */
function getDaySignificance(date) {
    const weekday = date.getDay();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Special days
    if (month === 0 && day === 1) return "New Year's Day - A perfect time for fresh starts and new intentions.";
    if (month === 11 && day === 25) return "Christmas Day - A time for connection, giving, and reflection.";
    if (month === 1 && day === 14) return "Valentine's Day - Celebrate love in all its forms.";
    
    // Weekday significance
    const weekdayMeanings = [
        "Sundays are perfect for rest, reflection, and preparation for the week ahead.",
        "Mondays offer the energy of new beginnings and fresh starts.",
        "Tuesdays bring productivity and momentum to your projects.",
        "Wednesdays mark the middle of the week - a good time to evaluate progress.",
        "Thursdays carry anticipation and the energy to complete what you've started.",
        "Fridays bring a sense of accomplishment and transition to personal time.",
        "Saturdays offer freedom for creativity, connection, and joy."
    ];
    
    return weekdayMeanings[weekday];
}

/**
 * Sets up the weekday finder
 */
function setupWeekdayFinder() {
    const findWeekdayBtn = document.getElementById('findWeekday');
    
    findWeekdayBtn.addEventListener('click', () => {
        const dateStr = document.getElementById('weekdayDate').value;
        
        if (!dateStr) {
            showResult('weekdayResult', 'Please select a date.');
            return;
        }
        
        const date = new Date(dateStr);
        const weekday = getWeekdayName(date);
        const formattedDate = formatDateForDisplay(date);
        
        showResult('weekdayResult', `
            <div class="result-date">${formattedDate}</div>
            <div class="result-day">${weekday}</div>
            <div class="day-significance">
                ${getDaySignificance(date)}
            </div>
        `);
    });
}

/**
 * Gets the name of the weekday for a given date
 */
function getWeekdayName(date) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
}

/**
 * Sets up the age calculator
 */
function setupAgeCalculator() {
    const calculateAgeBtn = document.getElementById('calculateAge');
    
    calculateAgeBtn.addEventListener('click', () => {
        const birthDateStr = document.getElementById('birthDate').value;
        
        if (!birthDateStr) {
            showResult('ageResult', 'Please select a birth date.');
            return;
        }
        
        const birthDate = new Date(birthDateStr);
        const today = new Date();
        
        // Check if birth date is in the future
        if (birthDate > today) {
            showResult('ageResult', 'Birth date cannot be in the future.');
            return;
        }
        
        // Calculate age details
        const ageDetails = calculateAge(birthDate, today);
        
        // Display result
        showResult('ageResult', `
            <div class="result-detail">
                <div class="result-item">
                    <span class="result-number">${ageDetails.years}</span>
                    <span class="result-label">Years</span>
                </div>
                <div class="result-item">
                    <span class="result-number">${ageDetails.months}</span>
                    <span class="result-label">Months</span>
                </div>
                <div class="result-item">
                    <span class="result-number">${ageDetails.days}</span>
                    <span class="result-label">Days</span>
                </div>
                <div class="result-item">
                    <span class="result-number">${ageDetails.totalDays.toLocaleString()}</span>
                    <span class="result-label">Total Days</span>
                </div>
            </div>
            <div class="meaning-prompt">
                ${generateAgeMeaningPrompt(ageDetails.years)}
            </div>
            <div id="lifeVisualization" class="life-visualization"></div>
        `);
        
        // Create life visualization
        createLifeVisualization(ageDetails.years, ageDetails.totalDays);
    });
}

/**
 * Generates a meaning prompt based on age
 */
function generateAgeMeaningPrompt(years) {
    if (years < 13) {
        return "Childhood is a time of wonder and discovery. Every day brings new learning and growth.";
    } else if (years < 20) {
        return "The teenage years shape our identity. What values and passions are becoming important to you?";
    } else if (years < 30) {
        return "Your twenties are for exploration and building foundations. What paths are you curious about?";
    } else if (years < 40) {
        return "Your thirties often bring focus and deepening expertise. What legacy are you beginning to build?";
    } else if (years < 50) {
        return "Your forties can be a time of mastery and mentorship. How are you sharing your wisdom?";
    } else if (years < 60) {
        return "The fifties often bring perspective and integration. How are your life experiences connecting?";
    } else if (years < 70) {
        return "Your sixties can bring renewed freedom and purpose. What dreams are still calling to you?";
    } else if (years < 80) {
        return "The seventies offer wisdom and the chance to savor life's simple joys. What brings you peace?";
    } else {
        return "Your life holds decades of wisdom and experience. What insights would you share with younger generations?";
    }
}

/**
 * Creates a visual representation of life in weeks
 */
function createLifeVisualization(years, daysPassed) {
    const container = document.getElementById('lifeVisualization');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create dots representing weeks in a 90-year life
    const totalWeeks = 90 * 52; // 90 years in weeks
    const weeksPassed = Math.floor(daysPassed / 7);
    
    // Create a limited number of dots for performance
    const maxDots = 520; // Show 10 years of weeks
    const startWeek = Math.max(0, weeksPassed - maxDots/2);
    
    for (let i = startWeek; i < startWeek + maxDots && i < totalWeeks; i++) {
        const dot = document.createElement('div');
        dot.className = 'life-dot';
        if (i < weeksPassed) {
            dot.classList.add('lived');
        }
        container.appendChild(dot);
    }
    
    // Add explanation text
    const explanation = document.createElement('p');
    explanation.textContent = `Each dot represents a week. You've lived approximately ${weeksPassed.toLocaleString()} weeks.`;
    explanation.style.fontSize = '0.8em';
    explanation.style.marginTop = '10px';
    explanation.style.textAlign = 'center';
    container.appendChild(explanation);
}

/**
 * Calculates age from birth date to current date
 */
function calculateAge(birthDate, currentDate) {
    // Calculate total days
    const diffMs = currentDate - birthDate;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, and remaining days
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        // Get the last day of the previous month
        const lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        ).getDate();
        
        days += lastDayOfMonth;
        months--;
    }
    
    // Adjust for negative months
    if (months < 0) {
        months += 12;
        years--;
    }
    
    return { years, months, days, totalDays };
}

/**
 * Sets up milestone options selection
 */
function setupMilestoneOptions() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('milestone-option')) {
            document.querySelectorAll('.milestone-option').forEach(option => {
                option.classList.remove('selected');
            });
            e.target.classList.add('selected');
        }
    });
}

/**
 * Sets up moment templates for sharing
 */
function setupMomentTemplates() {
    // Add event listeners to moment template buttons if they exist
    const templateButtons = document.querySelectorAll('.moment-template');
    
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            const resultElement = document.querySelector('.result:not(:empty)');
            
            if (resultElement) {
                // Get the date from the result
                const dateElement = resultElement.querySelector('.result-date');
                let dateText = '';
                
                if (dateElement) {
                    dateText = dateElement.textContent;
                } else {
                    // Try to get from other elements if result-date doesn't exist
                    const valueElement = resultElement.querySelector('.result-value');
                    if (valueElement) {
                        dateText = valueElement.textContent;
                    }
                }
                
                // Create sharing text based on template
                let sharingText = '';
                switch(template) {
                    case 'countdown':
                        sharingText = `I'm counting down to ${dateText}! Every day brings me closer to this special moment.`;
                        break;
                    case 'milestone':
                        sharingText = `${dateText} marks an important milestone for me. Time has a way of showing what matters most.`;
                        break;
                    case 'reflection':
                        sharingText = `Reflecting on ${dateText} - a day that changed my perspective. Time teaches us what truly matters.`;
                        break;
                    case 'gratitude':
                        sharingText = `Feeling grateful for ${dateText} and all the moments that have led me here. Time is our most precious gift.`;
                        break;
                    default:
                        sharingText = `Thinking about ${dateText} and the journey of time. Every moment matters.`;
                }
                
                // Create a temporary textarea to copy the text
                const textarea = document.createElement('textarea');
                textarea.value = sharingText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                // Show feedback
                alert('Moment template copied to clipboard! Share it with your friends.');
            }
        });
    });
}

/**
 * Sets up life visualization
 */
function setupLifeVisualization() {
    // This is handled in the calculateAge function
    // but could be expanded for standalone visualization
}

/**
 * Formats a date for display (e.g., "March 15, 2023")
 */
function formatDateForDisplay(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Shows the result in the specified result element
 */
function showResult(resultId, content) {
    const resultElement = document.getElementById(resultId);
    resultElement.innerHTML = `<h3>Results</h3>${content}`;
    resultElement.classList.add('active');
    
    // Scroll to result
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
