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
            <div class="result-item">
                <span class="result-label">Days:</span> 
                <span class="result-value">${diffResult.days}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Weeks:</span> 
                <span class="result-value">${diffResult.weeks.toFixed(1)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Months:</span> 
                <span class="result-value">${diffResult.months.toFixed(1)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Years:</span> 
                <span class="result-value">${diffResult.years.toFixed(2)}</span>
            </div>
        `);
    });
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
    
    // Display result
    const operation = isAdd ? 'Adding' : 'Subtracting';
    showResult('addSubtractResult', `
        <div class="result-item">
            <span class="result-label">${operation} ${days} days to ${formattedBaseDate}</span>
        </div>
        <div class="result-item">
            <span class="result-label">New Date:</span> 
            <span class="result-value">${formattedNewDate}</span>
        </div>
    `);
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
            <div class="result-item">
                <span class="result-label">${formattedDate} falls on:</span> 
                <span class="result-value">${weekday}</span>
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
            <div class="result-item">
                <span class="result-label">Years:</span> 
                <span class="result-value">${ageDetails.years}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Months:</span> 
                <span class="result-value">${ageDetails.months}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Days:</span> 
                <span class="result-value">${ageDetails.days}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Days:</span> 
                <span class="result-value">${ageDetails.totalDays}</span>
            </div>
        `);
    });
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
    resultElement.innerHTML = content;
    resultElement.classList.add('active');
    
    // Scroll to result
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
