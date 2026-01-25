const STORAGE_KEY = 'beehta_itinerary_data';
const THEME_KEY = 'beehta_itinerary_theme';

// --- Dynamic Date Generation Logic ---
const getFutureDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
};

const formatDayInfo = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    
    return {
        fullDate: `${day}/${month}/${year}`, // DD/MM/YYYY
        weekday: weekday,
        short: shortDate, // e.g., Jan 17
        year: year
    };
};

// Calculate dates for a 3-day trip starting 30 days from now
const d1 = formatDayInfo(getFutureDate(30));
const d2 = formatDayInfo(getFutureDate(31));
const d3 = formatDayInfo(getFutureDate(32));
// -------------------------------------

const originalData = {
    title: "International Tour",
    // e.g. "May 01 - May 03, 2026"
    dates: `${d1.short} - ${d3.short}, ${d3.year}`, 
    organizer: "Global Travels",
    contacts: "9999999999, 8888888888",
    days: [
        {
            // e.g. "Day 1: Friday, 01/05/2026"
            title: `Day 1: ${d1.weekday}, ${d1.fullDate}`,
            activities: [
                { time: "04:00 AM", description: "Report at International Airport Terminal." },
                { time: "07:00 AM", description: "Flight departs to Destination." },
                { time: "01:00 PM", description: "Arrive at Destination Airport." },
                { time: "02:30 PM", description: "Transfer to Hotel & Check-in." },
                { time: "05:00 PM", description: "Evening City Walking Tour." },
                { time: "08:00 PM", description: "Dinner at City Center." },
                { time: "10:00 PM", description: "Return to Hotel. Stay." }
            ]
        },
        {
            title: `Day 2: ${d2.weekday}, ${d2.fullDate}`,
            activities: [
                { time: "08:00 AM", description: "Breakfast at Hotel." },
                { 
                    time: "09:00 AM", 
                    description: "Visit Major Landmarks & Museum:",
                    subItems: [
                        "Historic City Center",
                        "Famous National Park",
                        "Grand Monument"
                    ]
                },
                { time: "01:00 PM", description: "Lunch at Local Cuisine Restaurant." },
                { time: "03:00 PM", description: "Visit Scenic Viewpoint / River Cruise." },
                { time: "06:00 PM", description: "Shopping at Famous Market Square." },
                { time: "09:00 PM", description: "Gala Dinner with Cultural Show." }
            ]
        },
        {
            title: `Day 3: ${d3.weekday}, ${d3.fullDate}`,
            activities: [
                { time: "08:00 AM", description: "Breakfast & Hotel Checkout." },
                { time: "10:00 AM", description: "Free time for leisure / Last minute shopping." },
                { time: "12:00 PM", description: "Proceed to Airport." },
                { time: "03:00 PM", description: "Flight departs to Home Country." },
                { time: "09:00 PM", description: "Arrive at Home Airport." }
            ]
        },
    ],
    sections: [
        {
            title: "Important Instructions",
            items: [
                { 
                    title: "Documents", 
                    description: "Carry Original Passport and Visa copies." 
                },
                { 
                    title: "Currency", 
                    description: "Carry sufficient Forex/Cash for personal expenses." 
                },
                { 
                    title: "Weather", 
                    description: "Check weather forecast and pack accordingly." 
                },
                { 
                    title: "Contact", 
                    description: "Keep the organizer's contact number handy." 
                }
            ]
        }
    ],
    footer: "Have a Safe Journey! ✈️ \"Travel is Life\""
};

let data = JSON.parse(JSON.stringify(originalData));
let collapsedSections = {};
let autoSaveTimeout = null;

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
    toggleMenu();
}

function updateThemeIcon(theme) {
    const iconContainer = document.getElementById('themeIcon');
    if (iconContainer) {
        if (theme === 'light') {
            iconContainer.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        } else {
            iconContainer.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        }
    }
}

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function resetToOriginal() {
    if (confirm('Are you sure you want to reset all data to original? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        // We re-clone originalData, which already has the calculated future dates
        data = JSON.parse(JSON.stringify(originalData));
        collapsedSections = {};
        render();
        showToast('Reset to original data!', 'success');
        toggleMenu();
    }
}

function startBlank() {
    if (confirm('Are you sure you want to start with blank data? This will clear all current content.')) {
        localStorage.removeItem(STORAGE_KEY);
        data = {
            title: '',
            dates: '',
            organizer: '',
            contacts: '',
            days: [],
            sections: [],
            footer: ''
        };
        collapsedSections = {};
        render();
        showToast('Started with blank data!', 'success');
        toggleMenu();
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('dropdownMenu');
    const hamburger = document.getElementById('hamburgerBtn');
    if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('show');
    }
});

