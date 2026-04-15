"use client";

import { useState } from "react";

interface ReservationSummary {
    id: string;
    userName: string;
    spaceName: string;
    startDate: Date;
    endDate: Date;
    status: string;
}

interface DashboardCalendarProps {
    reservations: ReservationSummary[];
}

export default function DashboardCalendar({ reservations }: DashboardCalendarProps) {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);

    // Lógica del calendario
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(today);

    // Obtener reservaciones para un día específico
    const getReservationsForDay = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        date.setHours(0, 0, 0, 0);

        return reservations.filter(res => {
            const start = new Date(res.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(res.endDate);
            end.setHours(0, 0, 0, 0);
            return date >= start && date <= end;
        });
    };

    const selectedDayReservations = selectedDate 
        ? getReservationsForDay(selectedDate.getDate())
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendario Grid */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 capitalize">{monthName} {currentYear}</h3>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pagado
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Aprobado
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pendiente
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="bg-slate-50 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                    
                    {blanks.map(i => <div key={`blank-${i}`} className="bg-white h-16 md:h-24"></div>)}
                    
                    {days.map(day => {
                        const dayReservations = getReservationsForDay(day);
                        const isToday = day === today.getDate();
                        const isSelected = selectedDate?.getDate() === day;

                        return (
                            <button
                                type="button"
                                key={day}
                                onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                                className={`bg-white h-16 md:h-24 p-2 transition-all relative group hover:bg-slate-50 flex flex-col items-center md:items-start
                                    ${isSelected ? 'ring-2 ring-inset ring-emerald-500 z-10' : ''}
                                `}
                            >
                                <span className={`text-sm font-bold ${isToday ? 'bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-600'}`}>
                                    {day}
                                </span>
                                
                                <div className="mt-1 flex flex-wrap gap-1 md:gap-1.5 justify-center md:justify-start overflow-hidden">
                                    {dayReservations.slice(0, 4).map((res, idx) => (
                                        <div 
                                            key={`${res.id}-${idx}`}
                                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full 
                                                ${res.status === 'PAID' ? 'bg-emerald-500' : 
                                                  res.status === 'APPROVED' ? 'bg-blue-500' : 'bg-amber-500'}
                                            `}
                                        ></div>
                                    ))}
                                    {dayReservations.length > 4 && (
                                        <span className="text-[8px] font-bold text-slate-400">+{dayReservations.length - 4}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Detalles del día seleccionado */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl h-fit lg:sticky lg:top-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Detalle del Día</h4>
                        <p className="text-slate-400 text-xs">
                            {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedDayReservations.length === 0 ? (
                        <div className="text-center py-8 opacity-50">
                            <p className="text-sm">No hay reservaciones para este día.</p>
                        </div>
                    ) : (
                        selectedDayReservations.map(res => (
                            <div key={res.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-bold truncate pr-2">{res.userName || "Sin nombre"}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight
                                        ${res.status === 'PAID' ? 'bg-emerald-500 text-white' : 
                                          res.status === 'APPROVED' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'}
                                    `}>
                                        {res.status === 'PAID' ? 'Pagado' : res.status === 'APPROVED' ? 'Apro.' : 'Pend.'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 overflow-hidden">
                                    <span className="truncate">⛺ {res.spaceName}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-500">
                        Total en este día: <strong>{selectedDayReservations.length} ocupantes</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
