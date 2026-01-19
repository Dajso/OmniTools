'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { Plus, Trash2, Download, FileImage } from 'lucide-react';

interface ClassEntry {
  id: string;
  name: string;
  instructor: string;
  location: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_OPTIONS = DAYS.map(d => ({ value: d, label: d }));

const COLORS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Lime' },
];

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7; // 7 AM to 9 PM
  return `${hour.toString().padStart(2, '0')}:00`;
});

const createEmptyClass = (): ClassEntry => ({
  id: crypto.randomUUID(),
  name: '',
  instructor: '',
  location: '',
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  color: COLORS[Math.floor(Math.random() * COLORS.length)].value,
});

export function ClassScheduleMaker() {
  const [classes, setClasses] = React.useState<ClassEntry[]>([createEmptyClass()]);
  const [scheduleTitle, setScheduleTitle] = React.useState('My Class Schedule');
  const scheduleRef = React.useRef<HTMLDivElement>(null);

  const addClass = () => {
    setClasses(prev => [...prev, createEmptyClass()]);
  };

  const removeClass = (id: string) => {
    if (classes.length > 1) {
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateClass = (id: string, field: keyof ClassEntry, value: string) => {
    setClasses(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const getClassesForDay = (day: string) => {
    return classes.filter(c => c.day === day && c.name.trim());
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getClassPosition = (classEntry: ClassEntry) => {
    const startMinutes = timeToMinutes(classEntry.startTime) - 7 * 60; // Offset from 7 AM
    const endMinutes = timeToMinutes(classEntry.endTime) - 7 * 60;
    const top = (startMinutes / 60) * 60; // 60px per hour
    const height = ((endMinutes - startMinutes) / 60) * 60;
    return { top, height: Math.max(height, 30) };
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Title
    doc.setFontSize(20);
    doc.text(scheduleTitle, 148, 15, { align: 'center' });
    
    // Draw grid
    const startX = 30;
    const startY = 25;
    const dayWidth = 35;
    const hourHeight = 10;
    const hours = 14; // 7 AM to 9 PM
    
    doc.setFontSize(10);
    doc.setDrawColor(200);
    
    // Draw day headers
    DAYS.slice(0, 5).forEach((day, i) => {
      doc.setFillColor(240, 240, 240);
      doc.rect(startX + i * dayWidth, startY, dayWidth, 8, 'F');
      doc.text(day, startX + i * dayWidth + dayWidth / 2, startY + 5, { align: 'center' });
    });
    
    // Draw time labels and grid
    for (let h = 0; h <= hours; h++) {
      const y = startY + 8 + h * hourHeight;
      const hour = h + 7;
      doc.setFontSize(8);
      doc.text(`${hour}:00`, startX - 2, y + 3, { align: 'right' });
      doc.line(startX, y, startX + 5 * dayWidth, y);
    }
    
    // Draw vertical lines
    for (let d = 0; d <= 5; d++) {
      doc.line(startX + d * dayWidth, startY + 8, startX + d * dayWidth, startY + 8 + hours * hourHeight);
    }
    
    // Draw classes
    classes.filter(c => c.name.trim()).forEach(classEntry => {
      const dayIndex = DAYS.indexOf(classEntry.day);
      if (dayIndex >= 5) return; // Skip weekend for PDF
      
      const startMinutes = timeToMinutes(classEntry.startTime) - 7 * 60;
      const endMinutes = timeToMinutes(classEntry.endTime) - 7 * 60;
      const top = startY + 8 + (startMinutes / 60) * hourHeight;
      const height = ((endMinutes - startMinutes) / 60) * hourHeight;
      const x = startX + dayIndex * dayWidth;
      
      // Parse color
      const hex = classEntry.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      doc.setFillColor(r, g, b);
      doc.rect(x + 1, top, dayWidth - 2, height, 'F');
      
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(classEntry.name, x + 2, top + 4);
      if (height > 8) {
        doc.text(classEntry.location, x + 2, top + 8);
      }
      doc.setTextColor(0, 0, 0);
    });
    
    doc.save('class-schedule.pdf');
  };

  const exportToImage = async () => {
    if (!scheduleRef.current) return;
    
    // Use html2canvas if available, otherwise create a simple canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 1200;
    canvas.height = 800;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scheduleTitle, canvas.width / 2, 40);
    
    // Grid setup
    const startX = 80;
    const startY = 60;
    const dayWidth = 200;
    const hourHeight = 45;
    const hours = 14;
    
    // Draw day headers
    ctx.font = 'bold 14px Arial';
    DAYS.slice(0, 5).forEach((day, i) => {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(startX + i * dayWidth, startY, dayWidth, 25);
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText(day, startX + i * dayWidth + dayWidth / 2, startY + 17);
    });
    
    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let h = 0; h <= hours; h++) {
      const y = startY + 25 + h * hourHeight;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + 5 * dayWidth, y);
      ctx.stroke();
      
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${h + 7}:00`, startX - 10, y + 4);
    }
    
    for (let d = 0; d <= 5; d++) {
      ctx.beginPath();
      ctx.moveTo(startX + d * dayWidth, startY + 25);
      ctx.lineTo(startX + d * dayWidth, startY + 25 + hours * hourHeight);
      ctx.stroke();
    }
    
    // Draw classes
    classes.filter(c => c.name.trim()).forEach(classEntry => {
      const dayIndex = DAYS.indexOf(classEntry.day);
      if (dayIndex >= 5) return;
      
      const startMinutes = timeToMinutes(classEntry.startTime) - 7 * 60;
      const endMinutes = timeToMinutes(classEntry.endTime) - 7 * 60;
      const top = startY + 25 + (startMinutes / 60) * hourHeight;
      const height = ((endMinutes - startMinutes) / 60) * hourHeight;
      const x = startX + dayIndex * dayWidth;
      
      ctx.fillStyle = classEntry.color;
      ctx.fillRect(x + 2, top + 2, dayWidth - 4, height - 4);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(classEntry.name, x + 8, top + 18);
      if (height > 30) {
        ctx.font = '11px Arial';
        ctx.fillText(classEntry.location, x + 8, top + 32);
      }
    });
    
    // Download
    const link = document.createElement('a');
    link.download = 'class-schedule.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule Maker</CardTitle>
          <CardDescription>Create your class schedule and export as PDF or image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="scheduleTitle" className="text-sm font-medium">Schedule Title</label>
            <Input
              id="scheduleTitle"
              value={scheduleTitle}
              onChange={(e) => setScheduleTitle(e.target.value)}
              placeholder="My Class Schedule"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Classes</h3>
              <Button type="button" variant="outline" size="sm" onClick={addClass} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </div>

            {classes.map((classEntry, index) => (
              <Card key={classEntry.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={classEntry.name}
                      onChange={(e) => updateClass(classEntry.id, 'name', e.target.value)}
                      placeholder={`Class ${index + 1} Name`}
                      className="flex-1"
                    />
                    {classes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClass(classEntry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={classEntry.instructor}
                      onChange={(e) => updateClass(classEntry.id, 'instructor', e.target.value)}
                      placeholder="Instructor"
                    />
                    <Input
                      value={classEntry.location}
                      onChange={(e) => updateClass(classEntry.id, 'location', e.target.value)}
                      placeholder="Room/Location"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <SelectInput
                      id={`day-${classEntry.id}`}
                      label="Day"
                      value={classEntry.day}
                      onChange={(v) => updateClass(classEntry.id, 'day', v)}
                      options={DAY_OPTIONS}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start</label>
                      <Input
                        type="time"
                        value={classEntry.startTime}
                        onChange={(e) => updateClass(classEntry.id, 'startTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End</label>
                      <Input
                        type="time"
                        value={classEntry.endTime}
                        onChange={(e) => updateClass(classEntry.id, 'endTime', e.target.value)}
                      />
                    </div>
                    <SelectInput
                      id={`color-${classEntry.id}`}
                      label="Color"
                      value={classEntry.color}
                      onChange={(v) => updateClass(classEntry.id, 'color', v)}
                      options={COLORS}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={exportToPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={exportToImage} variant="outline" className="gap-2">
            <FileImage className="h-4 w-4" />
            Export Image
          </Button>
        </CardFooter>
      </Card>

      {/* Schedule Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={scheduleRef} className="overflow-x-auto">
            <div className="min-w-[800px]">
              <h3 className="text-lg font-bold text-center mb-4">{scheduleTitle}</h3>
              <div className="grid grid-cols-6 gap-px bg-border">
                {/* Time column header */}
                <div className="bg-background p-2 font-medium text-center text-sm">Time</div>
                {/* Day headers */}
                {DAYS.slice(0, 5).map(day => (
                  <div key={day} className="bg-muted p-2 font-medium text-center text-sm">
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {TIME_SLOTS.map(time => (
                  <React.Fragment key={time}>
                    <div className="bg-background p-2 text-xs text-muted-foreground border-t">
                      {time}
                    </div>
                    {DAYS.slice(0, 5).map(day => {
                      const dayClasses = getClassesForDay(day).filter(c => {
                        const classStart = timeToMinutes(c.startTime);
                        const slotStart = timeToMinutes(time);
                        return classStart >= slotStart && classStart < slotStart + 60;
                      });
                      
                      return (
                        <div key={`${day}-${time}`} className="bg-background border-t relative min-h-[60px]">
                          {dayClasses.map(classEntry => {
                            const pos = getClassPosition(classEntry);
                            return (
                              <div
                                key={classEntry.id}
                                className="absolute left-0 right-0 mx-1 rounded p-1 text-white text-xs overflow-hidden"
                                style={{
                                  backgroundColor: classEntry.color,
                                  top: `${pos.top % 60}px`,
                                  height: `${pos.height}px`,
                                }}
                              >
                                <div className="font-medium truncate">{classEntry.name}</div>
                                {pos.height > 30 && (
                                  <div className="truncate opacity-90">{classEntry.location}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ClassScheduleMaker;