function toggleSection(id) {
    collapsedSections[id] = !collapsedSections[id];
    render();
}

function saveData() {
    try {
        const state = {
            title: document.getElementById('title')?.value || '',
            dates: document.getElementById('dates')?.value || '',
            organizer: document.getElementById('organizer')?.value || '',
            contacts: document.getElementById('contacts')?.value || '',
            days: [],
            sections: [],
            footer: document.getElementById('footer')?.value || ''
        };

        document.querySelectorAll('.day-section').forEach(dayEl => {
            const dayTitle = dayEl.querySelector('.day-title');
            if (!dayTitle) return;
            
            const day = {
                title: dayTitle.value,
                activities: []
            };
            
            dayEl.querySelectorAll('.activity-item').forEach(actEl => {
                const timeInput = actEl.querySelector('.activity-time');
                const descInput = actEl.querySelector('.activity-desc');
                
                if (!timeInput || !descInput) return;
                
                const activity = {
                    time: timeInput.value,
                    description: descInput.value
                };
                
                const subItems = actEl.querySelectorAll('.sub-item-input');
                if (subItems.length > 0) {
                    activity.subItems = Array.from(subItems).map(s => s.value);
                }
                
                day.activities.push(activity);
            });
            
            state.days.push(day);
        });

        document.querySelectorAll('.custom-section').forEach(secEl => {
            const sectionTitle = secEl.querySelector('.section-title-input');
            if (!sectionTitle) return;
            
            const section = {
                title: sectionTitle.value,
                items: []
            };
            
            secEl.querySelectorAll('.instruction-item').forEach(itemEl => {
                const titleInput = itemEl.querySelector('.instruction-title-input');
                const descInput = itemEl.querySelector('.instruction-desc-input');
                
                if (titleInput && descInput) {
                    section.items.push({
                        title: titleInput.value,
                        description: descInput.value
                    });
                }
            });
            
            state.sections.push(section);
        });

        data = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        showToast('Saved successfully!', 'success');
    } catch (e) {
        console.error('Save error:', e);
        showToast('Failed to save', 'fail');
    }
}

function autoSave() {
    try {
        const state = {
            title: document.getElementById('title')?.value || '',
            dates: document.getElementById('dates')?.value || '',
            organizer: document.getElementById('organizer')?.value || '',
            contacts: document.getElementById('contacts')?.value || '',
            days: [],
            sections: [],
            footer: document.getElementById('footer')?.value || ''
        };

        document.querySelectorAll('.day-section').forEach(dayEl => {
            const dayTitle = dayEl.querySelector('.day-title');
            if (!dayTitle) return;
            
            const day = {
                title: dayTitle.value,
                activities: []
            };
            
            dayEl.querySelectorAll('.activity-item').forEach(actEl => {
                const timeInput = actEl.querySelector('.activity-time');
                const descInput = actEl.querySelector('.activity-desc');
                
                if (!timeInput || !descInput) return;
                
                const activity = {
                    time: timeInput.value,
                    description: descInput.value
                };
                
                const subItems = actEl.querySelectorAll('.sub-item-input');
                if (subItems.length > 0) {
                    activity.subItems = Array.from(subItems).map(s => s.value);
                }
                
                day.activities.push(activity);
            });
            
            state.days.push(day);
        });

        document.querySelectorAll('.custom-section').forEach(secEl => {
            const sectionTitle = secEl.querySelector('.section-title-input');
            if (!sectionTitle) return;
            
            const section = {
                title: sectionTitle.value,
                items: []
            };
            
            secEl.querySelectorAll('.instruction-item').forEach(itemEl => {
                const titleInput = itemEl.querySelector('.instruction-title-input');
                const descInput = itemEl.querySelector('.instruction-desc-input');
                
                if (titleInput && descInput) {
                    section.items.push({
                        title: titleInput.value,
                        description: descInput.value
                    });
                }
            });
            
            state.sections.push(section);
        });

        data = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Auto-save error:', e);
    }
}

function scheduleAutoSave() {
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    autoSaveTimeout = setTimeout(() => {
        autoSave();
    }, 500);
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                data = parsed;
                if (typeof data.contacts !== 'string') data.contacts = '';
                if (!Array.isArray(data.days)) data.days = [];
                if (!Array.isArray(data.sections)) data.sections = [];
            }
        } catch (e) {
            console.error('Error loading data:', e);
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}

