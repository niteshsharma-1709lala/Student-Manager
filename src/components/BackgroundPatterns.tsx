import React from 'react';
import { Book, PenTool, Pencil, Ruler, Scissors, BookOpen, Calculator, Backpack, GraduationCap, Compass, Paperclip, Highlighter, Eraser, StickyNote, FolderOpen, Palette, Clipboard } from 'lucide-react';

export function BackgroundPatterns() {
  // Using fixed positions to avoid hydration mismatch and keep it stable
  const items = [
    { Icon: Book, top: '10%', left: '5%', rotate: 12, size: 48 },
    { Icon: Pencil, top: '25%', left: '85%', rotate: -15, size: 64 },
    { Icon: Ruler, top: '40%', left: '10%', rotate: 45, size: 56 },
    { Icon: Calculator, top: '60%', left: '80%', rotate: -10, size: 72 },
    { Icon: Backpack, top: '75%', left: '15%', rotate: 20, size: 60 },
    { Icon: Compass, top: '15%', left: '50%', rotate: -30, size: 50 },
    { Icon: BookOpen, top: '85%', left: '55%', rotate: 5, size: 68 },
    { Icon: GraduationCap, top: '50%', left: '45%', rotate: -25, size: 70 },
    { Icon: PenTool, top: '35%', left: '25%', rotate: 15, size: 45 },
    { Icon: Scissors, top: '80%', left: '90%', rotate: -40, size: 55 },
    { Icon: Paperclip, top: '5%', left: '30%', rotate: 45, size: 40 },
    { Icon: Highlighter, top: '45%', left: '75%', rotate: -60, size: 50 },
    { Icon: Eraser, top: '20%', left: '70%', rotate: 15, size: 45 },
    { Icon: StickyNote, top: '65%', left: '30%', rotate: -15, size: 55 },
    { Icon: FolderOpen, top: '90%', left: '35%', rotate: 10, size: 60 },
    { Icon: Palette, top: '55%', left: '5%', rotate: -20, size: 65 },
    { Icon: Clipboard, top: '10%', left: '90%', rotate: 25, size: 50 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item, i) => {
        const { Icon, top, left, rotate, size } = item;
        return (
          <div
            key={i}
            className="absolute text-slate-600 opacity-60 transition-transform duration-1000 ease-in-out"
            style={{
              top,
              left,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
