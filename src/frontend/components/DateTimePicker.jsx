const { useState, useEffect } = React;

function DateTimePicker({ value, onChange, label, required }) {
    // Determine initial state from value or current date
    const initialDate = value ? new Date(value) : new Date();

    // Check if initialDate is valid, otherwise use current
    const safeDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

    // Helper to format time input value (HH:mm)
    const formatTimeInput = (h, m) => {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const [selectedDate, setSelectedDate] = useState({
        day: safeDate.getDate(),
        month: safeDate.getMonth(), // 0-indexed
        year: safeDate.getFullYear(),
        hours: safeDate.getHours(),
        minutes: safeDate.getMinutes()
    });

    // Sync individual state updates to parent
    useEffect(() => {
        const d = new Date(
            selectedDate.year,
            selectedDate.month,
            selectedDate.day,
            selectedDate.hours,
            selectedDate.minutes
        );
        // Format: YYYY-MM-DDTHH:mm
        // Handle timezone offset to keep local time correct in ISO string
        const isoString = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        if (value !== isoString) {
            onChange(isoString);
        }
    }, [selectedDate, onChange]);

    // Update state when external value changes (e.g. initial load or reset)
    useEffect(() => {
        if (!value) return;
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
            setSelectedDate({
                day: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear(),
                hours: d.getHours(),
                minutes: d.getMinutes()
            });
        }
    }, [value]);

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Generate time slots (15 min intervals) for the scroller
    const timeSlots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            timeSlots.push({ h, m });
        }
    }

    const handleDateChange = (field, val) => {
        setSelectedDate(prev => ({ ...prev, [field]: parseInt(val) }));
    };

    const handleTimeSelect = (h, m) => {
        setSelectedDate(prev => ({ ...prev, hours: h, minutes: m }));
    };

    // Handle manual time input change
    const handleManualTimeChange = (e) => {
        const [h, m] = e.target.value.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) {
            setSelectedDate(prev => ({ ...prev, hours: h, minutes: m }));
        }
    };

    // Quick Presets Logic
    const setPreset = (minutesAgo) => {
        const now = new Date();
        const targetTime = new Date(now.getTime() - minutesAgo * 60000);

        setSelectedDate({
            day: targetTime.getDate(),
            month: targetTime.getMonth(),
            year: targetTime.getFullYear(),
            hours: targetTime.getHours(),
            minutes: targetTime.getMinutes()
        });
    };

    // Days in current month
    const daysInMonth = new Date(selectedDate.year, selectedDate.month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>

            {/* Date Selectors */}
            <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                    <select
                        value={selectedDate.day}
                        onChange={(e) => handleDateChange('day', e.target.value)}
                        className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 py-2.5 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                <div className="relative">
                    <select
                        value={selectedDate.month}
                        onChange={(e) => handleDateChange('month', e.target.value)}
                        className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 py-2.5 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                        {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                <div className="relative">
                    <select
                        value={selectedDate.year}
                        onChange={(e) => handleDateChange('year', e.target.value)}
                        className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 py-2.5 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    >
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            {/* Time Input & Presets */}
            <div className="flex flex-col gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Select Time</div>

                <div className="flex gap-2">
                    <input
                        type="time"
                        value={formatTimeInput(selectedDate.hours, selectedDate.minutes)}
                        onChange={handleManualTimeChange}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                </div>

                <div className="flex gap-2">
                    <button type="button" onClick={() => setPreset(0)} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-medium py-2 rounded-lg transition-colors">
                        Now
                    </button>
                    <button type="button" onClick={() => setPreset(30)} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-medium py-2 rounded-lg transition-colors">
                        30 Min Ago
                    </button>
                    <button type="button" onClick={() => setPreset(60)} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-medium py-2 rounded-lg transition-colors">
                        1 Hour Ago
                    </button>
                </div>
            </div>


            <p className="text-xs text-slate-500 italic flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Selected: {new Date(selectedDate.year, selectedDate.month, selectedDate.day, selectedDate.hours, selectedDate.minutes).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
        </div>
    );
}

window.DateTimePicker = DateTimePicker;