function showToast(message, mode) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    if(mode === 'fail') toast.style.background='#dc3545';
    else toast.style.background='#42b72a';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setupAutoSaveListeners() {
    const content = document.getElementById('content');
    
    content.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea')) {
            scheduleAutoSave();
        }
    });
    
    content.addEventListener('blur', (e) => {
        if (e.target.matches('input, textarea')) {
            autoSave();
        }
    }, true);
}

function render() {
    const content = document.getElementById('content');
    
    let html = `
        <div class="section">
            <div class="section-controls">
                <button class="collapse-btn" onclick="toggleSection('basic')">
                    <span class="collapse-icon ${collapsedSections['basic'] ? 'collapsed' : ''}">▼</span>
                </button>
                <div class="section-header">
                    <div class="form-label">Basic Information</div>
                </div>
            </div>
            <div class="section-body ${collapsedSections['basic'] ? 'collapsed' : ''}">
                <div class="form-group">
                    <label class="form-label">Itinerary Title</label>
                    <input type="text" id="title" value="${escapeHtml(data.title || '')}" placeholder="Itinerary Title">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Dates</label>
                    <input type="text" id="dates" value="${escapeHtml(data.dates || '')}" placeholder="Date range">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Organizer</label>
                    <input type="text" id="organizer" value="${escapeHtml(data.organizer || '')}" placeholder="Organizer name">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Contact Numbers (comma-separated)</label>
                    <input type="text" id="contacts" value="${escapeHtml(data.contacts || '')}" placeholder="e.g., 9500008901, 9500025901">
                </div>
            </div>
        </div>
        <div class="separator"></div>
    `;

    data.days.forEach((day, dayIdx) => {
        const dayClass = dayIdx % 2 === 0 ? 'day-odd' : 'day-even';
        const dayNumber = dayIdx + 1;

        html += `
            <div class="section day-section ${dayClass}">
                <div class="count-number">day ${dayNumber}</div>
                <div class="section-controls no-border-bottom">
                    <button class="collapse-btn" onclick="toggleSection('day-${dayIdx}')">
                        <span class="collapse-icon ${collapsedSections['day-' + dayIdx] ? 'collapsed' : ''}">▼</span>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="removeDay(${dayIdx})">Remove Day</button>
                </div>
                <div class="section-header">
                    <label class="form-label">Day Title</label>
                    <input type="text" class="section-title day-title" value="${escapeHtml(day.title || '')}" placeholder="e.g., Day 1: Saturday, 17/01/2026">
                </div>
                <div class="section-body ${collapsedSections['day-' + dayIdx] ? 'collapsed' : ''}">
        `;
        
        day.activities.forEach((act, actIdx) => {
            const actNumber = actIdx + 1;
            html += `
                <div class="activity-item">
                    <div class="activity-count">${actNumber}</div>
                    <div class="activity-header">
                        <div style="flex: 1;">
                            <label class="form-label" style="margin-bottom: 4px;">Time</label>
                            <input type="text" class="activity-time" value="${escapeHtml(act.time || '')}" placeholder="e.g., 01:45 AM" style="width: fit-content; max-width: 180px;">
                        </div>
                        <button class="btn btn-icon" data-tooltip="Delete Activity" onclick="removeActivity(${dayIdx}, ${actIdx})">×</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <label class="form-label" style="margin-bottom: 4px;">Activity Description</label>
                        <textarea class="activity-desc" placeholder="Activity description">${escapeHtml(act.description || '')}</textarea>
                    </div>
            `;
            
            if (act.subItems && act.subItems.length > 0) {
                html += '<div class="nested-bullets">';
                act.subItems.forEach((sub, subIdx) => {
                    const subNumber = subIdx + 1;
                    html += `
                        <div class="bullet-item">
                            <div class="sub-count">${subNumber}</div>
                            <input type="text" class="sub-item-input" value="${escapeHtml(sub || '')}" placeholder="Sub-activity">
                            <button class="btn btn-icon" data-tooltip="Delete Sub-activity" onclick="removeSubItem(${dayIdx}, ${actIdx}, ${subIdx})">×</button>
                        </div>
                    `;
                });
                html += `<button class="btn btn-primary btn-small" onclick="addSubItem(${dayIdx}, ${actIdx})">+ Add Sub-activity</button></div>`;
            } else {
                html += `<button class="btn btn-primary btn-small" style="margin-top: 10px;" onclick="addSubItem(${dayIdx}, ${actIdx})">+ Add Sub-activities</button>`;
            }
            
            html += '</div>';
        });
        
        html += `
                    <button class="btn btn-primary btn-small" style="margin-top: 10px;" onclick="addActivity(${dayIdx})">+ Add Activity</button>
                </div>
            </div>
            <div class="separator"></div>
        `;
    });

    html += '<button class="btn btn-success btn-center" onclick="addDay()">+ Add Day</button><div class="separator"></div>';

    data.sections.forEach((section, secIdx) => {
        const secNumber = secIdx + 1;
        html += `
            <div class="section custom-section">
                <div class="count-number">#${secNumber}</div>
                <div class="section-controls no-border-bottom">
                    <button class="collapse-btn" onclick="toggleSection('sec-${secIdx}')">
                        <span class="collapse-icon ${collapsedSections['sec-' + secIdx] ? 'collapsed' : ''}">▼</span>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="removeSection(${secIdx})">Remove Section</button>
                </div>
                <div class="section-header">
                    <label class="form-label">Section Title</label>
                    <input type="text" class="section-title section-title-input" value="${escapeHtml(section.title || '')}" placeholder="e.g., Important Instructions">
                </div>
                <div class="section-body ${collapsedSections['sec-' + secIdx] ? 'collapsed' : ''}">
        `;
        
        section.items.forEach((item, itemIdx) => {
            const itemNumber = itemIdx + 1;
            html += `
                <div class="instruction-item">
                    <div class="instruction-count">${itemNumber}</div>
                    <div class="instruction-header">
                        <div class="instruction-content">
                            <label class="form-label" style="margin-bottom: 4px; margin-top: 30px;">Title</label>
                            <input type="text" class="instruction-title-input" value="${escapeHtml(item.title || '')}" placeholder="e.g., Identity">
                            <label class="form-label" style="margin-bottom: 4px; margin-top: 8px;">Description</label>
                            <textarea class="instruction-desc-input" placeholder="Description">${escapeHtml(item.description || '')}</textarea>
                        </div>
                        <button class="btn btn-icon" data-tooltip="Delete Item" onclick="removeSectionItem(${secIdx}, ${itemIdx})">×</button>
                    </div>
                </div>
            `;
        });
        
        html += `
                    <button class="btn btn-primary btn-small" onclick="addSectionItem(${secIdx})">+ Add Item</button>
                </div>
            </div>
            <div class="separator"></div>
        `;
    });

    html += '<button class="btn btn-success btn-center" onclick="addSection()">+ Add Section</button><div class="separator"></div>';

    html += `
        <div class="section">
            <div class="section-controls">
                <button class="collapse-btn" onclick="toggleSection('footer')">
                    <span class="collapse-icon ${collapsedSections['footer'] ? 'collapsed' : ''}">▼</span>
                </button>
                <div class="section-header">
                    <div class="form-label">Footer Message</div>
                </div>
            </div>
            <div class="section-body ${collapsedSections['footer'] ? 'collapsed' : ''}">
                <div class="form-group">
                    <label class="form-label">Footer Text</label>
                    <textarea id="footer" placeholder="Footer message">${escapeHtml(data.footer || '')}</textarea>
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="btn btn-success" style="background:#FD7E14;" onclick="copyFormatted()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Formatted Text
            </button>
        </div>
    `;

    // <button class="btn btn-primary" onclick="saveData()">
    //     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
    //         <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    //         <polyline points="17 21 17 13 7 13 7 21"></polyline>
    //         <polyline points="7 3 7 8 15 8"></polyline>
    //     </svg>
    //     Save
    // </button>
    
    content.innerHTML = html;
    setupAutoSaveListeners();
}

function addDay() {
    autoSave();
    data.days.push({
        title: '',
        activities: []
    });
    render();
}

function removeDay(idx) {
    if (confirm('Are you sure you want to remove this day?')) {
        autoSave();
        data.days.splice(idx, 1);
        render();
    }
}

function addActivity(dayIdx) {
    autoSave();
    data.days[dayIdx].activities.push({
        time: '',
        description: ''
    });
    render();
}

function removeActivity(dayIdx, actIdx) {
    if (confirm('Are you sure you want to remove this activity?')) {
        autoSave();
        data.days[dayIdx].activities.splice(actIdx, 1);
        render();
    }
}

function addSubItem(dayIdx, actIdx) {
    autoSave();
    if (!data.days[dayIdx].activities[actIdx].subItems) {
        data.days[dayIdx].activities[actIdx].subItems = [];
    }
    data.days[dayIdx].activities[actIdx].subItems.push('');
    render();
}

function removeSubItem(dayIdx, actIdx, subIdx) {
    if (confirm('Are you sure you want to remove this sub-activity?')) {
        autoSave();
        data.days[dayIdx].activities[actIdx].subItems.splice(subIdx, 1);
        if (data.days[dayIdx].activities[actIdx].subItems.length === 0) {
            delete data.days[dayIdx].activities[actIdx].subItems;
        }
        render();
    }
}

function addSection() {
    autoSave();
    data.sections.push({
        title: '',
        items: []
    });
    render();
}

function removeSection(idx) {
    if (confirm('Are you sure you want to remove this section?')) {
        autoSave();
        data.sections.splice(idx, 1);
        render();
    }
}

function addSectionItem(secIdx) {
    autoSave();
    data.sections[secIdx].items.push({
        title: '',
        description: ''
    });
    render();
}

function removeSectionItem(secIdx, itemIdx) {
    if (confirm('Are you sure you want to remove this item?')) {
        autoSave();
        data.sections[secIdx].items.splice(itemIdx, 1);
        render();
    }
}

function copyFormatted() {
    autoSave();
    
    let text = '';
    
    // Only add title if it exists
    if (data.title && data.title.trim()) {
        text += `*${data.title}*\n\n`;
    }
    
    // Only add dates if it exists
    if (data.dates && data.dates.trim()) {
        text += `Dates: *${data.dates}*\n`;
    }
    
    // Only add organizer and contacts if they exist
    if (data.organizer && data.organizer.trim()) {
        text += `Organizer: *${data.organizer}*`;
        if (data.contacts && data.contacts.trim()) {
            text += ` ( ${data.contacts} )`;
        }
        text += '\n';
    } else if (data.contacts && data.contacts.trim()) {
        text += `Contact: ${data.contacts}\n`;
    }
    
    // Add separator only if there's content above
    if (text) {
        text += '\n--------------------------\n\n';
    }

    data.days.forEach((day, idx) => {
        // Skip day if title is empty and no activities
        if (!day.title || !day.title.trim()) {
            if (!day.activities || day.activities.length === 0) {
                return;
            }
        }
        
        if (day.title && day.title.trim()) {
            text += `*${day.title}*\n\n`;
        }
        
        day.activities.forEach(act => {
            // Skip activity if both time and description are empty
            if ((!act.time || !act.time.trim()) && (!act.description || !act.description.trim())) {
                return;
            }
            
            // Format activity
            if (act.time && act.time.trim()) {
                text += `• *${act.time}*`;
                if (act.description && act.description.trim()) {
                    text += `: ${act.description}`;
                }
                text += '\n';
            } else if (act.description && act.description.trim()) {
                text += `• ${act.description}\n`;
            }
            
            // Add sub-items only if they have content
            if (act.subItems && act.subItems.length > 0) {
                act.subItems.forEach(sub => {
                    if (sub && sub.trim()) {
                        text += `     - ${sub}\n`;
                    }
                });
            }
        });
        
        if (idx < data.days.length - 1) {
            text += `\n-------------\n\n`;
        } else {
            text += `\n`;
        }
    });

    data.sections.forEach(section => {
        // Skip section if title is empty and no items
        if (!section.title || !section.title.trim()) {
            if (!section.items || section.items.length === 0) {
                return;
            }
        }
        
        // Check if section has any valid items
        const hasValidItems = section.items && section.items.some(item => 
            (item.title && item.title.trim()) || (item.description && item.description.trim())
        );
        
        if (!hasValidItems) {
            return;
        }
        
        text += `--------------------------\n\n`;
        if (section.title && section.title.trim()) {
            text += `*${section.title}*\n\n`;
        }
        
        let itemIndex = 1;
        section.items.forEach((item) => {
            // Skip item if both title and description are empty
            if ((!item.title || !item.title.trim()) && (!item.description || !item.description.trim())) {
                return;
            }
            
            if (item.title && item.title.trim()) {
                text += `*${itemIndex}. ${item.title}*`;
                if (item.description && item.description.trim()) {
                    text += `: ${item.description}`;
                }
                text += '\n';
            } else if (item.description && item.description.trim()) {
                text += `*${itemIndex}.* ${item.description}\n`;
            }
            itemIndex++;
        });
        text += `\n`;
    });

    // Only add footer if it exists
    if (data.footer && data.footer.trim()) {
        text += `--------------------------\n\n`;
        text += `*${data.footer}*\n`;
    }

    if (!text.trim()) {
        showToast('No content to copy!', 'fail');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'fail');
    });
}

// Initialize
initTheme();
loadData();
render();